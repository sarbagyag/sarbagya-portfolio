import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "@/components/Admin/DeleteButton";
import { getShowcaseCategories } from "@/lib/api/queries";
import { deleteShowcaseCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminShowcasePage() {
  const categories = await getShowcaseCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Showcase</h1>
        <Link
          href="/admin/showcase/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          New category
        </Link>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border-color bg-bg-card"
          >
            <div className="min-w-0">
              <p className="font-semibold text-text-primary truncate">{category.title}</p>
              <p className="text-sm text-text-secondary truncate">
                {category.featuredName}
                {category.items.length > 0 && ` · +${category.items.length} other`}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-4">
              <Link
                href={`/admin/showcase/${category.id}`}
                className="p-2 rounded-lg text-text-secondary hover:text-link hover:bg-link-subtle transition-colors"
                aria-label="Edit"
              >
                <Pencil size={16} />
              </Link>
              <DeleteButton action={deleteShowcaseCategory.bind(null, category.id)} label="Delete showcase category" />
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-sm text-text-tertiary">No showcase categories yet.</p>}
      </div>
    </div>
  );
}
