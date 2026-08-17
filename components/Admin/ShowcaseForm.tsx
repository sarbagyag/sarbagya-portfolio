"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, TextAreaField, SubmitButton } from "@/components/Admin/fields";
import FileUploadField from "@/components/Admin/FileUploadField";
import type { ShowcaseCategory } from "@/lib/api/types";

interface ShowcaseItem {
  name: string;
  url: string;
}

const emptyItem: ShowcaseItem = { name: "", url: "" };

type ActionState = { error?: string } | undefined;

export default function ShowcaseForm({
  action,
  category,
  submitLabel,
  isEdit,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  category?: ShowcaseCategory;
  submitLabel: string;
  isEdit?: boolean;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [items, setItems] = useState<ShowcaseItem[]>(
    (category?.items ?? []).map((it) => ({ name: it.name, url: it.url }))
  );

  const updateItem = (index: number, field: keyof ShowcaseItem, value: string) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  };

  const itemsJson = JSON.stringify(items);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="itemsJson" value={itemsJson} />

      <Field
        label="ID (slug)"
        name="id"
        defaultValue={category?.id}
        required
        readOnly={isEdit}
        hint={isEdit ? "Can't be changed after creation" : "lowercase-with-hyphens, used internally"}
        placeholder="n8n-automation"
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" name="title" defaultValue={category?.title} required hint='e.g. "n8n Automation"' />
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={String(category?.sortOrder ?? 0)} hint="Lower numbers appear first" />
      </div>

      <TextAreaField label="Description" name="description" defaultValue={category?.description} required rows={2} />

      <div className="pt-4 border-t border-border-color">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Featured project</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" name="featuredName" defaultValue={category?.featuredName} required />
          <Field
            label="URL"
            name="featuredUrl"
            defaultValue={category?.featuredUrl}
            required
            hint="Use # as a placeholder when there is no live site yet"
          />
        </div>
        <div className="mt-4">
          <FileUploadField
            label="Featured image"
            name="featuredImageUrl"
            defaultValue={category?.featuredImageUrl}
            folder="showcase"
            accept="image/*"
          />
        </div>
      </div>

      {/* Other projects */}
      <div className="pt-4 border-t border-border-color">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary">Other projects</h3>
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, { ...emptyItem }])}
            className="inline-flex items-center gap-1.5 text-sm text-link hover:text-link-hover transition-colors"
          >
            <Plus size={14} />
            Add project
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                placeholder="Name"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                className="flex-1 px-3 py-1.5 bg-bg-primary border border-border-color text-sm text-text-primary"
              />
              <input
                placeholder="URL"
                value={item.url}
                onChange={(e) => updateItem(index, "url", e.target.value)}
                className="flex-1 px-3 py-1.5 bg-bg-primary border border-border-color text-sm text-text-primary"
              />
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                className="text-text-tertiary hover:text-carbon-support-error transition-colors shrink-0"
                aria-label="Remove project"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-text-tertiary">No other projects.</p>}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton label={submitLabel} />
        {state?.error && <span className="text-sm text-carbon-support-error">{state.error}</span>}
      </div>
    </form>
  );
}
