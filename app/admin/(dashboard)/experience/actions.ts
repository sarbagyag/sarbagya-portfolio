"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, ApiError } from "@/lib/api/server";
import { getExperienceById } from "@/lib/api/queries";
import { experienceSchema, type ExperienceSubRoleInput } from "@/lib/validations";

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

// The Go API replaces all of an experience entry's sub-roles on every save
// (no per-row IDs from the client), and persists sortOrder verbatim — so it
// has to be assigned here from array position, same as the old Drizzle path did.
function buildSubRolesPayload(subRoles: ExperienceSubRoleInput[]) {
  return subRoles.map((sr, index) => ({
    ...sr,
    endDate: sr.endDate || null,
    sortOrder: index,
  }));
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

  // The Go API upserts by id — do the "already exists" check here to keep
  // create from silently overwriting an existing entry.
  const existing = await getExperienceById(data.id);
  if (existing) {
    return { error: `An experience entry with id "${data.id}" already exists.` };
  }

  try {
    await adminFetch("/api/admin/experience", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        endDate: data.endDate || null,
        location: data.location || null,
        companyUrl: data.companyUrl || null,
        subRoles: buildSubRolesPayload(subRoles),
      }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to create experience entry." };
  }

  revalidateExperiencePages();
  redirect("/admin/experience");
}

export async function updateExperience(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { subRoles, ...data } = parsed.data;

  try {
    await adminFetch(`/api/admin/experience/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...data,
        endDate: data.endDate || null,
        location: data.location || null,
        companyUrl: data.companyUrl || null,
        subRoles: buildSubRolesPayload(subRoles),
      }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update experience entry." };
  }

  revalidateExperiencePages();
  redirect("/admin/experience");
}

export async function deleteExperience(id: string) {
  await adminFetch(`/api/admin/experience/${id}`, { method: "DELETE" });
  revalidateExperiencePages();
}
