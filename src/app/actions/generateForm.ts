"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import Groq from "groq-sdk";
import { saveForm } from "./mutateForm";
import { promptSchema } from "@/lib/validator/prompt.vaildator";

export async function generateForm({
  data,
}: {
  data: z.infer<typeof promptSchema>;
}) {
  const promptExplanation =
    "PLEASE DO NOT START YOUR RESPONSE WITH WORDS AND DESCRIPTION LIKE 'Here is' etc, ALSO DO NOT WRAP THE RESPONSE INSIDE `` like this ```YOUR_RESPONSE```. MAKE SURE EACH KEY VALUE PAIR SHOULD BE WRAP IN DOUBLE QUOTES. Based on the description, generate a survey object with 3 fields: name(string) for the form, description(string) of the form and a questions array where every element has 2 fields: text and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with text(text should wrap in double quotes) and value(value should wrap in double quotes) fields. For example, for RadioGroup, and Select types, the field options array can be [{text: 'Yes', value: 'yes'}, {text: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the field options array can be empty. For example, for Input, Textarea, and Switch types, the field options array can be [].";

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: "moonshotai/kimi-k2-instruct",
      messages: [
        {
          role: "user",
          content: `${data.prompt} ${promptExplanation}`,
        },
      ],
    });

    console.log("AI: RESPONSE", response.choices[0].message);

    if (!response.choices[0].message["content"]) {
      return {
        message: "failed",
      };
    }

    const paresRes = JSON.parse(response.choices[0].message["content"]);

    const dbFormId = await saveForm({
      name: paresRes.name,
      description: paresRes.description,
      questions: paresRes.questions,
    });

    revalidatePath("/");
    return {
      message: "success",
      data: { formId: dbFormId },
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to create form",
    };
  }
}
