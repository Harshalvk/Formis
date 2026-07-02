"use client";

import React, { useState } from "react";
import { Eye } from "lucide-react";
import FormField, {
  FormFieldElement,
  type FieldValue
} from "@/components/forms/FormField";
import type { EditableForm } from "./types";

const LivePreview = ({ form }: { form: EditableForm }) => {
  const [values, setValues] = useState<Record<number, FieldValue>>({});

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-4 flex items-center gap-2 rounded-md border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <Eye className="h-3.5 w-3.5" />
        Preview mode — this is what respondents will see. Nothing here is saved.
      </div>

      <h1 className="py-2 text-2xl font-semibold">{form.name}</h1>
      {form.description && (
        <p className="text-muted-foreground">{form.description}</p>
      )}

      <div className="mt-6 space-y-6">
        {[...form.questions]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((question, index) => (
            <div key={question.id} className="space-y-1.5">
              <p className="text-sm font-medium">
                {index + 1}. {question.text}
                {question.required && (
                  <span className="text-destructive"> *</span>
                )}
              </p>
              {question.description && (
                <p className="text-xs text-muted-foreground">
                  {question.description}
                </p>
              )}
              <FormField
                element={question as FormFieldElement}
                value={values[question.id]}
                onChange={(v: FieldValue) =>
                  setValues((prev) => ({ ...prev, [question.id]: v }))
                }
              />
            </div>
          ))}
        {form.questions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add a field in the editor to see it previewed here.
          </p>
        )}
      </div>
    </div>
  );
};

export default LivePreview;
