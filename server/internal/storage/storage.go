// Package storage wraps MinIO (S3-compatible) for file uploads — the direct
// replacement for what Supabase Storage was doing. Same shape as before:
// upload returns a public URL, and callers pass that URL back in to
// DeleteIfChanged/Delete so replacing or removing an image field also
// cleans up the underlying object instead of leaking storage forever.
package storage

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/url"
	"path"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

const MaxUploadSize = 5 << 20 // 5MB, matches the old Supabase bucket limit

var AllowedContentTypes = map[string]bool{
	"image/png":       true,
	"image/jpeg":      true,
	"image/webp":      true,
	"image/gif":       true,
	"application/pdf": true,
}

type Client struct {
	minio      *minio.Client
	bucket     string
	publicBase string // e.g. https://cdn.example.com or https://example.com/media
}

func New(endpoint, accessKey, secretKey, bucket, publicBase string, useSSL bool) (*Client, error) {
	mc, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("create minio client: %w", err)
	}

	c := &Client{minio: mc, bucket: bucket, publicBase: strings.TrimSuffix(publicBase, "/")}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	exists, err := mc.BucketExists(ctx, bucket)
	if err != nil {
		return nil, fmt.Errorf("check bucket: %w", err)
	}
	if !exists {
		if err := mc.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}); err != nil {
			return nil, fmt.Errorf("create bucket: %w", err)
		}
		if err := mc.SetBucketPolicy(ctx, bucket, publicReadPolicy(bucket)); err != nil {
			return nil, fmt.Errorf("set bucket policy: %w", err)
		}
	}

	return c, nil
}

// Upload stores the file under a random key (preserving the extension) and
// returns its public URL.
func (c *Client) Upload(ctx context.Context, file multipart.File, header *multipart.FileHeader) (string, error) {
	contentType := header.Header.Get("Content-Type")
	if !AllowedContentTypes[contentType] {
		return "", fmt.Errorf("unsupported file type: %s", contentType)
	}
	if header.Size > MaxUploadSize {
		return "", fmt.Errorf("file exceeds 5MB limit")
	}

	key := fmt.Sprintf("%s%s", uuid.NewString(), path.Ext(header.Filename))

	_, err := c.minio.PutObject(ctx, c.bucket, key, file, header.Size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", fmt.Errorf("upload object: %w", err)
	}

	return fmt.Sprintf("%s/%s/%s", c.publicBase, c.bucket, key), nil
}

// Delete removes the object a public URL points to, if it belongs to our
// bucket. Safe to call with URLs from elsewhere — those are silently
// ignored rather than erroring, since callers pass through whatever's
// already stored on the row.
func (c *Client) Delete(ctx context.Context, publicURL string) error {
	key, ok := c.keyFromURL(publicURL)
	if !ok {
		return nil
	}
	return c.minio.RemoveObject(ctx, c.bucket, key, minio.RemoveObjectOptions{})
}

// DeleteIfChanged deletes the old object only when the new value actually
// differs from it — the common "editing a form, image field unchanged"
// case must not delete a file still in use.
func (c *Client) DeleteIfChanged(ctx context.Context, oldURL, newURL string) error {
	if oldURL == "" || oldURL == newURL {
		return nil
	}
	return c.Delete(ctx, oldURL)
}

func (c *Client) keyFromURL(publicURL string) (string, bool) {
	prefix := fmt.Sprintf("%s/%s/", c.publicBase, c.bucket)
	if !strings.HasPrefix(publicURL, prefix) {
		return "", false
	}
	key, err := url.QueryUnescape(strings.TrimPrefix(publicURL, prefix))
	if err != nil || key == "" {
		return "", false
	}
	return key, true
}

func publicReadPolicy(bucket string) string {
	return fmt.Sprintf(`{
		"Version": "2012-10-17",
		"Statement": [{
			"Effect": "Allow",
			"Principal": {"AWS": ["*"]},
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::%s/*"]
		}]
	}`, bucket)
}

// Drain fully reads and discards a multipart file — used when an upload is
// rejected after the fact so the connection can be reused cleanly.
func Drain(r io.Reader) {
	_, _ = io.Copy(io.Discard, r)
}
