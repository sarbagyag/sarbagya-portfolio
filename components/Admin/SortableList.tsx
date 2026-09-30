"use client";

// Drag-and-drop reordering for admin list pages, replacing the old
// hand-typed "sort order" number field. Rows are pre-rendered by the
// (server-component) caller and handed in as `content` — this component
// only owns the drag mechanics and the optimistic local order, then calls
// `onReorder` (a Server Action) with the full id list in its new order.
// Native HTML5 drag-and-drop, no extra dependency.

import { useEffect, useRef, useState, useTransition } from "react";
import { GripVertical } from "lucide-react";

export interface SortableRow {
  id: string;
  content: React.ReactNode;
}

export default function SortableList({
  items,
  onReorder,
  emptyMessage,
}: {
  items: SortableRow[];
  onReorder: (ids: string[]) => Promise<void>;
  emptyMessage: string;
}) {
  const [order, setOrder] = useState<string[]>(() => items.map((item) => item.id));
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggedId = useRef<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOrder(items.map((item) => item.id));
  }, [items]);

  if (items.length === 0) {
    return <p className="text-sm text-text-tertiary">{emptyMessage}</p>;
  }

  const byId = new Map(items.map((item) => [item.id, item]));

  function handleDrop(targetId: string) {
    const sourceId = draggedId.current;
    draggedId.current = null;
    setDragOverId(null);
    if (!sourceId || sourceId === targetId) return;

    setOrder((prev) => {
      const next = prev.filter((id) => id !== sourceId);
      next.splice(next.indexOf(targetId), 0, sourceId);
      startTransition(() => {
        onReorder(next);
      });
      return next;
    });
  }

  return (
    <div className="space-y-2">
      {order.map((id) => {
        const row = byId.get(id);
        if (!row) return null;
        return (
          <div
            key={id}
            draggable
            onDragStart={(e) => {
              draggedId.current = id;
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOverId !== id) setDragOverId(id);
            }}
            onDragLeave={() => setDragOverId((cur) => (cur === id ? null : cur))}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(id);
            }}
            onDragEnd={() => {
              draggedId.current = null;
              setDragOverId(null);
            }}
            className={`flex items-stretch border bg-bg-card transition-colors ${
              dragOverId === id ? "border-primary-500" : "border-border-color"
            } ${isPending ? "opacity-70" : ""}`}
          >
            <div
              className="flex items-center px-2 text-text-tertiary hover:text-text-secondary cursor-grab active:cursor-grabbing shrink-0"
              aria-label="Drag to reorder"
            >
              <GripVertical size={16} />
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-between py-4 pr-4">{row.content}</div>
          </div>
        );
      })}
    </div>
  );
}
