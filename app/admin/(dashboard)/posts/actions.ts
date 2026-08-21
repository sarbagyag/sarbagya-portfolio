"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, ApiError } from "@/lib/api/server";
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

  try {
    await adminFetch("/api/admin/posts", {
      method: "POST",
      body: JSON.stringify({
        ...parsed.data,
        excerpt: parsed.data.excerpt || null,
        coverImageUrl: parsed.data.coverImageUrl || null,
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
  try {
    await adminFetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...parsed.data,
        excerpt: parsed.data.excerpt || null,
        coverImageUrl: parsed.data.coverImageUrl || null,
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
