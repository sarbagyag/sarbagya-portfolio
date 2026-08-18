import { z } from "zod";

// Admin array fields are edited as one-item-per-line <textarea>s rather than
// a chip/tag-input widget — simplest thing that works, matches the plain-CSS
// admin aesthetic, and needs no client-side state library.
export const linesToArray = (val: string | null | undefined): string[] =>
  (val ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^https?:\/\//.test(v), "Must be a full URL (https://...)");


const arrayField = z
  .string()
  .optional()
  .transform((v) => linesToArray(v));

// "English - Fluent" per line -> [{ name: "English", level: "Fluent" }]
const languagesField = z
  .string()
  .optional()
  .transform((v) =>
    linesToArray(v)
      .map((line) => {
        const [name, ...rest] = line.split("-");
        return { name: name?.trim() ?? "", level: rest.join("-").trim() };
      })
      .filter((l) => l.name)
  );

// ---------- profile ----------
export const profileSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  tagline: z.string().trim().min(1, "Required"),
  bio: z.string().trim().min(1, "Required"),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  twitterUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  instagramUrl: optionalUrl,
  scholarUrl: optionalUrl,
  orcidUrl: optionalUrl,
  websiteUrl: optionalUrl,
  avatarUrl: optionalUrl,
  resumeUrl: optionalUrl,
  academicSkills: arrayField,
  languages: languagesField,
  heroRoles: arrayField,
  heroMotto: z.string().trim().optional(),
  heroBadge: z.string().trim().optional(),
  logoInitials: z.string().trim().min(1, "Required").max(8, "Keep it short - it's a logo mark"),
  // audioUrl/coverUrl/sourceUrl come from FavoriteTrackField's "process"
  // step (hidden inputs, same shape as avatarUrl/resumeUrl from
  // FileUploadField) — title/artist/label are typed directly by the admin.
  favoriteTrackAudioUrl: optionalUrl,
  favoriteTrackCoverUrl: optionalUrl,
  favoriteTrackSourceUrl: optionalUrl,
  favoriteTrackTitle: z.string().trim().optional(),
  favoriteTrackArtist: z.string().trim().optional(),
  favoriteTrackLabel: z.string().trim().optional(),
});
export type ProfileInput = z.infer<typeof profileSchema>;

// ---------- experience ----------
export const experienceSubRoleSchema = z.object({
  title: z.string().trim().min(1, "Required"),
  company: z.string().trim().min(1, "Required"),
  startDate: z.string().trim().min(1, "Required"),
  endDate: z.string().trim().optional(),
  description: z.string().trim().min(1, "Required"),
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
});
export type ExperienceSubRoleInput = z.infer<typeof experienceSubRoleSchema>;

export const experienceSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  title: z.string().trim().min(1, "Required"),
  company: z.string().trim().min(1, "Required"),
  location: z.string().trim().optional(),
  type: z.enum(["research", "internship", "job"]),
  startDate: z.string().trim().min(1, "Required"),
  endDate: z.string().trim().optional(),
  description: z.string().trim().min(1, "Required"),
  responsibilities: arrayField,
  technologies: arrayField,
  achievements: arrayField,
  companyUrl: optionalUrl,
  sortOrder: z.coerce.number().int().default(0),
  subRoles: z.array(experienceSubRoleSchema).default([]),
});
export type ExperienceInput = z.infer<typeof experienceSchema>;

// ---------- projects ----------
export const projectSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  title: z.string().trim().min(1, "Required"),
  description: z.string().trim().min(1, "Required"),
  longDescription: z.string().trim().optional(),
  technologies: arrayField,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  paperUrl: optionalUrl,
  imageUrl: optionalUrl,
  featured: z.coerce.boolean().default(false),
  category: z.enum(["ml", "systems", "networks"]),
  startDate: z.string().trim().min(1, "Required"),
  endDate: z.string().trim().optional(),
  status: z.enum(["completed", "ongoing", "published"]).optional(),
  impact: z.string().trim().optional(),
  metrics: arrayField,
  sortOrder: z.coerce.number().int().default(0),
});
export type ProjectInput = z.infer<typeof projectSchema>;

// ---------- education ----------
export const educationSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  institution: z.string().trim().min(1, "Required"),
  degree: z.string().trim().min(1, "Required"),
  field: z.string().trim().min(1, "Required"),
  startDate: z.string().trim().min(1, "Required"),
  endDate: z.string().trim().optional(),
  gpa: z.string().trim().optional(),
  location: z.string().trim().optional(),
  description: z.string().trim().optional(),
  achievements: arrayField,
  relevantCoursework: arrayField,
  thesis: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().default(0),
});
export type EducationInput = z.infer<typeof educationSchema>;

// ---------- skills ----------
export const skillSchema = z.object({
  category: z.string().trim().min(1, "Required"),
  skills: arrayField,
  proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
  sortOrder: z.coerce.number().int().default(0),
});
export type SkillInput = z.infer<typeof skillSchema>;

// ---------- showcase ----------
export const showcaseItemSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  url: z.string().trim().min(1, "Required"),
});
export type ShowcaseItemInput = z.infer<typeof showcaseItemSchema>;

export const showcaseCategorySchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  title: z.string().trim().min(1, "Required"),
  description: z.string().trim().min(1, "Required"),
  featuredName: z.string().trim().min(1, "Required"),
  // Not validated as a strict https:// URL — some entries intentionally use
  // "#" as a placeholder link (no live site yet).
  featuredUrl: z.string().trim().min(1, "Required"),
  featuredImageUrl: optionalUrl,
  sortOrder: z.coerce.number().int().default(0),
  items: z.array(showcaseItemSchema).default([]),
});
export type ShowcaseCategoryInput = z.infer<typeof showcaseCategorySchema>;

// ---------- posts ----------
export const postSchema = z.object({
  type: z.enum(["blog", "learning-log"]),
  slug: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  title: z.string().trim().min(1, "Required"),
  excerpt: z.string().trim().optional(),
  contentMarkdown: z.string().trim().min(1, "Required"),
  coverImageUrl: optionalUrl,
  tags: arrayField,
  status: z.enum(["draft", "published"]),
});
export type PostInput = z.infer<typeof postSchema>;
