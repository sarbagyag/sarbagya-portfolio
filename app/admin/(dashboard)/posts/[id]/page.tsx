import { notFound } from "next/navigation";
import PostForm from "@/components/Admin/PostForm";
import { getPostById } from "@/lib/api/queries";
import { updatePost } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Edit post</h1>
      <PostForm action={updatePost.bind(null, id)} post={post} submitLabel="Save changes" isEdit />
    </div>
  );
}
