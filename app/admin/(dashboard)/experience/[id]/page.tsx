import { notFound } from "next/navigation";
import ExperienceForm from "@/components/Admin/ExperienceForm";
import { getExperienceById } from "@/lib/api/queries";
import { updateExperience } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await getExperienceById(id);

  if (!experience) {
    notFound();
  }

  const boundAction = updateExperience.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Edit experience entry</h1>
      <ExperienceForm action={boundAction} experience={experience} submitLabel="Save changes" isEdit />
    </div>
  );
}
