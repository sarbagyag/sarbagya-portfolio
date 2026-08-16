"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, TextAreaField, ArrayField, SelectField, SubmitButton } from "@/components/Admin/fields";

interface SubRole {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities: string;
  technologies: string;
  achievements: string;
}

const emptySubRole: SubRole = {
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
  responsibilities: "",
  technologies: "",
  achievements: "",
};

interface ExperienceFormValues {
  id: string;
  title: string;
  company: string;
  location: string | null;
  type: string;
  startDate: string;
  endDate: string | null;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  companyUrl: string | null;
  sortOrder: number;
  subRoles: {
    title: string;
    company: string;
    startDate: string;
    endDate: string | null;
    description: string;
    responsibilities: string[];
    technologies: string[];
    achievements: string[];
  }[];
}

type ActionState = { error?: string } | undefined;

export default function ExperienceForm({
  action,
  experience,
  submitLabel,
  isEdit,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  experience?: ExperienceFormValues;
  submitLabel: string;
  isEdit?: boolean;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [subRoles, setSubRoles] = useState<SubRole[]>(
    (experience?.subRoles ?? []).map((sr) => ({
      title: sr.title,
      company: sr.company,
      startDate: sr.startDate,
      endDate: sr.endDate ?? "",
      description: sr.description,
      responsibilities: sr.responsibilities.join("\n"),
      technologies: sr.technologies.join("\n"),
      achievements: sr.achievements.join("\n"),
    }))
  );

  const updateSubRole = (index: number, field: keyof SubRole, value: string) => {
    setSubRoles((prev) => prev.map((sr, i) => (i === index ? { ...sr, [field]: value } : sr)));
  };

  const subRolesJson = JSON.stringify(
    subRoles.map((sr) => ({
      title: sr.title,
      company: sr.company,
      startDate: sr.startDate,
      endDate: sr.endDate,
      description: sr.description,
      responsibilities: sr.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean),
      technologies: sr.technologies.split("\n").map((s) => s.trim()).filter(Boolean),
      achievements: sr.achievements.split("\n").map((s) => s.trim()).filter(Boolean),
    }))
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="subRolesJson" value={subRolesJson} />

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="ID (slug)"
          name="id"
          defaultValue={experience?.id}
          required
          readOnly={isEdit}
          hint={isEdit ? "Can't be changed after creation" : "lowercase-with-hyphens, used internally"}
          placeholder="acme-corp-role"
        />
        <SelectField
          label="Type"
          name="type"
          defaultValue={experience?.type}
          required
          options={[
            { value: "job", label: "Job" },
            { value: "internship", label: "Internship" },
            { value: "research", label: "Research" },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" name="title" defaultValue={experience?.title} required />
        <Field label="Company" name="company" defaultValue={experience?.company} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Location" name="location" defaultValue={experience?.location ?? undefined} />
        <Field label="Company URL" name="companyUrl" type="url" defaultValue={experience?.companyUrl ?? undefined} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date" name="startDate" defaultValue={experience?.startDate} required placeholder="YYYY-MM" />
        <Field label="End date" name="endDate" defaultValue={experience?.endDate ?? undefined} placeholder="YYYY-MM (blank = present)" />
      </div>

      <TextAreaField label="Description" name="description" defaultValue={experience?.description} required rows={3} />
      <ArrayField label="Responsibilities" name="responsibilities" defaultValue={experience?.responsibilities} />
      <ArrayField label="Technologies" name="technologies" defaultValue={experience?.technologies} />
      <ArrayField label="Achievements" name="achievements" defaultValue={experience?.achievements} />
      <Field label="Sort order" name="sortOrder" type="number" defaultValue={String(experience?.sortOrder ?? 0)} hint="Lower numbers appear first" />

      {/* Sub-roles */}
      <div className="pt-4 border-t border-border-color">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary">Sub-roles</h3>
          <button
            type="button"
            onClick={() => setSubRoles((prev) => [...prev, { ...emptySubRole }])}
            className="inline-flex items-center gap-1.5 text-sm text-link hover:text-link-hover transition-colors"
          >
            <Plus size={14} />
            Add sub-role
          </button>
        </div>

        <div className="space-y-4">
          {subRoles.map((sr, index) => (
            <div key={index} className="p-4 rounded-lg border border-border-color bg-bg-secondary space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                  Sub-role {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setSubRoles((prev) => prev.filter((_, i) => i !== index))}
                  className="text-text-tertiary hover:text-carbon-support-error transition-colors"
                  aria-label="Remove sub-role"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Title"
                  value={sr.title}
                  onChange={(e) => updateSubRole(index, "title", e.target.value)}
                  className="px-3 py-1.5 bg-bg-primary border border-border-color rounded-md text-sm text-text-primary"
                />
                <input
                  placeholder="Company"
                  value={sr.company}
                  onChange={(e) => updateSubRole(index, "company", e.target.value)}
                  className="px-3 py-1.5 bg-bg-primary border border-border-color rounded-md text-sm text-text-primary"
                />
                <input
                  placeholder="Start (YYYY-MM)"
                  value={sr.startDate}
                  onChange={(e) => updateSubRole(index, "startDate", e.target.value)}
                  className="px-3 py-1.5 bg-bg-primary border border-border-color rounded-md text-sm text-text-primary"
                />
                <input
                  placeholder="End (blank = present)"
                  value={sr.endDate}
                  onChange={(e) => updateSubRole(index, "endDate", e.target.value)}
                  className="px-3 py-1.5 bg-bg-primary border border-border-color rounded-md text-sm text-text-primary"
                />
              </div>
              <textarea
                placeholder="Description"
                value={sr.description}
                onChange={(e) => updateSubRole(index, "description", e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 bg-bg-primary border border-border-color rounded-md text-sm text-text-primary resize-y"
              />
              <textarea
                placeholder="Responsibilities (one per line)"
                value={sr.responsibilities}
                onChange={(e) => updateSubRole(index, "responsibilities", e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 bg-bg-primary border border-border-color rounded-md text-sm text-text-primary resize-y"
              />
              <textarea
                placeholder="Technologies (one per line)"
                value={sr.technologies}
                onChange={(e) => updateSubRole(index, "technologies", e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 bg-bg-primary border border-border-color rounded-md text-sm text-text-primary resize-y"
              />
              <textarea
                placeholder="Achievements (one per line)"
                value={sr.achievements}
                onChange={(e) => updateSubRole(index, "achievements", e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 bg-bg-primary border border-border-color rounded-md text-sm text-text-primary resize-y"
              />
            </div>
          ))}
          {subRoles.length === 0 && <p className="text-sm text-text-tertiary">No sub-roles.</p>}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton label={submitLabel} />
        {state?.error && <span className="text-sm text-carbon-support-error">{state.error}</span>}
      </div>
    </form>
  );
}
