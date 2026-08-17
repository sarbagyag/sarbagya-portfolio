"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, ApiError } from "@/lib/api/server";
import { getEducationById } from "@/lib/api/queries";
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

  // The Go API upserts by id — do the "already exists" check here to keep
  // create from silently overwriting an existing entry.
  const existing = await getEducationById(parsed.data.id);
  if (existing) {
    return { error: `An education entry with id "${parsed.data.id}" already exists.` };
  }

  try {
    await adminFetch("/api/admin/education", {
      method: "POST",
      body: JSON.stringify({
        ...parsed.data,
        endDate: parsed.data.endDate || null,
        gpa: parsed.data.gpa || null,
        location: parsed.data.location || null,
        description: parsed.data.description || null,
        thesis: parsed.data.thesis || null,
      }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to create education entry." };
  }

  revalidateEducationPages();
  redirect("/admin/education");
}

export async function updateEducation(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = educationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await adminFetch(`/api/admin/education/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...parsed.data,
        endDate: parsed.data.endDate || null,
        gpa: parsed.data.gpa || null,
        location: parsed.data.location || null,
        description: parsed.data.description || null,
        thesis: parsed.data.thesis || null,
      }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update education entry." };
  }

  revalidateEducationPages();
  redirect("/admin/education");
}

export async function deleteEducation(id: string) {
  await adminFetch(`/api/admin/education/${id}`, { method: "DELETE" });
  revalidateEducationPages();
}
