"use client";

import { useActionState } from "react";
import { Field, TextAreaField, ArrayField, SubmitButton } from "@/components/Admin/fields";
import type { Education } from "@/lib/api/types";
type ActionState = { error?: string } | undefined;

export default function EducationForm({
  action,
  education,
  submitLabel,
  isEdit,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  education?: Education;
  submitLabel: string;
  isEdit?: boolean;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <Field
        label="ID (slug)"
        name="id"
        defaultValue={education?.id}
        required
        readOnly={isEdit}
        hint={isEdit ? "Can't be changed after creation" : "lowercase-with-hyphens"}
      />
      <Field label="Institution" name="institution" defaultValue={education?.institution} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Degree" name="degree" defaultValue={education?.degree} required />
        <Field label="Field of study" name="field" defaultValue={education?.field} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date" name="startDate" defaultValue={education?.startDate} required />
        <Field label="End date" name="endDate" defaultValue={education?.endDate ?? undefined} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="GPA / grade" name="gpa" defaultValue={education?.gpa ?? undefined} />
        <Field label="Location" name="location" defaultValue={education?.location ?? undefined} />
      </div>
      <TextAreaField label="Description" name="description" defaultValue={education?.description ?? undefined} rows={3} />
      <ArrayField label="Achievements" name="achievements" defaultValue={education?.achievements} />
      <ArrayField label="Relevant coursework" name="relevantCoursework" defaultValue={education?.relevantCoursework} />
      <Field label="Thesis" name="thesis" defaultValue={education?.thesis ?? undefined} />
      <Field label="Sort order" name="sortOrder" type="number" defaultValue={String(education?.sortOrder ?? 0)} />

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton label={submitLabel} />
        {state?.error && <span className="text-sm text-carbon-support-error">{state.error}</span>}
      </div>
    </form>
  );
}
