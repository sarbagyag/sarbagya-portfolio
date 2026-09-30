import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "@/components/Admin/DeleteButton";
import SortableList from "@/components/Admin/SortableList";
import { getAllPosts } from "@/lib/api/queries";
import { deletePost, reorderPosts } from "./actions";

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

      <SortableList
        items={items.map((item) => ({
          id: item.id,
          content: (
            <>
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
                  className="p-2 text-text-secondary hover:text-link hover:bg-link-subtle transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </Link>
                <DeleteButton action={deletePost.bind(null, item.id, item.type, item.slug)} label="Delete post" />
              </div>
            </>
          ),
        }))}
        onReorder={reorderPosts}
        emptyMessage="No posts yet."
      />
    </div>
  );
}
