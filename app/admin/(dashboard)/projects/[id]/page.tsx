import { notFound } from "next/navigation";
import ProjectForm from "@/components/Admin/ProjectForm";
import { getProjectById } from "@/lib/api/queries";
import { updateProject } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Edit project</h1>
      <ProjectForm action={updateProject.bind(null, id)} project={project} submitLabel="Save changes" isEdit />
    </div>
  );
}
