import ExperienceForm from "@/components/Admin/ExperienceForm";
import { createExperience } from "../actions";

export default function NewExperiencePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">New experience entry</h1>
      <ExperienceForm action={createExperience} submitLabel="Create" />
    </div>
  );
}
