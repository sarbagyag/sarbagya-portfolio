import SkillForm from "@/components/Admin/SkillForm";
import { createSkill } from "../actions";

export default function NewSkillPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">New skill category</h1>
      <SkillForm action={createSkill} submitLabel="Create" />
    </div>
  );
}
