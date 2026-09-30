"use client";

import { useActionState, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ImagePlus, Loader2 } from "lucide-react";
import { Field, TextAreaField, ArrayField, SelectField, SubmitButton } from "@/components/Admin/fields";
import FileUploadField from "@/components/Admin/FileUploadField";
import { uploadFile } from "@/app/admin/upload-actions";
import type { Post } from "@/lib/api/types";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [insertingImage, setInsertingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  // Uploads the picked file and inserts `![alt](url)` markdown at the
  // textarea's cursor position (or appends to the end when the textarea
  // isn't mounted, i.e. the Preview tab is active).
  const handleInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInsertingImage(true);
    setImageError("");

    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", "posts");

    const result = await uploadFile(formData);

    if (result.url) {
      const alt = file.name.replace(/\.[^./]+$/, "");
      const markdown = `![${alt}](${result.url})`;
      const textarea = textareaRef.current;

      if (textarea) {
        const start = textarea.selectionStart ?? content.length;
        const end = textarea.selectionEnd ?? content.length;
        const next = content.slice(0, start) + markdown + content.slice(end);
        setContent(next);
        requestAnimationFrame(() => {
          textarea.focus();
          const cursor = start + markdown.length;
          textarea.setSelectionRange(cursor, cursor);
        });
      } else {
        setContent((prev) => (prev ? `${prev}\n\n${markdown}\n` : `${markdown}\n`));
      }
    } else {
      setImageError(result.error ?? "Upload failed.");
    }

    setInsertingImage(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

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
          <div className="flex items-center gap-2 text-xs">
            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-secondary border border-border-color text-text-secondary hover:text-link hover:border-primary-500 transition-colors cursor-pointer">
              {insertingImage ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />}
              {insertingImage ? "Uploading…" : "Insert image"}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleInsertImage}
                disabled={insertingImage}
                className="hidden"
              />
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`px-2.5 py-1 transition-colors ${
                  tab === "write" ? "bg-link-subtle text-link" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`px-2.5 py-1 transition-colors ${
                  tab === "preview" ? "bg-link-subtle text-link" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {imageError && <p className="text-xs text-carbon-support-error mb-1.5">{imageError}</p>}

        {tab === "write" ? (
          <textarea
            ref={textareaRef}
            id="contentMarkdown"
            name="contentMarkdown"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={18}
            className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-color text-text-primary text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-y"
            placeholder="Markdown supported (headings, lists, code blocks, links, images...)"
          />
        ) : (
          <>
            {/* Hidden so the value still submits while the preview tab is showing */}
            <input type="hidden" name="contentMarkdown" value={content} />
            <div className="min-h-[24rem] px-3.5 py-2.5 bg-bg-primary border border-border-color prose-carbon">
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
