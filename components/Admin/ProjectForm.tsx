"use client";

import { useActionState } from "react";
import { Field, TextAreaField, ArrayField, SelectField, CheckboxField, SubmitButton } from "@/components/Admin/fields";
import FileUploadField from "@/components/Admin/FileUploadField";
import type { projects as projectsTable } from "@/db/schema";

type Project = typeof projectsTable.$inferSelect;
type ActionState = { error?: string } | undefined;

export default function ProjectForm({
  action,
  project,
  submitLabel,
  isEdit,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  project?: Project;
  submitLabel: string;
  isEdit?: boolean;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="ID (slug)"
          name="id"
          defaultValue={project?.id}
          required
          readOnly={isEdit}
          hint={isEdit ? "Can't be changed after creation" : "lowercase-with-hyphens"}
        />
        <SelectField
          label="Category"
          name="category"
          defaultValue={project?.category}
          required
          options={[
            { value: "systems", label: "Systems" },
            { value: "ml", label: "ML" },
            { value: "networks", label: "Networks" },
          ]}
        />
      </div>

      <Field label="Title" name="title" defaultValue={project?.title} required />
      <TextAreaField label="Description" name="description" defaultValue={project?.description} required rows={2} />
      <TextAreaField
        label="Long description"
        name="longDescription"
        defaultValue={project?.longDescription ?? undefined}
        rows={5}
        hint="Shown on the project's detail page"
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date" name="startDate" defaultValue={project?.startDate} required placeholder="YYYY-MM" />
        <Field label="End date" name="endDate" defaultValue={project?.endDate ?? undefined} placeholder="YYYY-MM" />
      </div>

      <SelectField
        label="Status"
        name="status"
        defaultValue={project?.status ?? undefined}
        placeholder="—"
        options={[
          { value: "ongoing", label: "Ongoing" },
          { value: "completed", label: "Completed" },
          { value: "published", label: "Published" },
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="GitHub URL" name="githubUrl" type="url" defaultValue={project?.githubUrl ?? undefined} />
        <Field label="Live URL" name="liveUrl" type="url" defaultValue={project?.liveUrl ?? undefined} />
        <Field label="Paper URL" name="paperUrl" type="url" defaultValue={project?.paperUrl ?? undefined} />
      </div>

      <FileUploadField label="Image" name="imageUrl" defaultValue={project?.imageUrl} folder="projects" accept="image/*" />

      <Field label="Impact" name="impact" defaultValue={project?.impact ?? undefined} hint="One-line impact statement" />
      <ArrayField label="Metrics" name="metrics" defaultValue={project?.metrics} />
      <ArrayField label="Technologies" name="technologies" defaultValue={project?.technologies} />

      <div className="flex items-center justify-between">
        <CheckboxField label="Featured" name="featured" defaultChecked={project?.featured} />
        <div className="w-40">
          <Field label="Sort order" name="sortOrder" type="number" defaultValue={String(project?.sortOrder ?? 0)} />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton label={submitLabel} />
        {state?.error && <span className="text-sm text-carbon-support-error">{state.error}</span>}
      </div>
    </form>
  );
}
