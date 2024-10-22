"use client";
import React, { useState } from "react";
import {
  FormSelectMode,
  QuestionSelectModel,
  FieldOptionsSelectModel,
} from "@/types/form-types";
import {
  Form as FormComponent,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import FormField from "./FormField";
import { publishForm } from "@/app/actions/mutateForm";
import FormPublishSuccess from "./FormPublishSuccess";

type Props = {
  form: Form;
  editMode?: boolean;
};

type QuestionWithOptionMode = QuestionSelectModel & {
  fieldOptions: Array<FieldOptionsSelectModel>;
};

interface Form extends FormSelectMode {
  questions: Array<QuestionWithOptionMode>;
}

const Form = (props: Props) => {
  const form = useForm();
  const { editMode } = props;
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleDialogChange = (open: boolean) => {
    setSuccessDialogOpen(open);
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    if (editMode) {
      await publishForm(props.form.id);
      setSuccessDialogOpen(true);
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold py-3">{props.form.name}</h1>
      <h3 className="text-gray-300">{props.form.description}</h3>
      <FormComponent {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full max-w-3xl items-center gap-6 my-4"
        >
          {props.form.questions.map(
            (question: QuestionWithOptionMode, index: number) => {
              return (
                <ShadcnFormField
                  control={form.control}
                  name={`question_${question.id}`}
                  key={`${question.text}_${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base mt-3">
                        {index + 1}. {question.text}
                      </FormLabel>
                      <FormControl>
                        <FormField
                          element={question}
                          key={index}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            }
          )}
          <Button type="submit">{editMode ? "Publish" : "Submit"}</Button>
        </form>
      </FormComponent>
      <FormPublishSuccess
        formId={props.form.id}
        open={successDialogOpen}
        onOpenChange={handleDialogChange}
      />
    </div>
  );
};

export default Form;
