"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, ApiError } from "@/lib/api/server";
import { getSkillById, getSkills } from "@/lib/api/queries";
import { nextSortOrder } from "@/lib/api/sort-order";
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

  const items = await getSkills();

  try {
    await adminFetch("/api/admin/skills", {
      method: "POST",
      body: JSON.stringify({
        ...parsed.data,
        proficiency: parsed.data.proficiency || null,
        sortOrder: nextSortOrder(items),
      }),
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

  // sortOrder isn't editable from the form (it's set by dragging on the list
  // page) — carry the existing value through so a save doesn't reset it.
  const existing = await getSkillById(id);

  try {
    await adminFetch(`/api/admin/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...parsed.data,
        proficiency: parsed.data.proficiency || null,
        sortOrder: existing?.sortOrder ?? 0,
      }),
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

export async function reorderSkills(ids: string[]) {
  await adminFetch("/api/admin/skills/reorder", {
    method: "PATCH",
    body: JSON.stringify({ ids }),
  });
  revalidateSkillsPages();
}
