import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "@/components/Admin/DeleteButton";
import { getExperience } from "@/lib/api/queries";
import { deleteExperience } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const entries = await getExperience();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Experience</h1>
        <Link
          href="/admin/experience/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          New entry
        </Link>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-4 border border-border-color bg-bg-card"
          >
            <div className="min-w-0">
              <p className="font-semibold text-text-primary truncate">{entry.title}</p>
              <p className="text-sm text-text-secondary truncate">
                {entry.company} · {entry.startDate} – {entry.endDate ?? "Present"}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-4">
              <Link
                href={`/admin/experience/${entry.id}`}
                className="p-2 text-text-secondary hover:text-link hover:bg-link-subtle transition-colors"
                aria-label="Edit"
              >
                <Pencil size={16} />
              </Link>
              <DeleteButton action={deleteExperience.bind(null, entry.id)} label="Delete experience entry" />
            </div>
          </div>
        ))}
        {entries.length === 0 && <p className="text-sm text-text-tertiary">No experience entries yet.</p>}
      </div>
    </div>
  );
}
