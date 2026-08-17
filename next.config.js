/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Production MinIO, path-routed behind Traefik (docker-compose.yml).
        protocol: "https",
        hostname: "portfolio.mandalafoods.co",
        pathname: "/media/**",
      },
      {
        // Local dev MinIO (docker compose up), served directly on :9000.
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/media/**",
      },
    ],
  },
  experimental: {
    // Next's default Server Action body limit is 1MB, well under the Go
    // API's own 5MB upload cap (server/internal/storage) — file uploads
    // (app/admin/upload-actions.ts) go through a Server Action, so this
    // has to be raised to match or nothing near that limit can get through.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

module.exports = nextConfig;
