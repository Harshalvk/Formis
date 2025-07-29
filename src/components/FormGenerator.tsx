"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateForm } from "@/actions/generateForm";
import { useFormStatus } from "react-dom";
import { ArrowUp, LoaderCircle, Plus } from "lucide-react";
import { navigate } from "@/app/actions/navigateToForm";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { promptSchema } from "@/lib/validator/prompt.vaildator";
import { Form, FormField } from "@/components/ui/form";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && (
        <LoaderCircle className="h-5 w-5 animate-spin transition-all self-center" />
      )}
      {pending ? "Generating..." : "Generate"}
    </Button>
  );
}

const FormGenerator = ({
  chat,
  textareaValue,
  setTextareaValue,
}: {
  chat?: boolean;
  textareaValue: string;
  setTextareaValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [open, setOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onFormCreate = () => {
    setOpen(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const typewriterPhrases = [
    "contact form...",
    "job application form...",
    "survey form...",
    "event RSVP form...",
    "registration form...",
    "registration form...",
    "event RSVP form...",
    "survey form...",
    "job application form...",
    "contact form...",
  ];

  useEffect(() => {
    const currentPhrase = typewriterPhrases[phraseIndex];
    const fullText = `${currentPhrase}`;
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex === fullText.length) {
      timeout = setTimeout(() => {
        setDeleting(true);
      }, 1000);
    } else {
      timeout = setTimeout(() => {
        if (!deleting) {
          setPlaceholder(fullText.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          setPlaceholder(fullText.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
          if (charIndex - 1 === 0) {
            setDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
          }
        }
      }, 40);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex, typewriterPhrases]);

  async function onSubmit(values: z.infer<typeof promptSchema>) {
    const form = await generateForm({ data: values });
    if (form.data?.formId) {
      navigate(form.data.formId);
    }
  }

  return (
    <>
      {chat ? (
        <div className="w-full flex flex-col items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="z-50 w-full border rounded-3xl p-2"
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    placeholder={`Ask Formis to create a ${placeholder}`}
                    spellCheck={false}
                    className="flex-1 font-semibold w-full text-sm md:text-base border-none h-28 resize-none rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground/80"
                  />
                )}
              />
              <div className="w-full flex items-center justify-end">
                <Button
                  className="rounded-full px-3 self-end"
                  variant={"outline"}
                  type="submit"
                >
                  <ArrowUp />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={onFormCreate} className="z-50">
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new form</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="z-50 w-full border rounded-3xl p-2"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="description"
                      name="description"
                      required
                      placeholder="Share what your form is about, who is it for, and what information you would like to collect. And AI will do the magic 🤖"
                    />
                  )}
                />
                <div className="w-full flex items-center justify-end">
                  <Button
                    className="rounded-full px-3 self-end"
                    variant={"outline"}
                    type="submit"
                  >
                    <ArrowUp />
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FormGenerator;
