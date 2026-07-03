"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FIELD_TYPE_META, type FieldType } from "./fieldTypeMeta";
import type { EditableQuestion, EditableFieldOption } from "./types";
import {
  addFieldOption,
  deleteFieldOption,
  updateFieldOption,
  reorderFieldOptions
} from "@/app/actions/mutateFields";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FieldConfig } from "../FormField";

type Props = {
  field: EditableQuestion;
  onChange: (patch: Partial<EditableQuestion>) => void;
  onClose: () => void;
};

// small debounce so we don't fire a server action on every keystroke.
function useDebouncedCallback(fn: (value: string) => void, delay = 400) {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  return (value: string) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => fn(value), delay);
  };
}
function OptionRow({
  option,
  onTextChange,
  onDelete
}: {
  option: EditableFieldOption;
  onTextChange: (text: string) => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: option.id.toString()
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [localText, setLocalText] = useState(option.text ?? "");
  const debouncedSave = useDebouncedCallback(onTextChange, 350);

  return (
    <div ref={setNodeRef} style={style} className={cnRow(isDragging)}>
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label="Reorder option"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Input
        value={localText}
        onChange={(e) => {
          setLocalText(e.target.value);
          debouncedSave(e.target.value);
        }}
        className="h-8"
      />
      <button
        type="button"
        onClick={onDelete}
        className="text-muted-foreground hover:text-destructive"
        aria-label="Remove option"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function cnRow(dragging: boolean) {
  return `flex items-center gap-2 rounded-md ${dragging ? "opacity-50" : ""}`;
}

const FieldSettingsPanel = ({ field, onChange, onClose }: Props) => {
  const meta = field.fieldType
    ? FIELD_TYPE_META[field.fieldType as FieldType]
    : null;
  const [label, setLabel] = useState(field.text ?? "");
  const [placeholder, setPlaceholder] = useState(field.placeholder ?? "");
  const [description, setDescription] = useState(field.description ?? "");
  const [options, setOptions] = useState<EditableFieldOption[]>(
    field.fieldOptions
  );
  const config = (field.config ?? {}) as FieldConfig;

  useEffect(() => {
    setLabel(field.text ?? "");
    setPlaceholder(field.placeholder ?? "");
    setDescription(field.description ?? "");
    setOptions(field.fieldOptions);
  }, [field.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedLabelSave = useDebouncedCallback(
    (v: string) => onChange({ text: v }),
    350
  );
  const debouncedPlaceholderSave = useDebouncedCallback(
    (v: string) => onChange({ placeholder: v }),
    350
  );
  const debouncedDescriptionSave = useDebouncedCallback(
    (v: string) => onChange({ description: v }),
    350
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const handleOptionDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = options.findIndex(
      (o) => o.id.toString() === active.id.toString()
    );
    const newIndex = options.findIndex(
      (o) => o.id.toString() === over.id.toString()
    );
    const next = arrayMove(options, oldIndex, newIndex);
    setOptions(next);
    onChange({ fieldOptions: next });
    await reorderFieldOptions(next.map((o) => o.id));
  };

  const handleAddOption = async () => {
    const created = await addFieldOption(field.id, options.length);
    if (!created) return;
    const next = [...options, created];
    setOptions(next);
    onChange({ fieldOptions: next });
  };

  const handleOptionTextChange = async (id: number, text: string) => {
    const next = options.map((o) => (o.id === id ? { ...o, text } : o));
    setOptions(next);
    onChange({ fieldOptions: next });
    await updateFieldOption(id, {
      text,
      value: text.toLowerCase().replace(/\s+/g, "_")
    });
  };

  const handleDeleteOption = async (id: number) => {
    const next = options.filter((o) => o.id !== id);
    setOptions(next);
    onChange({ fieldOptions: next });
    await deleteFieldOption(id);
  };

  const updateConfig = (patch: Record<string, unknown>) => {
    const nextConfig = { ...config, ...patch };
    onChange({ config: nextConfig });
  };

  if (!meta) return null;

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <meta.icon className="h-4 w-4" />
          {meta.label} settings
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-accent"
          aria-label="Close settings"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div className="space-y-1.5">
          <Label htmlFor="field-label">Question label</Label>
          <Textarea
            id="field-label"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              debouncedLabelSave(e.target.value);
            }}
            className="min-h-[60px] text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="field-description">Helper text (optional)</Label>
          <Input
            id="field-description"
            value={description}
            placeholder="Shown under the question"
            onChange={(e) => {
              setDescription(e.target.value);
              debouncedDescriptionSave(e.target.value);
            }}
          />
        </div>

        {!meta.needsOptions &&
          field.fieldType !== "Switch" &&
          field.fieldType !== "Rating" &&
          field.fieldType !== "NPS" && (
            <div className="space-y-1.5">
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={placeholder}
                onChange={(e) => {
                  setPlaceholder(e.target.value);
                  debouncedPlaceholderSave(e.target.value);
                }}
              />
            </div>
          )}

        <div className="flex items-center justify-between rounded-md border p-3">
          <Label htmlFor="field-required" className="cursor-pointer">
            Required
          </Label>
          <Switch
            id="field-required"
            checked={!!field.required}
            onCheckedChange={(checked) => onChange({ required: checked })}
          />
        </div>

        {/* Type-specific settings */}
        {field.fieldType === "Number" && (
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Min</Label>
              <Input
                type="number"
                defaultValue={config.min ?? ""}
                onChange={(e) =>
                  updateConfig({
                    min: e.target.value ? Number(e.target.value) : undefined
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max</Label>
              <Input
                type="number"
                defaultValue={config.max ?? ""}
                onChange={(e) =>
                  updateConfig({
                    max: e.target.value ? Number(e.target.value) : undefined
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Step</Label>
              <Input
                type="number"
                defaultValue={config.step ?? 1}
                onChange={(e) =>
                  updateConfig({ step: Number(e.target.value) || 1 })
                }
              />
            </div>
          </div>
        )}

        {field.fieldType === "Rating" && (
          <div className="space-y-1.5">
            <Label className="text-xs">Number of stars</Label>
            <Input
              type="number"
              min={2}
              max={10}
              defaultValue={config.maxStars ?? 5}
              onChange={(e) =>
                updateConfig({ maxStars: Number(e.target.value) || 5 })
              }
            />
          </div>
        )}

        {field.fieldType === "NPS" && (
          <div className="space-y-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Low-end label</Label>
              <Input
                defaultValue={config.minLabel ?? "Not at all likely"}
                onChange={(e) => updateConfig({ minLabel: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">High-end label</Label>
              <Input
                defaultValue={config.maxLabel ?? "Extremely likely"}
                onChange={(e) => updateConfig({ maxLabel: e.target.value })}
              />
            </div>
          </div>
        )}

        {field.fieldType === "FileUpload" && (
          <div className="space-y-1.5">
            <Label className="text-xs">Accepted file types</Label>
            <Input
              placeholder=".pdf,.png,.jpg"
              defaultValue={config.accept ?? ""}
              onChange={(e) => updateConfig({ accept: e.target.value || "*" })}
            />
          </div>
        )}

        {meta.needsOptions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">
                {field.fieldType === "Ranking" ? "Items to rank" : "Options"}
              </Label>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={handleAddOption}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add
              </Button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleOptionDragEnd}
            >
              <SortableContext
                items={options.map((o) => o.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5">
                  {options.map((option) => (
                    <OptionRow
                      key={option.id}
                      option={option}
                      onTextChange={(text) =>
                        handleOptionTextChange(option.id, text)
                      }
                      onDelete={() => handleDeleteOption(option.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            {options.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Add at least one option so respondents have something to pick.
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default FieldSettingsPanel;
