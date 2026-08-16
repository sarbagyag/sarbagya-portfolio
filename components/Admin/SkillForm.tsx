"use client";

import { useActionState } from "react";
import { Field, ArrayField, SelectField, SubmitButton } from "@/components/Admin/fields";
import type { skills as skillsTable } from "@/db/schema";

type Skill = typeof skillsTable.$inferSelect;
type ActionState = { error?: string } | undefined;

export default function SkillForm({
  action,
  skill,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  skill?: Skill;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <Field label="Category" name="category" defaultValue={skill?.category} required placeholder="e.g. Backend Development" />
      <ArrayField label="Skills" name="skills" defaultValue={skill?.skills} />
      <SelectField
        label="Proficiency"
        name="proficiency"
        defaultValue={skill?.proficiency ?? undefined}
        placeholder="—"
        options={[
          { value: "beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
          { value: "expert", label: "Expert" },
        ]}
      />
      <Field label="Sort order" name="sortOrder" type="number" defaultValue={String(skill?.sortOrder ?? 0)} />

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton label={submitLabel} />
        {state?.error && <span className="text-sm text-carbon-support-error">{state.error}</span>}
      </div>
    </form>
  );
}
