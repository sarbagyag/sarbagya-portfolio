"use client";

import { Trash2 } from "lucide-react";

// Wraps a Server Action bound to a specific row id — `action` must already
// be bound via `.bind(null, id)` at the call site (server actions can't
// take extra client-side args otherwise).
export default function DeleteButton({ action, label = "Delete" }: { action: () => Promise<void>; label?: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`${label}? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="p-2 text-text-secondary hover:text-carbon-support-error hover:bg-carbon-support-error/10 transition-colors"
        aria-label={label}
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
