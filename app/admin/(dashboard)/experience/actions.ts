"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, experience, experienceSubRoles } from "@/db";
import { experienceSchema } from "@/lib/validations";

function parseFormData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const subRolesJson = String(formData.get("subRolesJson") ?? "[]");

  let subRoles: unknown[] = [];
  try {
    subRoles = JSON.parse(subRolesJson);
  } catch {
    subRoles = [];
  }

  return experienceSchema.safeParse({ ...raw, subRoles });
}

async function saveSubRoles(experienceId: string, subRoles: { title: string; company: string; startDate: string; endDate?: string; description: string; responsibilities: string[]; technologies: string[]; achievements: string[] }[]) {
  await db.delete(experienceSubRoles).where(eq(experienceSubRoles.experienceId, experienceId));
  if (subRoles.length === 0) return;

  await db.insert(experienceSubRoles).values(
    subRoles.map((sr, index) => ({
      experienceId,
      title: sr.title,
      company: sr.company,
      startDate: sr.startDate,
      endDate: sr.endDate || null,
      description: sr.description,
      responsibilities: sr.responsibilities,
      technologies: sr.technologies,
      achievements: sr.achievements,
      sortOrder: index,
    }))
  );
}

function revalidateExperiencePages() {
  revalidatePath("/experience");
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function createExperience(_prevState: { error?: string } | undefined, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { subRoles, ...data } = parsed.data;

  const existing = await db.select().from(experience).where(eq(experience.id, data.id)).limit(1);
  if (existing[0]) {
    return { error: `An experience entry with id "${data.id}" already exists.` };
  }

  await db.insert(experience).values({
    ...data,
    endDate: data.endDate || null,
    location: data.location || null,
    companyUrl: data.companyUrl || null,
  });
  await saveSubRoles(data.id, subRoles);

  revalidateExperiencePages();
  redirect("/admin/experience");
}

export async function updateExperience(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { subRoles, ...data } = parsed.data;

  await db
    .update(experience)
    .set({
      ...data,
      endDate: data.endDate || null,
      location: data.location || null,
      companyUrl: data.companyUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(experience.id, id));
  await saveSubRoles(id, subRoles);

  revalidateExperiencePages();
  redirect("/admin/experience");
}

export async function deleteExperience(id: string) {
  await db.delete(experience).where(eq(experience.id, id));
  revalidateExperiencePages();
}
