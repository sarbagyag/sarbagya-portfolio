import { createAdminClient } from "./admin";

const BUCKET = "media";

// Supabase public URLs look like:
// https://<project>.supabase.co/storage/v1/object/public/media/<path>
// Extract just the <path> part so we can pass it to storage.remove().
function extractStoragePath(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null; // not a file in our bucket (e.g. external URL) — leave it alone
  return url.slice(idx + marker.length);
}

/** Deletes a single file from Storage, given its public URL. No-op for non-Storage URLs. */
export async function deleteStorageFile(url: string | null | undefined) {
  const path = extractStoragePath(url);
  if (!path) return;

  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error(`[storage] Failed to delete ${path}:`, error.message);
  }
}

/** Deletes whichever of `oldUrl`/`newUrl` differ and point at a Storage file — i.e. cleans up the old file on replace, without touching it if unchanged. */
export async function deleteStorageFileIfChanged(oldUrl: string | null | undefined, newUrl: string | null | undefined) {
  if (oldUrl && oldUrl !== newUrl) {
    await deleteStorageFile(oldUrl);
  }
}

/** Deletes multiple files (e.g. all of a deleted post's associated media) at once. */
export async function deleteStorageFiles(urls: (string | null | undefined)[]) {
  const paths = urls.map(extractStoragePath).filter((p): p is string => p !== null);
  if (paths.length === 0) return;

  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).remove(paths);
  if (error) {
    console.error("[storage] Failed to delete files:", error.message);
  }
}
