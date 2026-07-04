import React from "react";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import FormEditor from "@/components/forms/editor/FormEditor";

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
        with: {
          fieldOptions: true
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
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{form.name}</h1>
        {form.description && (
          <p className="text-muted-foreground">{form.description}</p>
        )}
      </div>
      <FormEditor form={form} />
    </>
  );
};

export default page;
