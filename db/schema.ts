import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ---------- Enums ----------
export const experienceTypeEnum = pgEnum("experience_type", [
  "research",
  "internship",
  "job",
]);

export const projectCategoryEnum = pgEnum("project_category", [
  "ml",
  "systems",
  "networks",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "completed",
  "ongoing",
  "published",
]);

export const skillProficiencyEnum = pgEnum("skill_proficiency", [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

export const postStatusEnum = pgEnum("post_status", ["draft", "published"]);

// One `posts` table backs two public sections: the general-purpose "blog"
// and a "learning-log" (short-form write-ups on things being learned right
// now — jlox/clox, STM32, etc.). Same schema, same admin editor, just
// filtered by this field into two nav items/routes (/blog, /learning).
export const postTypeEnum = pgEnum("post_type", ["blog", "learning-log"]);

// Helper for jsonb string-array columns with a sane default.
const stringArray = (name: string) =>
  jsonb(name)
    .$type<string[]>()
    .default(sql`'[]'::jsonb`)
    .notNull();

// ---------- profile (singleton row) ----------
export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  bio: text("bio").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  twitterUrl: text("twitter_url"),
  youtubeUrl: text("youtube_url"),
  instagramUrl: text("instagram_url"),
  scholarUrl: text("scholar_url"),
  orcidUrl: text("orcid_url"),
  websiteUrl: text("website_url"),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  // Small, rarely-changed lists folded in as JSON instead of separate tables.
  languages: jsonb("languages")
    .$type<{ name: string; level: string }[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),
  academicSkills: stringArray("academic_skills"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- experience ----------
export const experience = pgTable("experience", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  type: experienceTypeEnum("type").notNull(),
  startDate: text("start_date").notNull(), // "YYYY-MM"
  endDate: text("end_date"),
  description: text("description").notNull(),
  responsibilities: stringArray("responsibilities"),
  technologies: stringArray("technologies"),
  achievements: stringArray("achievements"),
  companyUrl: text("company_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const experienceSubRoles = pgTable("experience_sub_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  experienceId: text("experience_id")
    .notNull()
    .references(() => experience.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  description: text("description").notNull(),
  responsibilities: stringArray("responsibilities"),
  technologies: stringArray("technologies"),
  achievements: stringArray("achievements"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ---------- projects ----------
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  technologies: stringArray("technologies"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  paperUrl: text("paper_url"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false).notNull(),
  category: projectCategoryEnum("category").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  status: projectStatusEnum("status"),
  impact: text("impact"),
  metrics: stringArray("metrics"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- education ----------
export const education = pgTable("education", {
  id: text("id").primaryKey(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  gpa: text("gpa"),
  location: text("location"),
  description: text("description"),
  achievements: stringArray("achievements"),
  relevantCoursework: stringArray("relevant_coursework"),
  thesis: text("thesis"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ---------- skills ----------
export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull(),
  skills: stringArray("skills"),
  proficiency: skillProficiencyEnum("proficiency"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ---------- posts (blog + learning-log) ----------
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: postTypeEnum("type").default("blog").notNull(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  contentMarkdown: text("content_markdown").notNull(),
  coverImageUrl: text("cover_image_url"),
  tags: stringArray("tags"),
  status: postStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- contact_messages ----------
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
