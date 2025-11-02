export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  paperUrl?: string;
  imageUrl?: string;
  featured: boolean;
  category: "ml" | "systems" | "networks";
  startDate: string;
  endDate?: string;
  status?: "completed" | "ongoing" | "published";
  impact?: string;
  metrics?: string[];
}

export interface Research {
  id: string;
  title: string;
  description: string;
  institution: string;
  supervisor: string[];
  status: "ongoing" | "completed" | "published" | "under-review";
  startDate: string;
  endDate?: string;
  technologies: string[];
  paperUrl?: string;
  paperStatus?: string;
  contributions: string[];
  collaborators?: string[];
  keywords?: string[];
  metrics?: string[];
  venue?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: string;
  status: "published" | "under-review" | "in-preparation";
  doi?: string;
  arxiv?: string;
  pdf?: string;
  abstract?: string;
  citations?: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "research" | "internship" | "job";
  startDate: string;
  endDate?: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
  companyUrl?: string;
}

export interface Skill {
  category: string;
  skills: string[];
  proficiency?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  scholar?: string;
  orcid?: string;
  location: string;
  website?: string;
  twitter?: string;
  cv?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  location: string;
  description?: string;
  achievements?: string[];
  relevantCoursework?: string[];
  thesis?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
}

export interface ResearchInterest {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  relatedProjects?: string[];
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface ButtonProps {
  variant: "primary" | "secondary" | "ghost" | "outline";
  size: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface FormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// Utility types
export type ProjectCategory = Project["category"];
export type ResearchStatus = Research["status"];
export type ExperienceType = Experience["type"];
export type SkillLevel = NonNullable<Skill["proficiency"]>;