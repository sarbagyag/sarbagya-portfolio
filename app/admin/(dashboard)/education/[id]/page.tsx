import { notFound } from "next/navigation";
import EducationForm from "@/components/Admin/EducationForm";
import { getEducationById } from "@/lib/api/queries";
import { updateEducation } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const education = await getEducationById(id);

  if (!education) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Edit education entry</h1>
      <EducationForm action={updateEducation.bind(null, id)} education={education} submitLabel="Save changes" isEdit />
    </div>
  );
}
