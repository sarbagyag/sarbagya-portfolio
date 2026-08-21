import PostForm from "@/components/Admin/PostForm";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">New post</h1>
      <PostForm action={createPost} submitLabel="Create" />
    </div>
  );
}
