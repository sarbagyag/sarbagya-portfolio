"use server";

import { ApiError, adminFetch } from "@/lib/api/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB, matches the Go API's own cap
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];

export async function uploadFile(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file provided." };
  }
  if (file.size > MAX_SIZE) {
    return { error: "File too large (max 5MB)." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Unsupported file type." };
  }

  // Forward straight through to the Go API's multipart handler — it does
  // the actual MinIO upload and returns the public URL. adminFetch gates
  // this behind the admin session, same as everything else under /admin.
  const uploadForm = new FormData();
  uploadForm.set("file", file);

  try {
    const { url } = await adminFetch<{ url: string }>("/api/admin/upload", {
      method: "POST",
      body: uploadForm,
    });
    return { url };
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Upload failed." };
  }
}
