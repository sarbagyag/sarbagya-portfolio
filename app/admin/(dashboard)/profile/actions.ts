"use server";

import { revalidatePath } from "next/cache";
import { adminFetch, ApiError } from "@/lib/api/server";
import { profileSchema } from "@/lib/validations";

export async function updateProfile(_prevState: { error?: string; success?: boolean } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    // The Go API deletes the old avatar/resume file in MinIO itself when a
    // replaced or cleared URL comes through — no client-side cleanup needed.
    await adminFetch("/api/admin/profile", {
      method: "PUT",
      body: JSON.stringify(parsed.data),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to save profile." };
  }

  // Profile data appears on the homepage hero, about, and contact pages.
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/profile");

  return { success: true };
}
