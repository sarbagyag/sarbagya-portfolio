"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, ApiError } from "@/lib/api/server";
import { getShowcaseCategories, getShowcaseCategoryById } from "@/lib/api/queries";
import { nextSortOrder } from "@/lib/api/sort-order";
import { showcaseCategorySchema, type ShowcaseItemInput } from "@/lib/validations";

function parseFormData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const itemsJson = String(formData.get("itemsJson") ?? "[]");

  let items: unknown[] = [];
  try {
    items = JSON.parse(itemsJson);
  } catch {
    items = [];
  }

  return showcaseCategorySchema.safeParse({ ...raw, items });
}

// The Go API replaces all of a category's items on every save (no
// per-row IDs from the client), and persists sortOrder verbatim — so it
// has to be assigned here from array position.
function buildItemsPayload(items: ShowcaseItemInput[]) {
  return items.map((item, index) => ({ ...item, sortOrder: index }));
}

function revalidateShowcasePages() {
  revalidatePath("/showcase");
  revalidatePath("/admin/showcase");
}

export async function createShowcaseCategory(_prevState: { error?: string } | undefined, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { items, ...data } = parsed.data;

  // The Go API upserts by id — do the "already exists" check here to keep
  // create from silently overwriting an existing entry.
  const categories = await getShowcaseCategories();
  if (categories.some((c) => c.id === data.id)) {
    return { error: `A showcase category with id "${data.id}" already exists.` };
  }

  try {
    await adminFetch("/api/admin/showcase", {
      method: "POST",
      body: JSON.stringify({ ...data, sortOrder: nextSortOrder(categories), items: buildItemsPayload(items) }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to create showcase category." };
  }

  revalidateShowcasePages();
  redirect("/admin/showcase");
}

export async function updateShowcaseCategory(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { items, ...data } = parsed.data;

  // sortOrder isn't editable from the form (it's set by dragging on the list
  // page) — carry the existing value through so a save doesn't reset it.
  const existing = await getShowcaseCategoryById(id);

  try {
    await adminFetch(`/api/admin/showcase/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...data, sortOrder: existing?.sortOrder ?? 0, items: buildItemsPayload(items) }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update showcase category." };
  }

  revalidateShowcasePages();
  redirect("/admin/showcase");
}

export async function deleteShowcaseCategory(id: string) {
  await adminFetch(`/api/admin/showcase/${id}`, { method: "DELETE" });
  revalidateShowcasePages();
}

export async function reorderShowcaseCategories(ids: string[]) {
  await adminFetch("/api/admin/showcase/reorder", {
    method: "PATCH",
    body: JSON.stringify({ ids }),
  });
  revalidateShowcasePages();
}
