"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, ApiError } from "@/lib/api/server";
import { getEducation, getEducationById } from "@/lib/api/queries";
import { nextSortOrder } from "@/lib/api/sort-order";
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
  const entries = await getEducation();
  if (entries.some((e) => e.id === parsed.data.id)) {
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
        sortOrder: nextSortOrder(entries),
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

  // sortOrder isn't editable from the form (it's set by dragging on the list
  // page) — carry the existing value through so a save doesn't reset it.
  const existing = await getEducationById(id);

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
        sortOrder: existing?.sortOrder ?? 0,
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

export async function reorderEducation(ids: string[]) {
  await adminFetch("/api/admin/education/reorder", {
    method: "PATCH",
    body: JSON.stringify({ ids }),
  });
  revalidateEducationPages();
}
