import EducationForm from "@/components/Admin/EducationForm";
import { createEducation } from "../actions";

export default function NewEducationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">New education entry</h1>
      <EducationForm action={createEducation} submitLabel="Create" />
    </div>
  );
}
