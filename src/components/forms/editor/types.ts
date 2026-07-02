import { InferSelectModel } from "drizzle-orm";
import { forms, questions, fieldOptions } from "@/db/schema";
import type { FieldType } from "./fieldTypeMeta";

export type EditableFieldOption = InferSelectModel<typeof fieldOptions>;

export type EditableQuestion = Omit<
  InferSelectModel<typeof questions>,
  "fieldType"
> & {
  fieldType: FieldType | null;
  fieldOptions: EditableFieldOption[];
};

export type EditableForm = InferSelectModel<typeof forms> & {
  questions: EditableQuestion[];
};
