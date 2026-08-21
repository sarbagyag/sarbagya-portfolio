import ShowcaseForm from "@/components/Admin/ShowcaseForm";
import { createShowcaseCategory } from "../actions";

export default function NewShowcaseCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">New showcase category</h1>
      <ShowcaseForm action={createShowcaseCategory} submitLabel="Create" />
    </div>
  );
}
