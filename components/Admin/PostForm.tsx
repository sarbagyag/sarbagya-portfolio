"use client";

import { useActionState, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Field, TextAreaField, ArrayField, SelectField, SubmitButton } from "@/components/Admin/fields";
import FileUploadField from "@/components/Admin/FileUploadField";
import type { posts as postsTable } from "@/db/schema";

type Post = typeof postsTable.$inferSelect;
type ActionState = { error?: string } | undefined;

export default function PostForm({
  action,
  post,
  submitLabel,
  isEdit,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  post?: Post;
  submitLabel: string;
  isEdit?: boolean;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [content, setContent] = useState(post?.contentMarkdown ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Type"
          name="type"
          defaultValue={post?.type}
          required
          options={[
            { value: "blog", label: "Blog" },
            { value: "learning-log", label: "Learning Log" },
          ]}
        />
        <SelectField
          label="Status"
          name="status"
          defaultValue={post?.status ?? "draft"}
          required
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
          ]}
        />
      </div>

      <Field label="Title" name="title" defaultValue={post?.title} required />
      <Field
        label="Slug"
        name="slug"
        defaultValue={post?.slug}
        required
        readOnly={isEdit}
        hint={isEdit ? "Can't be changed after creation" : "lowercase-with-hyphens, used in the URL"}
      />
      <TextAreaField label="Excerpt" name="excerpt" defaultValue={post?.excerpt ?? undefined} rows={2} hint="Shown in the post list" />
      <FileUploadField label="Cover image" name="coverImageUrl" defaultValue={post?.coverImageUrl} folder="covers" accept="image/*" />
      <ArrayField label="Tags" name="tags" defaultValue={post?.tags} rows={3} />

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="contentMarkdown" className="block text-sm font-semibold text-text-primary">
            Content <span className="text-carbon-support-error">*</span>
          </label>
          <div className="flex gap-1 text-xs">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                tab === "write" ? "bg-link-subtle text-link" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                tab === "preview" ? "bg-link-subtle text-link" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {tab === "write" ? (
          <textarea
            id="contentMarkdown"
            name="contentMarkdown"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={18}
            className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-color rounded-lg text-text-primary text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-y"
            placeholder="Markdown supported (headings, lists, code blocks, links...)"
          />
        ) : (
          <>
            {/* Hidden so the value still submits while the preview tab is showing */}
            <input type="hidden" name="contentMarkdown" value={content} />
            <div className="min-h-[24rem] px-3.5 py-2.5 bg-bg-primary border border-border-color rounded-lg prose-carbon">
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <p className="text-text-tertiary text-sm">Nothing to preview yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton label={submitLabel} />
        {state?.error && <span className="text-sm text-carbon-support-error">{state.error}</span>}
      </div>
    </form>
  );
}
