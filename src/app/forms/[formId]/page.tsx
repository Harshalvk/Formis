import React from "react";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import type { EditableForm } from "@/components/forms/editor/types";
import Form from "@/components/forms/Form";

const page = async ({
  params
}: {
  params: {
    formId: string;
  };
}) => {
  const session = await auth();
  const formId = params.formId;

  if (!formId) {
    return <div>Form not found</div>;
  }

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, parseInt(formId)),
    with: {
      questions: {
        orderBy: (questions, { asc }) => [asc(questions.order)],
        with: {
          fieldOptions: {
            orderBy: (fieldOptions, { asc }) => [asc(fieldOptions.order)]
          }
        }
      }
    }
  });

  if (session?.user?.id !== form?.userId) {
    return <div>You are not authorized to view this page.</div>;
  }

  if (!form) {
    return <div>You don&apos;t have any form</div>;
  }

  return (
    <div className="p-3">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{form.name}</h1>
        {form.description && (
          <p className="text-muted-foreground">{form.description}</p>
        )}
      </div>
      <Form form={form as unknown as EditableForm} editMode />
    </div>
  );
};

export default page;
