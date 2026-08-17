// Plain interfaces mirroring server/internal/models/models.go — the JSON
// shape returned by the Go API. These replace the old `typeof xTable.$inferSelect`
// types that came from db/schema.ts (Drizzle) before the Supabase→Go migration.

export interface Language {
  name: string;
  level: string;
}

export interface Profile {
  id: number;
  name: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  instagramUrl: string | null;
  scholarUrl: string | null;
  orcidUrl: string | null;
  websiteUrl: string | null;
  avatarUrl: string | null;
  resumeUrl: string | null;
  languages: Language[];
  academicSkills: string[];
  heroRoles: string[];
  heroMotto: string | null;
  heroBadge: string | null;
  updatedAt: string; // ISO timestamp
}

export interface ExperienceSubRole {
  id: string;
  experienceId: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  sortOrder: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string | null;
  type: "research" | "internship" | "job";
  startDate: string;
  endDate: string | null;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  companyUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  subRoles: ExperienceSubRole[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string | null;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  paperUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  category: "ml" | "systems" | "networks";
  startDate: string;
  endDate: string | null;
  status: "completed" | "ongoing" | "published" | null;
  impact: string | null;
  metrics: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  gpa: string | null;
  location: string | null;
  description: string | null;
  achievements: string[];
  relevantCoursework: string[];
  thesis: string | null;
  sortOrder: number;
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
  proficiency: "beginner" | "intermediate" | "advanced" | "expert" | null;
  sortOrder: number;
}

export interface Post {
  id: string;
  type: "blog" | "learning-log";
  slug: string;
  title: string;
  excerpt: string | null;
  contentMarkdown: string;
  coverImageUrl: string | null;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShowcaseItem {
  id: string;
  categoryId: string;
  name: string;
  url: string;
  sortOrder: number;
}

export interface ShowcaseCategory {
  id: string;
  title: string;
  description: string;
  featuredName: string;
  featuredUrl: string;
  featuredImageUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  items: ShowcaseItem[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}
