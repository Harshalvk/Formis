import React from "react";
import { getUserForms } from "@/app/actions/getUserForms";
import { InferSelectModel } from "drizzle-orm";
import { forms as dbForms } from "@/db/schema";
import FormList from "@/components/forms/FormList";

const page = async () => {
  const forms: InferSelectModel<typeof dbForms>[] = await getUserForms();
  return (
    <>
      <h1 className="text-3xl font-bold px-4 m-5">My Forms</h1>
      <FormList forms={forms} />
    </>
  );
};

export default page;
