import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/Sections/PostDetail";
import { getPostBySlug } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post?.title ?? "Learning Log" };
}

export default async function LearningPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.type !== "learning-log" || post.status !== "published") {
    notFound();
  }

  return <PostDetail post={post} basePath="/learning" backLabel="Back to Learning Log" />;
}
