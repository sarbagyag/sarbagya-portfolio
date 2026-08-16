"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, skills } from "@/db";
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

  await db.insert(skills).values({
    ...parsed.data,
    proficiency: parsed.data.proficiency || null,
  });

  revalidateSkillsPages();
  redirect("/admin/skills");
}

export async function updateSkill(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = skillSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db
    .update(skills)
    .set({ ...parsed.data, proficiency: parsed.data.proficiency || null })
    .where(eq(skills.id, id));

  revalidateSkillsPages();
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  await db.delete(skills).where(eq(skills.id, id));
  revalidateSkillsPages();
}
