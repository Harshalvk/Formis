"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveForm } from "./mutateForm";
import { promptSchema } from "@/lib/validator/prompt.vaildator";
import { OpenAI } from "openai";
import { auth, signIn } from "@/auth";

const FieldOptionSchema = z.object({
  text: z.string(),
  value: z.string()
});

const FieldTypeSchema = z.enum([
  "RadioGroup",
  "Select",
  "Input",
  "Textarea",
  "Switch"
]);

const QuestionSchema = z
  .object({
    text: z.string(),
    fieldType: FieldTypeSchema,
    fieldOptions: z.array(FieldOptionSchema)
  })
  .superRefine((data, ctx) => {
    const requiresOptions =
      data.fieldType === "RadioGroup" || data.fieldType === "Select";

    if (requiresOptions && data.fieldOptions.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "RadioGroup and Select fields must have at least one field option.",
        path: ["fieldOptions"]
      });
    }

    if (!requiresOptions && data.fieldOptions.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Input, Textarea, and Switch fields must have an empty fieldOptions array.",
        path: ["fieldOptions"]
      });
    }
  });

const SurveySchema = z.object({
  name: z.string(),
  description: z.string(),
  questions: z.array(QuestionSchema).min(1)
});

export async function generateForm({
  data
}: {
  data: z.infer<typeof promptSchema>;
}) {
  const session = await auth();

  if (!session?.user) {
    await signIn("google");
  }

  const oai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
  });

  const systemPrompt = `You generate survey/form definitions as a single JSON object and nothing else.
Return ONLY valid JSON matching this exact shape (no markdown fences, no preamble):
{
  "name": string,
  "description": string,
  "questions": [
    {
      "text": string,
      "fieldType": "RadioGroup" | "Select" | "Input" | "Textarea" | "Switch",
      "fieldOptions": [{ "text": string, "value": string }]
    }
  ]
}
Rules:
- RadioGroup and Select MUST have at least one item in fieldOptions.
- Input, Textarea, and Switch MUST have an empty fieldOptions array ([]).
- All keys and string values must use double quotes.
- Output must be valid JSON parseable by JSON.parse — no trailing commas, no comments.`;

  try {
    const completion = await oai.chat.completions.create({
      model: "openai/gpt-oss-20b",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data.prompt }
      ]
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return { message: "Failed to create form" };
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(content);
    } catch {
      console.log("Model did not return valid JSON:", content);
      return { message: "Failed to create form" };
    }

    const result = SurveySchema.safeParse(parsedJson);

    if (!result.success) {
      console.log("Schema validation failed:", result.error.flatten());
      return { message: "Failed to create form" };
    }

    const dbFormId = await saveForm({
      name: result.data.name,
      description: result.data.description,
      questions: result.data.questions
    });

    revalidatePath("/");
    return {
      message: "success",
      data: { formId: dbFormId }
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to create form"
    };
  }
}
