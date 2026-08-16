"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, posts } from "@/db";
import { postSchema } from "@/lib/validations";
import { deleteStorageFileIfChanged, deleteStorageFiles } from "@/lib/supabase/storage";

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

  const existing = await db.select().from(posts).where(eq(posts.slug, parsed.data.slug)).limit(1);
  if (existing[0]) {
    return { error: `A post with slug "${parsed.data.slug}" already exists.` };
  }

  await db.insert(posts).values({
    ...parsed.data,
    excerpt: parsed.data.excerpt || null,
    coverImageUrl: parsed.data.coverImageUrl || null,
    publishedAt: parsed.data.status === "published" ? new Date() : null,
  });

  revalidatePostPages(parsed.data.type, parsed.data.slug);
  redirect("/admin/posts");
}

export async function updatePost(id: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  const wasPublished = existing[0]?.status === "published";

  // Cover image was replaced or cleared — remove the old file from Storage
  // so it doesn't sit around unused.
  await deleteStorageFileIfChanged(existing[0]?.coverImageUrl, parsed.data.coverImageUrl || null);

  await db
    .update(posts)
    .set({
      ...parsed.data,
      excerpt: parsed.data.excerpt || null,
      coverImageUrl: parsed.data.coverImageUrl || null,
      // Set publishedAt the first time a post goes live; don't clobber it on
      // subsequent edits, and don't clear it if toggled back to draft.
      publishedAt: parsed.data.status === "published" && !wasPublished ? new Date() : existing[0]?.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id));

  revalidatePostPages(parsed.data.type, parsed.data.slug);
  redirect("/admin/posts");
}

export async function deletePost(id: string, type: "blog" | "learning-log", slug: string) {
  const existing = await db.select().from(posts).where(eq(posts.id, id)).limit(1);

  await db.delete(posts).where(eq(posts.id, id));
  await deleteStorageFiles([existing[0]?.coverImageUrl]);

  revalidatePostPages(type, slug);
}
