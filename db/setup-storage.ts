import "./load-env";
import { createAdminClient } from "../lib/supabase/admin";

const BUCKET = "media";

async function main() {
  const supabase = createAdminClient();

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw listError;
  }

  if (buckets.some((b) => b.name === BUCKET)) {
    console.log(`[storage] Bucket "${BUCKET}" already exists — skipping.`);
    process.exit(0);
  }

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "5MB",
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"],
  });

  if (error) {
    throw error;
  }

  console.log(`[storage] Created public bucket "${BUCKET}" (avatars, resumes, post cover images).`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[storage] Setup failed:", err);
  process.exit(1);
});
