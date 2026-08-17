"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, ApiError } from "@/lib/api/server";
import { getProjectById } from "@/lib/api/queries";
import { projectSchema } from "@/lib/validations";

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

  // The Go API upserts by id — do the "already exists" check here to keep
  // create from silently overwriting an existing entry.
  const existing = await getProjectById(parsed.data.id);
  if (existing) {
    return { error: `A project with id "${parsed.data.id}" already exists.` };
  }

  try {
    await adminFetch("/api/admin/projects", {
      method: "POST",
      body: JSON.stringify({
        ...parsed.data,
        endDate: parsed.data.endDate || null,
        status: parsed.data.status || null,
        longDescription: parsed.data.longDescription || null,
        impact: parsed.data.impact || null,
      }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to create project." };
  }

  revalidateProjectPages();
  redirect("/admin/projects");
}

export async function updateProject(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  // Old image cleanup in MinIO happens server-side in the Go API itself.
  try {
    await adminFetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...parsed.data,
        endDate: parsed.data.endDate || null,
        status: parsed.data.status || null,
        longDescription: parsed.data.longDescription || null,
        impact: parsed.data.impact || null,
      }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update project." };
  }

  revalidateProjectPages();
  revalidatePath(`/projects/${id}`);
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await adminFetch(`/api/admin/projects/${id}`, { method: "DELETE" });
  revalidateProjectPages();
}
