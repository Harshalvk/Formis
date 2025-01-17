import React from "react";
import { forms } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

type Form = InferSelectModel<typeof forms>;

type Props = {
  forms: Form[];
};

const FormList = ({ forms }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 m-5 p-4 gap-4">
      {forms.map((form: Form) => (
        <Card key={form.id} className="max-w-[350px] flex flex-col">
          <CardHeader className="flex-1">
            <CardTitle>{form.name}</CardTitle>
            <CardDescription>{form.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href={`/forms/edit/${form.id}`} className="w-full">
              <Button className="w-full">View</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FormList;
