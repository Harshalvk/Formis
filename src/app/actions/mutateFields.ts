"use server";

import { db } from "@/db";
import { questions, fieldOptions } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  FIELD_TYPE_META,
  type FieldType
} from "@/components/forms/editor/fieldTypeMeta";

type NewOption = { text?: string | null; value?: string | null };

export async function addField({
  formId,
  fieldType,
  order,
  text,
  required = false,
  placeholder = null,
  description = null,
  config,
  fieldOptions: optionsInput
}: {
  formId: number;
  fieldType: FieldType;
  order: number;
  text: string;
  required?: boolean;
  placeholder?: string | null;
  description?: string | null;
  config?: Record<string, unknown> | null;
  fieldOptions?: NewOption[];
}) {
  try {
    const meta = FIELD_TYPE_META[fieldType];
    const [created] = await db
      .insert(questions)
      .values({
        formId,
        fieldType,
        text,
        order,
        required,
        placeholder,
        description,
        config: config ?? meta.defaultConfig ?? null
      })
      .returning();

    let createdOptions: (typeof fieldOptions.$inferSelect)[] = [];

    const defaultOptions =
      optionsInput ??
      (meta.needsOptions
        ? [
            { text: "Option 1", value: "option_1" },
            { text: "Option 2", value: "option_2" }
          ]
        : []);

    if (defaultOptions.length > 0) {
      createdOptions = await db
        .insert(fieldOptions)
        .values(
          defaultOptions.map((opt, i) => ({
            text: opt.text ?? `Option ${i + 1}`,
            value: opt.value ?? `option_${i + 1}`,
            questionId: created.id,
            order: i
          }))
        )
        .returning();
    }

    revalidatePath(`/forms/edit/${formId}`);
    return { ...created, fieldOptions: createdOptions };
  } catch (error) {
    console.error("addField failed", error);
    return null;
  }
}

export async function updateField({
  id,
  text,
  required,
  placeholder,
  description,
  config
}: {
  id: number;
  text?: string | null;
  required?: boolean | null;
  placeholder?: string | null;
  description?: string | null;
  config?: Record<string, unknown> | null;
}) {
  try {
    const patch: Record<string, unknown> = {};
    if (text !== undefined) patch.text = text;
    if (required !== undefined) patch.required = required;
    if (placeholder !== undefined) patch.placeholder = placeholder;
    if (description !== undefined) patch.description = description;
    if (config !== undefined) patch.config = config;

    if (Object.keys(patch).length === 0) return null;

    const [updated] = await db
      .update(questions)
      .set(patch)
      .where(eq(questions.id, id))
      .returning();
    return updated ?? null;
  } catch (error) {
    console.error("updateField failed", error);
    return null;
  }
}

export async function deleteField(questionId: number) {
  try {
    await db
      .delete(fieldOptions)
      .where(eq(fieldOptions.questionId, questionId));
    const [deleted] = await db
      .delete(questions)
      .where(eq(questions.id, questionId))
      .returning();
    return deleted ?? null;
  } catch (error) {
    console.error("deleteField failed", error);
    return null;
  }
}

export async function duplicateField(questionId: number) {
  try {
    const source = await db.query.questions.findFirst({
      where: eq(questions.id, questionId),
      with: { fieldOptions: { orderBy: asc(fieldOptions.order) } }
    });
    if (!source) return null;

    const [created] = await db
      .insert(questions)
      .values({
        formId: source.formId,
        fieldType: source.fieldType,
        text: `${source.text ?? "Untitled"} (copy)`,
        order: source.order + 1,
        required: source.required,
        placeholder: source.placeholder,
        description: source.description,
        config: source.config
      })
      .returning();

    let createdOptions: (typeof fieldOptions.$inferSelect)[] = [];
    if (source.fieldOptions.length > 0) {
      createdOptions = await db
        .insert(fieldOptions)
        .values(
          source.fieldOptions.map((opt, i) => ({
            text: opt.text,
            value: opt.value,
            questionId: created.id,
            order: i
          }))
        )
        .returning();
    }

    revalidatePath(`/forms/edit/${source.formId}`);
    return { ...created, fieldOptions: createdOptions };
  } catch (error) {
    console.error("duplicateField failed", error);
    return null;
  }
}

export async function reorderFields(formId: number, orderedIds: number[]) {
  try {
    await db.transaction(async (tx) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          tx.update(questions).set({ order: index }).where(eq(questions.id, id))
        )
      );
    });
    revalidatePath(`/forms/edit/${formId}`);
    return true;
  } catch (error) {
    console.error("reorderFields failed", error);
    return false;
  }
}

// ---------- Field options (Select / RadioGroup / Checkbox / Ranking) ----------

export async function addFieldOption(questionId: number, order: number) {
  try {
    const [created] = await db
      .insert(fieldOptions)
      .values({
        questionId,
        text: `Option ${order + 1}`,
        value: `option_${order + 1}`,
        order
      })
      .returning();
    return created ?? null;
  } catch (error) {
    console.error("addFieldOption failed", error);
    return null;
  }
}

export async function updateFieldOption(
  id: number,
  patch: { text?: string; value?: string }
) {
  try {
    const [updated] = await db
      .update(fieldOptions)
      .set(patch)
      .where(eq(fieldOptions.id, id))
      .returning();
    return updated ?? null;
  } catch (error) {
    console.error("updateFieldOption failed", error);
    return null;
  }
}

export async function deleteFieldOption(id: number) {
  try {
    await db.delete(fieldOptions).where(eq(fieldOptions.id, id));
    return true;
  } catch (error) {
    console.error("deleteFieldOption failed", error);
    return false;
  }
}

export async function reorderFieldOptions(orderedIds: number[]) {
  try {
    await db.transaction(async (tx) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          tx
            .update(fieldOptions)
            .set({ order: index })
            .where(eq(fieldOptions.id, id))
        )
      );
    });
    return true;
  } catch (error) {
    console.error("reorderFieldOptions failed", error);
    return false;
  }
}
