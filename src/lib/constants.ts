import {
  Briefcase,
  CalendarSearch,
  GraduationCap,
  MessageCircle
} from "lucide-react";

export const formPrompts = [
  {
    title: "Job Application Form",
    icon: Briefcase,
    prompt:
      "Create a Job Application Form for companies to collect applicant details. Include fields for full name, email, phone number, position applied for, resume upload (PDF), expected salary, and a short cover letter. Add dropdowns for experience level (Fresher, 1–3 years, 3–5 years, 5+ years) and preferred location. Include a submit button labeled “Apply Now”."
  },
  {
    title: "Student Admission Form",
    icon: GraduationCap,
    prompt:
      "Generate a Student Admission Form for college or school admissions. Include sections for personal details (name, date of birth, gender), contact info, parent/guardian information, academic qualifications (10th, 12th or equivalent), course selection (dropdown), and upload options for previous marksheets and photo. Include declaration checkbox and a submit button labeled “Submit Application”."
  },
  {
    title: "Event Registration Form",
    icon: CalendarSearch,
    prompt:
      "Create an Event Registration Form for a tech conference. Include fields for full name, email, phone number, company/organization, job title, and topics of interest (multi-select). Include a ticket selection dropdown (Free, Standard, VIP), meal preference (Veg/Non-Veg), and a submit button labeled “Register Now”."
  },
  {
    title: "Customer Feedback Form",
    icon: MessageCircle,
    prompt:
      "Build a Customer Feedback Form for a product or service. Add fields for name (optional), email (optional), product/service used (dropdown), star rating (1–5), feedback textarea, and a checkbox asking for permission to contact the customer for follow-up. Include a submit button labeled “Send Feedback”."
  }
];
