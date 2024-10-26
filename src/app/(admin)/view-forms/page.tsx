import React from "react";
import { getUserForms } from "@/app/actions/getUserForms";
import { InferSelectModel } from "drizzle-orm";
import { forms as dbForms } from "@/db/schema";
import FormList from "@/components/forms/FormList";

const page = async () => {
  const forms: InferSelectModel<typeof dbForms>[] = await getUserForms();
  return (
    <>
      <FormList forms={forms} />
    </>
  );
};

export default page;
