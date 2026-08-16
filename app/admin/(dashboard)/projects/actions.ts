"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, projects } from "@/db";
import { projectSchema } from "@/lib/validations";
import { deleteStorageFileIfChanged, deleteStorageFiles } from "@/lib/supabase/storage";

function revalidateProjectPages() {
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function createProject(_prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.select().from(projects).where(eq(projects.id, parsed.data.id)).limit(1);
  if (existing[0]) {
    return { error: `A project with id "${parsed.data.id}" already exists.` };
  }

  await db.insert(projects).values({
    ...parsed.data,
    endDate: parsed.data.endDate || null,
    status: parsed.data.status || null,
    longDescription: parsed.data.longDescription || null,
    impact: parsed.data.impact || null,
  });

  revalidateProjectPages();
  redirect("/admin/projects");
}

export async function updateProject(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  await deleteStorageFileIfChanged(existing[0]?.imageUrl, parsed.data.imageUrl || null);

  await db
    .update(projects)
    .set({
      ...parsed.data,
      endDate: parsed.data.endDate || null,
      status: parsed.data.status || null,
      longDescription: parsed.data.longDescription || null,
      impact: parsed.data.impact || null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  revalidateProjectPages();
  revalidatePath(`/projects/${id}`);
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

  await db.delete(projects).where(eq(projects.id, id));
  await deleteStorageFiles([existing[0]?.imageUrl]);

  revalidateProjectPages();
}
