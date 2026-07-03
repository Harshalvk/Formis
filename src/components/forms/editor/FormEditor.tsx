"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { Check, Loader2, Eye, EyeOff, Rocket, Inbox } from "lucide-react";
import { toast } from "sonner";

import FieldPalette from "./FieldPalette";
import SortableFieldCard from "./SortableFieldCard";
import FieldSettingsPanel from "./FieldSettingsPanel";
import LivePreview from "./LivePreview";
import { FIELD_TYPE_META, type FieldType } from "./fieldTypeMeta";
import type { EditableForm, EditableQuestion } from "./types";
import {
  addField,
  deleteField,
  duplicateField,
  reorderFields,
  updateField
} from "@/app/actions/mutateFields";
import { publishForm } from "@/app/actions/mutateForm";
import { Button } from "@/components/ui/button";
import FormPublishSuccess from "@/components/forms/FormPublishSuccess";

type SaveStatus = "idle" | "saving" | "saved";

function EmptyCanvas() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-empty" });
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
        isOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
    >
      <Inbox className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">This form has no fields yet</p>
      <p className="text-xs text-muted-foreground">
        Drag a field from the left, or click one to add it here.
      </p>
    </div>
  );
}

function PaletteDragPreview({ fieldType }: { fieldType: FieldType }) {
  const meta = FIELD_TYPE_META[fieldType];
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm shadow-lg">
      <Icon className="h-4 w-4" />
      {meta.label}
    </div>
  );
}

const FormEditor = ({ form }: { form: EditableForm }) => {
  const [fields, setFields] = useState<EditableQuestion[]>(
    [...form.questions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  );
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [activeDragType, setActiveDragType] = useState<FieldType | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const flashSaved = useCallback(() => {
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 1500);
  }, []);

  const persistOrder = useCallback(
    async (ordered: EditableQuestion[]) => {
      setSaveStatus("saving");
      await reorderFields(
        form.id,
        ordered.map((f) => f.id)
      );
      flashSaved();
    },
    [form.id, flashSaved]
  );

  const insertFieldFromPalette = useCallback(
    async (fieldType: FieldType, insertAt: number) => {
      setSaveStatus("saving");
      const created = await addField({
        formId: form.id,
        fieldType,
        order: insertAt,
        text: `Untitled ${FIELD_TYPE_META[fieldType].label} question`
      });
      if (!created) {
        toast.error("Couldn't add that field. Please try again.");
        setSaveStatus("idle");
        return;
      }
      const next = [...fields];
      next.splice(insertAt, 0, created as EditableQuestion);
      setFields(next);
      setSelectedFieldId(created.id);
      await persistOrder(next);
    },
    [form.id, fields, persistOrder]
  );

  const handleQuickAdd = (fieldType: FieldType) => {
    insertFieldFromPalette(fieldType, fields.length);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id.toString();
    if (id.startsWith("palette-")) {
      setActiveDragType(id.replace("palette-", "") as FieldType);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragType(null);
    if (!over) return;

    const activeId = active.id.toString();

    if (activeId.startsWith("palette-")) {
      const fieldType = activeId.replace("palette-", "") as FieldType;
      const overId = over.id.toString();
      const dropIndex =
        overId === "canvas-empty"
          ? fields.length
          : fields.findIndex((f) => f.id.toString() === overId);
      await insertFieldFromPalette(
        fieldType,
        dropIndex === -1 ? fields.length : dropIndex
      );
      return;
    }

    if (activeId === over.id.toString()) return;
    const oldIndex = fields.findIndex((f) => f.id.toString() === activeId);
    const newIndex = fields.findIndex(
      (f) => f.id.toString() === over.id.toString()
    );
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(fields, oldIndex, newIndex);
    setFields(next);
    await persistOrder(next);
  };

  const handleDelete = async (questionId: number) => {
    const removedIndex = fields.findIndex((f) => f.id === questionId);
    const removed = fields[removedIndex];
    if (!removed) return;

    setFields((prev) => prev.filter((f) => f.id !== questionId));
    if (selectedFieldId === questionId) setSelectedFieldId(null);

    setSaveStatus("saving");
    await deleteField(questionId);
    flashSaved();

    toast("Field deleted", {
      action: {
        label: "Undo",
        onClick: async () => {
          const restored = await addField({
            formId: form.id,
            fieldType: removed.fieldType as FieldType,
            order: removedIndex,
            text: removed.text ?? "Untitled question",
            required: removed.required ?? false,
            placeholder: removed.placeholder,
            description: removed.description,
            config: removed.config as Record<string, unknown> | undefined,
            fieldOptions: removed.fieldOptions.map((o) => ({
              text: o.text,
              value: o.value
            }))
          });
          if (restored) {
            const next = [...fields];
            next.splice(removedIndex, 0, restored as EditableQuestion);
            setFields(next);
            await persistOrder(next);
          }
        }
      }
    });
  };

  const handleDuplicate = async (questionId: number) => {
    setSaveStatus("saving");
    const duplicated = await duplicateField(questionId);
    if (!duplicated) {
      toast.error("Couldn't duplicate that field.");
      setSaveStatus("idle");
      return;
    }
    const index = fields.findIndex((f) => f.id === questionId);
    const next = [...fields];
    next.splice(index + 1, 0, duplicated as EditableQuestion);
    setFields(next);
    await persistOrder(next);
  };

  const handleFieldUpdate = async (
    questionId: number,
    patch: Partial<EditableQuestion>
  ) => {
    setFields((prev) =>
      prev.map((f) => (f.id === questionId ? { ...f, ...patch } : f))
    );
    // fieldOptions are persisted by FieldSettingsPanel itself via their own
    // server actions — only forward scalar column changes here.
    const { text, required, placeholder, description, config } = patch;
    if (
      text === undefined &&
      required === undefined &&
      placeholder === undefined &&
      description === undefined &&
      config === undefined
    ) {
      return;
    }
    setSaveStatus("saving");
    await updateField({
      id: questionId,
      text: text as string | undefined,
      required: required as boolean | undefined,
      placeholder: placeholder as string | undefined,
      description: description as string | undefined,
      config: config as Record<string, unknown> | undefined
    });
    flashSaved();
  };

  const handlePublish = async () => {
    await publishForm(form.id);
    setPublishOpen(true);
  };

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId) ?? null,
    [fields, selectedFieldId]
  );

  return (
    <div className="flex flex-col rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex h-5 items-center gap-1.5 text-xs text-muted-foreground">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-3.5 w-3.5 text-green-600" /> Saved
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen((v) => !v)}
          >
            {previewOpen ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {previewOpen ? "Back to editor" : "Preview"}
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Rocket className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      {previewOpen ? (
        <LivePreview form={{ ...form, questions: fields }} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex min-h-[70vh]">
            <FieldPalette onQuickAdd={handleQuickAdd} />

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-2xl space-y-3">
                <SortableContext
                  items={fields.map((f) => f.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  {fields.length === 0 ? (
                    <EmptyCanvas />
                  ) : (
                    fields.map((field) => (
                      <SortableFieldCard
                        key={field.id}
                        field={field}
                        selected={field.id === selectedFieldId}
                        onSelect={() => setSelectedFieldId(field.id)}
                        onDelete={() => handleDelete(field.id)}
                        onDuplicate={() => handleDuplicate(field.id)}
                      />
                    ))
                  )}
                </SortableContext>
              </div>
            </div>

            {selectedField && (
              <FieldSettingsPanel
                field={selectedField}
                onChange={(patch) => handleFieldUpdate(selectedField.id, patch)}
                onClose={() => setSelectedFieldId(null)}
              />
            )}
          </div>

          <DragOverlay>
            {activeDragType ? (
              <PaletteDragPreview fieldType={activeDragType} />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <FormPublishSuccess
        formId={form.id}
        open={publishOpen}
        onOpenChange={setPublishOpen}
      />
    </div>
  );
};

export default FormEditor;
