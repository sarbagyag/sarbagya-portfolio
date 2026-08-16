CREATE TYPE "public"."experience_type" AS ENUM('research', 'internship', 'job');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('blog', 'learning-log');--> statement-breakpoint
CREATE TYPE "public"."project_category" AS ENUM('ml', 'systems', 'networks');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('completed', 'ongoing', 'published');--> statement-breakpoint
CREATE TYPE "public"."skill_proficiency" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" text PRIMARY KEY NOT NULL,
	"institution" text NOT NULL,
	"degree" text NOT NULL,
	"field" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"gpa" text,
	"location" text,
	"description" text,
	"achievements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"relevant_coursework" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"thesis" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"location" text,
	"type" "experience_type" NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"description" text NOT NULL,
	"responsibilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"technologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"achievements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"company_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience_sub_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_id" text NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"description" text NOT NULL,
	"responsibilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"technologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"achievements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "post_type" DEFAULT 'blog' NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"content_markdown" text NOT NULL,
	"cover_image_url" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"bio" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"location" text,
	"linkedin_url" text,
	"github_url" text,
	"twitter_url" text,
	"youtube_url" text,
	"instagram_url" text,
	"scholar_url" text,
	"orcid_url" text,
	"website_url" text,
	"avatar_url" text,
	"resume_url" text,
	"languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"academic_skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"long_description" text,
	"technologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"github_url" text,
	"live_url" text,
	"paper_url" text,
	"image_url" text,
	"featured" boolean DEFAULT false NOT NULL,
	"category" "project_category" NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"status" "project_status",
	"impact" text,
	"metrics" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"proficiency" "skill_proficiency",
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "experience_sub_roles" ADD CONSTRAINT "experience_sub_roles_experience_id_experience_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;