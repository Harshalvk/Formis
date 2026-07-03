"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  FIELD_TYPE_META,
  FIELD_CATEGORIES,
  type FieldType
} from "./fieldTypeMeta";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

function PaletteItem({
  fieldType,
  onQuickAdd
}: {
  fieldType: FieldType;
  onQuickAdd: (fieldType: FieldType) => void;
}) {
  const meta = FIELD_TYPE_META[fieldType];
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${fieldType}`
  });
  const Icon = meta.icon;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      title={meta.description}
      onClick={() => onQuickAdd(fieldType)}
      className={cn(
        "group flex w-full items-center gap-2 rounded-lg border bg-background px-3 py-2 text-left text-sm transition-all hover:border-primary/50 hover:bg-accent active:cursor-grabbing cursor-grab",
        isDragging && "opacity-40"
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
      <span className="flex-1 truncate">{meta.label}</span>
      <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
    </button>
  );
}

const FieldPalette = ({
  onQuickAdd
}: {
  onQuickAdd: (fieldType: FieldType) => void;
}) => {
  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-r bg-muted/30 p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">Add a field</h3>
        <p className="text-xs text-muted-foreground">
          Drag onto the form, or click to append.
        </p>
      </div>
      <div className="space-y-5">
        {FIELD_CATEGORIES.map(({ key, label }) => (
          <div key={key}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <div className="space-y-1.5">
              {(Object.keys(FIELD_TYPE_META) as FieldType[])
                .filter((ft) => FIELD_TYPE_META[ft].category === key)
                .map((ft) => (
                  <PaletteItem
                    key={ft}
                    fieldType={ft}
                    onQuickAdd={onQuickAdd}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default FieldPalette;
