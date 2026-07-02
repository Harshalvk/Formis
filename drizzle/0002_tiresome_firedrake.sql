ALTER TYPE "public"."field_type" ADD VALUE 'Email';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE 'Number';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE 'Date';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE 'Checkbox';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE 'FileUpload';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE 'Rating';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE 'NPS';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE 'Ranking';--> statement-breakpoint
ALTER TABLE "field_options" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "required" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "placeholder" text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "config" jsonb;