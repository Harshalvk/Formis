-- New field types for the drag & drop editor
ALTER TYPE "public"."field_type" ADD VALUE IF NOT EXISTS 'Email';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE IF NOT EXISTS 'Number';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE IF NOT EXISTS 'Date';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE IF NOT EXISTS 'Checkbox';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE IF NOT EXISTS 'FileUpload';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE IF NOT EXISTS 'Rating';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE IF NOT EXISTS 'NPS';--> statement-breakpoint
ALTER TYPE "public"."field_type" ADD VALUE IF NOT EXISTS 'Ranking';--> statement-breakpoint

-- Ordering + per-field settings on questions
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "required" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "placeholder" text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "description" text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "config" jsonb;--> statement-breakpoint

-- Ordering on field options (so choice/ranking order is stable)
ALTER TABLE "field_options" ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0 NOT NULL;

-- NOTE ON RUNNING THIS MIGRATION
-- Postgres historically does not allow using a brand-new enum value in the
-- same transaction that adds it. If `drizzle-kit migrate` (or your driver)
-- wraps every statement in one transaction and this file errors out with
-- "unsafe use of new value of enum type", run the 8 ALTER TYPE lines above
-- once by themselves first (e.g. via `psql $DATABASE_URL -f this_file.sql`
-- or splitting them into their own migration), then run the rest.
