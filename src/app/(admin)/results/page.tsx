import React from "react";
import { getUserForms } from "@/app/actions/getUserForms";
import { InferSelectModel } from "drizzle-orm";
import { forms } from "@/db/schema";
import FormsPicker from "@/components/forms/FormsPicker";

type Props = {};

const page = async (props: Props) => {
  const userForms: Array<InferSelectModel<typeof forms>> = await getUserForms();

  if (!userForms?.length || userForms.length === 0) {
    return <div>No forms found</div>;
  }

  const selectOptions = userForms.map((form) => {
    return {
      lable: form.name,
      value: form.id,
    };
  });

  return (
    <div>
      Results: Dropdown & Tables
      <FormsPicker options={selectOptions} />
    </div>
  );
};

export default page;