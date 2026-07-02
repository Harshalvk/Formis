"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Copy, Trash2, Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIELD_TYPE_META, type FieldType } from "./fieldTypeMeta";
import type { EditableQuestion } from "./types";

type Props = {
  field: EditableQuestion;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

const SortableFieldCard = ({
  field,
  selected,
  onSelect,
  onDelete,
  onDuplicate
}: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: field.id.toString()
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const meta = field.fieldType
    ? FIELD_TYPE_META[field.fieldType as FieldType]
    : null;
  const Icon = meta?.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        "group relative flex items-start gap-2 rounded-xl border bg-card p-3 shadow-sm transition-colors cursor-pointer",
        selected
          ? "border-primary ring-1 ring-primary"
          : "hover:border-primary/40",
        isDragging && "opacity-50"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="mt-1 shrink-0 cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-accent active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          <span>{meta?.label ?? field.fieldType}</span>
          {field.required && (
            <span className="inline-flex items-center gap-0.5 text-destructive">
              <Asterisk className="h-3 w-3" /> required
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-sm font-medium">
          {field.text || "Untitled question"}
        </p>
        {field.description && (
          <p className="truncate text-xs text-muted-foreground">
            {field.description}
          </p>
        )}
        {meta?.needsOptions && (
          <p className="mt-1 text-xs text-muted-foreground">
            {field.fieldOptions.length} option
            {field.fieldOptions.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          title="Duplicate field"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Delete field"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SortableFieldCard;
