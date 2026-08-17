import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "@/components/Admin/DeleteButton";
import { getAllPosts } from "@/lib/api/queries";
import { deletePost } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const items = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          New post
        </Link>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border-color bg-bg-card"
          >
            <div className="min-w-0 flex items-center gap-3">
              <span className={`status-badge ${item.status === "published" ? "completed" : "under-review"}`}>
                {item.status}
              </span>
              <span className="tech-tag text-xs">{item.type === "blog" ? "Blog" : "Learning"}</span>
              <div className="min-w-0">
                <p className="font-semibold text-text-primary truncate">{item.title}</p>
                <p className="text-sm text-text-secondary truncate">/{item.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-4">
              <Link
                href={`/admin/posts/${item.id}`}
                className="p-2 rounded-lg text-text-secondary hover:text-link hover:bg-link-subtle transition-colors"
                aria-label="Edit"
              >
                <Pencil size={16} />
              </Link>
              <DeleteButton action={deletePost.bind(null, item.id, item.type, item.slug)} label="Delete post" />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-text-tertiary">No posts yet.</p>}
      </div>
    </div>
  );
}
