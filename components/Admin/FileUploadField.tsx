"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { uploadFile } from "@/app/admin/upload-actions";

interface FileUploadFieldProps {
  label: string;
  name: string;
  defaultValue?: string | null;
  folder: string;
  accept?: string;
  hint?: string;
}

// Text field holding a URL (still hand-editable) plus a real upload button
// that pushes the chosen file to Supabase Storage and fills the field with
// the resulting public URL. The URL is what actually submits with the form.
export default function FileUploadField({
  label,
  name,
  defaultValue,
  folder,
  accept = "image/*",
  hint,
}: FileUploadFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = /\.(png|jpe?g|webp|gif)$/i.test(value) || value.startsWith("data:image");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    const result = await uploadFile(formData);

    if (result.url) {
      setValue(result.url);
    } else {
      setError(result.error ?? "Upload failed.");
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-text-primary mb-1.5">
        {label}
      </label>

      {isImage && value && (
        <img
          src={value}
          alt=""
          className="w-20 h-20 object-cover rounded-lg border border-border-color mb-2"
        />
      )}

      <div className="flex items-center gap-2">
        <input
          id={name}
          name={name}
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://... or upload a file"
          className="flex-1 min-w-0 px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />

        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="p-2 rounded-lg text-text-secondary hover:text-carbon-support-error transition-colors shrink-0"
            aria-label="Clear"
          >
            <X size={16} />
          </button>
        )}

        <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-bg-secondary border border-border-color rounded-lg text-sm font-medium text-text-secondary hover:text-link hover:border-primary-400 transition-colors cursor-pointer shrink-0">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading…" : "Upload"}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-xs text-carbon-support-error mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-text-tertiary mt-1">{hint}</p>}
    </div>
  );
}
