import type { Metadata } from "next";
import PostList from "@/components/Sections/PostList";
import { getPublishedPostsByType } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Learning Log" };
export const dynamic = "force-dynamic";

export default async function LearningPage() {
  const posts = await getPublishedPostsByType("learning-log");

  return (
    <PostList
      posts={posts}
      basePath="/learning"
      title={
        <>
          Learning <span className="gradient-text">Log</span>
        </>
      }
      subtitle="Notes on what I'm learning right now."
      emptyMessage="Nothing logged yet — check back soon."
    />
  );
}
