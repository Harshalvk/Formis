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
import { submitAnswers, type Answer } from "@/app/actions/submitAnswers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();
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
    } else {
      let answers: Answer[] = [];
      for (const [questionId, value] of Object.entries(data)) {
        const id = parseInt(questionId.replace("question_", ""));
        let fieldOptionsId = null;
        let textValue = null;

        if (typeof value == "string" && value.includes("answerId_")) {
          fieldOptionsId = parseInt(value.replace("answerId_", ""));
        } else {
          textValue = value as string;
        }

        answers.push({
          questionId: id,
          fieldOptionsId,
          value: textValue,
        });

        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const response = await fetch(`${baseUrl}/api/form/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formId: props.form.id, answers }),
        });

        if (response.status === 200) {
          router.push("/form/success");
        } else {
          console.log("Error submitting form");
          alert("Error submitting form. Please try again later");
        }

        try {
          const response = await submitAnswers({
            formId: props.form.id,
            answers,
          });
          if (response) {
            router.push("/forms/submit-success");
          }
        } catch (error) {
          console.error(error);
          toast("An error occurred while submitting the form.");
        }
      }
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
