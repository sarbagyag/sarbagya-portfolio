import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/Sections/PostDetail";
import { getPostBySlug } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post?.title ?? "Blog" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.type !== "blog" || post.status !== "published") {
    notFound();
  }

  return <PostDetail post={post} basePath="/blog" backLabel="Back to Blog" />;
}
