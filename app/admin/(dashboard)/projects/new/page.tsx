import ProjectForm from "@/components/Admin/ProjectForm";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">New project</h1>
      <ProjectForm action={createProject} submitLabel="Create" />
    </div>
  );
}
