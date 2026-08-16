/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    // Next's default Server Action body limit is 1MB, well under the
    // Supabase "media" bucket's own 5MB per-file limit — file uploads
    // (app/admin/upload-actions.ts) go through a Server Action, so this
    // has to be raised to match or nothing near the bucket's real limit
    // can ever get through.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

module.exports = nextConfig;
