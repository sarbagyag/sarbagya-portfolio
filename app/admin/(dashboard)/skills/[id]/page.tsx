import { notFound } from "next/navigation";
import SkillForm from "@/components/Admin/SkillForm";
import { getSkillById } from "@/lib/api/queries";
import { updateSkill } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = await getSkillById(id);

  if (!skill) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Edit skill category</h1>
      <SkillForm action={updateSkill.bind(null, id)} skill={skill} submitLabel="Save changes" />
    </div>
  );
}
