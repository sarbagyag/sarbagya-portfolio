"use client";

// Small, unstyled-logic form field wrappers shared by every admin CRUD form.
// Plain <input>/<textarea>/<select> under the hood — no client state, no
// form library. Array fields (technologies, achievements, etc.) are edited
// as one-item-per-line textareas and parsed server-side (see
// lib/validations.ts `linesToArray`).

import { useFormStatus } from "react-dom";

interface FieldProps {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  readOnly?: boolean;
}

export function Field({ label, name, defaultValue, type = "text", required, placeholder, hint, readOnly }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-text-primary mb-1.5">
        {label} {required && <span className="text-carbon-support-error">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-3.5 py-2 border border-border-color rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
          readOnly ? "bg-bg-secondary text-text-tertiary cursor-not-allowed" : "bg-bg-primary"
        }`}
      />
      {hint && <p className="text-xs text-text-tertiary mt-1">{hint}</p>}
    </div>
  );
}

interface TextAreaProps extends Omit<FieldProps, "type"> {
  rows?: number;
}

export function TextAreaField({ label, name, defaultValue, required, placeholder, hint, rows = 4 }: TextAreaProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-text-primary mb-1.5">
        {label} {required && <span className="text-carbon-support-error">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-y"
      />
      {hint && <p className="text-xs text-text-tertiary mt-1">{hint}</p>}
    </div>
  );
}

export function ArrayField({
  label,
  name,
  defaultValue,
  rows = 4,
  hint,
}: Omit<TextAreaProps, "defaultValue"> & { defaultValue?: string[] }) {
  return (
    <TextAreaField
      label={label}
      name={name}
      defaultValue={(defaultValue ?? []).join("\n")}
      rows={rows}
      hint={hint ?? "One per line"}
    />
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

export function SelectField({ label, name, defaultValue, options, required, placeholder }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-text-primary mb-1.5">
        {label} {required && <span className="text-carbon-support-error">*</span>}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full px-3.5 py-2 bg-bg-primary border border-border-color rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label htmlFor={name} className="flex items-center gap-2.5 text-sm font-medium text-text-primary cursor-pointer">
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-4 h-4 rounded border-border-color accent-primary-600"
      />
      {label}
    </label>
  );
}

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
    >
      {pending ? (pendingLabel ?? "Saving…") : label}
    </button>
  );
}
