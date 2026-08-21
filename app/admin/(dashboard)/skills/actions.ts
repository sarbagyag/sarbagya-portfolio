"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, ApiError } from "@/lib/api/server";
import { skillSchema } from "@/lib/validations";

function revalidateSkillsPages() {
  revalidatePath("/about");
  revalidatePath("/admin/skills");
}

export async function createSkill(_prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = skillSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await adminFetch("/api/admin/skills", {
      method: "POST",
      body: JSON.stringify({ ...parsed.data, proficiency: parsed.data.proficiency || null }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to create skill group." };
  }

  revalidateSkillsPages();
  redirect("/admin/skills");
}

export async function updateSkill(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = skillSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await adminFetch(`/api/admin/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...parsed.data, proficiency: parsed.data.proficiency || null }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update skill group." };
  }

  revalidateSkillsPages();
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  await adminFetch(`/api/admin/skills/${id}`, { method: "DELETE" });
  revalidateSkillsPages();
}
