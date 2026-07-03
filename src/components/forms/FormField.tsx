"use client";

import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FormControl } from "../ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  QuestionSelectModel,
  FieldOptionsSelectModel
} from "@/app/types/form-types";
import { Label } from "@/components/ui/label";
import { Star, GripVertical } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FieldType } from "./editor/fieldTypeMeta";
export type FieldValue = string | string[] | undefined;

export type FieldConfig = {
  min?: number;
  max?: number;
  step?: number;
  maxStars?: number;
  minLabel?: string;
  maxLabel?: string;
  accept?: string;
  maxSizeMB?: number;
};

export type FormFieldElement = Omit<QuestionSelectModel, "fieldType"> & {
  fieldType: FieldType | null;
  fieldOptions: Array<FieldOptionsSelectModel>;
  config?: FieldConfig | null;
};

type FormFieldProps = {
  element: FormFieldElement;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
};
function RankingItem({
  id,
  index,
  text
}: {
  id: number;
  index: number;
  text: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: id.toString()
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
        {index + 1}
      </span>
      <span className="flex-1">{text}</span>
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
    </li>
  );
}

const FormField = ({ element, value, onChange }: FormFieldProps) => {
  const config = element.config ?? {};

  const components = {
    Input: () => (
      <Input
        type="text"
        placeholder={element.placeholder ?? undefined}
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
    Email: () => (
      <Input
        type="email"
        placeholder={element.placeholder ?? "you@example.com"}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
    Number: () => (
      <Input
        type="number"
        placeholder={element.placeholder ?? undefined}
        min={config.min}
        max={config.max}
        step={config.step ?? 1}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
    Date: () => (
      <Input type="date" onChange={(e) => onChange(e.target.value)} />
    ),
    Switch: () => (
      <Switch
        onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
      />
    ),
    Textarea: () => (
      <Textarea
        placeholder={element.placeholder ?? undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
    FileUpload: () => (
      <Input
        type="file"
        accept={config.accept}
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
      />
    ),
    Rating: () => {
      const max = config.maxStars ?? 5;
      const current = Number(value) || 0;
      return (
        <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(String(i + 1))}
              className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  i < current
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      );
    },
    NPS: () => {
      const current = value;
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 11 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(String(i))}
                className={`h-9 w-9 rounded-md border text-sm font-medium transition-colors ${
                  Number(current) === i
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{config.minLabel ?? "Not at all likely"}</span>
            <span>{config.maxLabel ?? "Extremely likely"}</span>
          </div>
        </div>
      );
    },
    Select: () => (
      <Select onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {element.fieldOptions.map((option) => (
            <SelectItem
              key={`${option.text} ${option.value}`}
              value={`answerId_${option.id}`}
            >
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    RadioGroup: () => (
      <RadioGroup onValueChange={onChange}>
        {element.fieldOptions.map((option) => (
          <div
            key={`${option.text} ${option.value}`}
            className="flex items-center space-x-2"
          >
            <FormControl>
              <RadioGroupItem
                value={`answerId_${option.id}`}
                id={option.value?.toString() || `answerId_${option.id}`}
              ></RadioGroupItem>
            </FormControl>
            <Label className="text-base">{option.text}</Label>
          </div>
        ))}
      </RadioGroup>
    ),
    Checkbox: () => {
      const current: string[] = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          {element.fieldOptions.map((option) => {
            const optionValue = `answerId_${option.id}`;
            const checked = current.includes(optionValue);
            return (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  className="h-4 w-4 rounded border-input"
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...current, optionValue]
                      : current.filter((v) => v !== optionValue);
                    onChange(next);
                  }}
                />
                {option.text}
              </label>
            );
          })}
        </div>
      );
    },
    Ranking: () => {
      const [order, setOrder] = useState<number[]>(() =>
        Array.isArray(value) && value.length
          ? value.map((v: string) => parseInt(v.replace("answerId_", "")))
          : element.fieldOptions.map((o) => o.id)
      );
      const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
      );

      useEffect(() => {
        onChange(order.map((id) => `answerId_${id}`));
        // Only run once on mount so the initial (unranked) order is recorded.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = order.indexOf(Number(active.id));
        const newIndex = order.indexOf(Number(over.id));
        const next = arrayMove(order, oldIndex, newIndex);
        setOrder(next);
        onChange(next.map((id) => `answerId_${id}`));
      };

      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={order.map(String)}
            strategy={verticalListSortingStrategy}
          >
            <ol className="space-y-1.5">
              {order.map((id, idx) => {
                const option = element.fieldOptions.find((o) => o.id === id);
                return (
                  <RankingItem
                    key={id}
                    id={id}
                    index={idx}
                    text={option?.text ?? ""}
                  />
                );
              })}
            </ol>
          </SortableContext>
        </DndContext>
      );
    }
  };

  if (!element) return null;

  const key = element.fieldType as keyof typeof components;
  return components[key] ? components[key]() : null;
};

export default FormField;
