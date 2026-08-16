"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, education } from "@/db";
import { educationSchema } from "@/lib/validations";

function revalidateEducationPages() {
  revalidatePath("/about");
  revalidatePath("/admin/education");
}

export async function createEducation(_prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = educationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.select().from(education).where(eq(education.id, parsed.data.id)).limit(1);
  if (existing[0]) {
    return { error: `An education entry with id "${parsed.data.id}" already exists.` };
  }

  await db.insert(education).values({
    ...parsed.data,
    endDate: parsed.data.endDate || null,
    gpa: parsed.data.gpa || null,
    location: parsed.data.location || null,
    description: parsed.data.description || null,
    thesis: parsed.data.thesis || null,
  });

  revalidateEducationPages();
  redirect("/admin/education");
}

export async function updateEducation(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = educationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db
    .update(education)
    .set({
      ...parsed.data,
      endDate: parsed.data.endDate || null,
      gpa: parsed.data.gpa || null,
      location: parsed.data.location || null,
      description: parsed.data.description || null,
      thesis: parsed.data.thesis || null,
    })
    .where(eq(education.id, id));

  revalidateEducationPages();
  redirect("/admin/education");
}

export async function deleteEducation(id: string) {
  await db.delete(education).where(eq(education.id, id));
  revalidateEducationPages();
}
