import type { Metadata } from "next";
import PostList from "@/components/Sections/PostList";
import { getPublishedPostsByType } from "@/db/queries";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPostsByType("blog");

  return (
    <PostList
      posts={posts}
      basePath="/blog"
      title={
        <>
          The <span className="gradient-text">Blog</span>
        </>
      }
      subtitle="Longer write-ups — engineering, projects, and whatever else is worth explaining."
      emptyMessage="No posts yet — check back soon."
    />
  );
}
