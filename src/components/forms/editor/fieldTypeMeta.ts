import {
  TextCursorInput,
  AlignLeft,
  ChevronDownSquare,
  CircleDot,
  ToggleLeft,
  Mail,
  Hash,
  CalendarDays,
  CheckSquare,
  Upload,
  Star,
  Gauge,
  ArrowUpDown,
  type LucideIcon
} from "lucide-react";

export type FieldType =
  | "Input"
  | "Textarea"
  | "Select"
  | "RadioGroup"
  | "Switch"
  | "Email"
  | "Number"
  | "Date"
  | "Checkbox"
  | "FileUpload"
  | "Rating"
  | "NPS"
  | "Ranking";

export type FieldCategory = "basic" | "choice" | "advanced";

export interface FieldMeta {
  label: string;
  icon: LucideIcon;
  description: string;
  needsOptions: boolean;
  category: FieldCategory;
  defaultConfig?: Record<string, unknown>;
}

export const FIELD_TYPE_META: Record<FieldType, FieldMeta> = {
  Input: {
    label: "Short Text",
    icon: TextCursorInput,
    description: "A single-line text answer",
    needsOptions: false,
    category: "basic"
  },
  Textarea: {
    label: "Long Text",
    icon: AlignLeft,
    description: "A multi-line text answer",
    needsOptions: false,
    category: "basic"
  },
  Email: {
    label: "Email",
    icon: Mail,
    description: "Validated email address",
    needsOptions: false,
    category: "basic"
  },
  Number: {
    label: "Number",
    icon: Hash,
    description: "Numeric input with optional min / max",
    needsOptions: false,
    category: "basic",
    defaultConfig: { step: 1 }
  },
  Date: {
    label: "Date",
    icon: CalendarDays,
    description: "Date picker",
    needsOptions: false,
    category: "basic"
  },
  Select: {
    label: "Dropdown",
    icon: ChevronDownSquare,
    description: "Pick one option from a dropdown",
    needsOptions: true,
    category: "choice"
  },
  RadioGroup: {
    label: "Single Choice",
    icon: CircleDot,
    description: "Pick exactly one option",
    needsOptions: true,
    category: "choice"
  },
  Checkbox: {
    label: "Multiple Choice",
    icon: CheckSquare,
    description: "Pick one or more options",
    needsOptions: true,
    category: "choice"
  },
  Switch: {
    label: "Yes / No",
    icon: ToggleLeft,
    description: "A simple on/off toggle",
    needsOptions: false,
    category: "basic"
  },
  FileUpload: {
    label: "File Upload",
    icon: Upload,
    description: "Let respondents attach a file",
    needsOptions: false,
    category: "advanced",
    defaultConfig: { accept: "*", maxSizeMB: 10 }
  },
  Rating: {
    label: "Star Rating",
    icon: Star,
    description: "Rate on a star scale",
    needsOptions: false,
    category: "advanced",
    defaultConfig: { maxStars: 5 }
  },
  NPS: {
    label: "Recommend Score",
    icon: Gauge,
    description: "0–10 likelihood-to-recommend score",
    needsOptions: false,
    category: "advanced",
    defaultConfig: {
      minLabel: "Not at all likely",
      maxLabel: "Extremely likely"
    }
  },
  Ranking: {
    label: "Ranking",
    icon: ArrowUpDown,
    description: "Respondents drag items into their preferred order",
    needsOptions: true,
    category: "advanced"
  }
};

export const FIELD_CATEGORIES: { key: FieldCategory; label: string }[] = [
  { key: "basic", label: "Basic" },
  { key: "choice", label: "Choice" },
  { key: "advanced", label: "Advanced" }
];
