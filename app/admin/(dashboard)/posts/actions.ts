"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, ApiError } from "@/lib/api/server";
import { getAllPosts, getPostById } from "@/lib/api/queries";
import { nextSortOrder } from "@/lib/api/sort-order";
import { postSchema } from "@/lib/validations";

function revalidatePostPages(type: "blog" | "learning-log", slug?: string) {
  revalidatePath(type === "blog" ? "/blog" : "/learning");
  if (slug) revalidatePath(`/${type === "blog" ? "blog" : "learning"}/${slug}`);
  revalidatePath("/admin/posts");
}

export async function createPost(_prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const posts = await getAllPosts();

  try {
    await adminFetch("/api/admin/posts", {
      method: "POST",
      body: JSON.stringify({
        ...parsed.data,
        excerpt: parsed.data.excerpt || null,
        coverImageUrl: parsed.data.coverImageUrl || null,
        sortOrder: nextSortOrder(posts),
      }),
    });
  } catch (err) {
    // The Go API's own error already calls out a duplicate slug by name.
    return { error: err instanceof ApiError ? err.message : "Failed to create post." };
  }

  revalidatePostPages(parsed.data.type, parsed.data.slug);
  redirect("/admin/posts");
}

export async function updatePost(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  // Cover image cleanup in MinIO and publishedAt bookkeeping (set once on
  // first publish, preserved after) both happen server-side in the Go API.
  // sortOrder isn't editable from the form (it's set by dragging on the list
  // page) — carry the existing value through so a save doesn't reset it.
  const existing = await getPostById(id);

  try {
    await adminFetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...parsed.data,
        excerpt: parsed.data.excerpt || null,
        coverImageUrl: parsed.data.coverImageUrl || null,
        sortOrder: existing?.sortOrder ?? 0,
      }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update post." };
  }

  revalidatePostPages(parsed.data.type, parsed.data.slug);
  redirect("/admin/posts");
}

export async function deletePost(id: string, type: "blog" | "learning-log", slug: string) {
  await adminFetch(`/api/admin/posts/${id}`, { method: "DELETE" });
  revalidatePostPages(type, slug);
}

export async function reorderPosts(ids: string[]) {
  await adminFetch("/api/admin/posts/reorder", {
    method: "PATCH",
    body: JSON.stringify({ ids }),
  });
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath("/learning");
}
