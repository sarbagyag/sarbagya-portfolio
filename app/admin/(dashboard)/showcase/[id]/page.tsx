import { notFound } from "next/navigation";
import ShowcaseForm from "@/components/Admin/ShowcaseForm";
import { getShowcaseCategoryById } from "@/lib/api/queries";
import { updateShowcaseCategory } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditShowcaseCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getShowcaseCategoryById(id);

  if (!category) {
    notFound();
  }

  const boundAction = updateShowcaseCategory.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Edit showcase category</h1>
      <ShowcaseForm action={boundAction} category={category} submitLabel="Save changes" isEdit />
    </div>
  );
}
