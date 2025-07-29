"use client";

import {
  Briefcase,
  CalendarSearch,
  GraduationCap,
  MessageCircle,
} from "lucide-react";
import FormGenerator from "../FormGenerator";
import { useState } from "react";

const LandingPage = () => {
  const [textareaValue, setTextareaValue] = useState("");

  const formPrompts = [
    {
      title: "Job Application Form",
      icon: Briefcase,
      prompt:
        "Create a Job Application Form for companies to collect applicant details. Include fields for full name, email, phone number, position applied for, resume upload (PDF), expected salary, and a short cover letter. Add dropdowns for experience level (Fresher, 1–3 years, 3–5 years, 5+ years) and preferred location. Include a submit button labeled “Apply Now”.",
    },
    {
      title: "Student Admission Form",
      icon: GraduationCap,
      prompt:
        "Generate a Student Admission Form for college or school admissions. Include sections for personal details (name, date of birth, gender), contact info, parent/guardian information, academic qualifications (10th, 12th or equivalent), course selection (dropdown), and upload options for previous marksheets and photo. Include declaration checkbox and a submit button labeled “Submit Application”.",
    },
    {
      title: "Event Registration Form",
      icon: CalendarSearch,
      prompt:
        "Create an Event Registration Form for a tech conference. Include fields for full name, email, phone number, company/organization, job title, and topics of interest (multi-select). Include a ticket selection dropdown (Free, Standard, VIP), meal preference (Veg/Non-Veg), and a submit button labeled “Register Now”.",
    },
    {
      title: "Customer Feedback Form",
      icon: MessageCircle,
      prompt:
        "Build a Customer Feedback Form for a product or service. Add fields for name (optional), email (optional), product/service used (dropdown), star rating (1–5), feedback textarea, and a checkbox asking for permission to contact the customer for follow-up. Include a submit button labeled “Send Feedback”.",
    },
  ];

  return (
    <section className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 pt-28 w-full bg-[url('/grid-black.svg')] dark:bg-[url('/grid-white.svg')] relative bg-opacity-5 z-0">
          <div
            className={`w-full absolute inset-0 bg-gradient-to-t from-transparent via-transparent z-0 dark:to-zinc-950 to-white`}
          />
          <div
            className={`w-full absolute inset-0 bg-gradient-to-c from-transparent via-transparent z-0 dark:to-zinc-950 to-white`}
          />
          <div
            className={`w-full absolute inset-0 bg-gradient-to-b from-transparent via-transparent z-0 dark:to-zinc-950 to-white`}
          />
          <h1 className="z-10 text-4xl text-center font-semibold sm:text-5xl md:text-6xl tracking-tighter leading-6">
            Forms built to grow <br className="block sm:hidden" /> with you.
          </h1>
          <p className="z-10 mt-2 text-sm md:text-base max-w-2xl mx-auto text-center text-zinc-600 dark:text-zinc-300">
            Generate and share your form in seconds.{" "}
            <span className="italic">
              Explore rich analytics, <br /> visual charts, and actionable
              insights.
            </span>
          </p>
          <div
            className={`w-full bg-gradient-to-b from-transparent z-0 dark:to-zinc-950 to-white h-24`}
          />
        </div>
        <FormGenerator
          chat={true}
          textareaValue={textareaValue}
          setTextareaValue={setTextareaValue}
        />
      </div>

      <div className="w-full overflow-x-auto px-4 mt-4 no-scrollbar">
        <div className="flex items-center justify-center gap-2 min-w-max">
          {formPrompts.map((formPrompt, index) => {
            const Icon = formPrompt.icon;
            return (
              <p
                key={index}
                onClick={() => setTextareaValue(formPrompt.prompt)}
                className="text-xs whitespace-nowrap hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all py-1.5 px-3 font-semibold rounded-full border cursor-pointer flex items-center gap-2 "
              >
                <Icon size={17} />
                {formPrompt.title}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
