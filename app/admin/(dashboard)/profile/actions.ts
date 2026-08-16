"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, profile } from "@/db";
import { profileSchema } from "@/lib/validations";
import { deleteStorageFileIfChanged } from "@/lib/supabase/storage";

export async function updateProfile(_prevState: { error?: string; success?: boolean } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.select().from(profile).where(eq(profile.id, 1)).limit(1);
  // Avatar/resume replaced or cleared — clean up the old file in Storage.
  await deleteStorageFileIfChanged(existing[0]?.avatarUrl, parsed.data.avatarUrl || null);
  await deleteStorageFileIfChanged(existing[0]?.resumeUrl, parsed.data.resumeUrl || null);

  await db
    .insert(profile)
    .values({ id: 1, ...parsed.data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: profile.id,
      set: { ...parsed.data, updatedAt: new Date() },
    });

  // Profile data appears on the homepage hero, about, and contact pages.
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/profile");

  return { success: true };
}
