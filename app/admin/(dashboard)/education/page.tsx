import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "@/components/Admin/DeleteButton";
import SortableList from "@/components/Admin/SortableList";
import { getEducation } from "@/lib/api/queries";
import { deleteEducation, reorderEducation } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const items = await getEducation();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Education</h1>
        <Link
          href="/admin/education/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          New entry
        </Link>
      </div>

      <SortableList
        items={items.map((item) => ({
          id: item.id,
          content: (
            <>
              <div className="min-w-0">
                <p className="font-semibold text-text-primary truncate">{item.degree}</p>
                <p className="text-sm text-text-secondary truncate">{item.institution}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-4">
                <Link
                  href={`/admin/education/${item.id}`}
                  className="p-2 text-text-secondary hover:text-link hover:bg-link-subtle transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </Link>
                <DeleteButton action={deleteEducation.bind(null, item.id)} label="Delete education entry" />
              </div>
            </>
          ),
        }))}
        onReorder={reorderEducation}
        emptyMessage="No education entries yet."
      />
    </div>
  );
}
