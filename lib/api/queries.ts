import { ApiError, adminFetch, publicFetch } from "./server";
import type { ContactMessage, Education, Experience, Post, Profile, Project, ShowcaseCategory, Skill } from "./types";

// ---------- profile (singleton) ----------
export async function getProfile(): Promise<Profile | null> {
  try {
    return await publicFetch<Profile>("/api/profile");
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

// ---------- experience ----------
// The Go API only exposes a list route (GET /api/experience) — no
// single-item lookup — so "by id" reads filter the list.
export async function getExperience(): Promise<Experience[]> {
  return publicFetch<Experience[]>("/api/experience");
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const all = await getExperience();
  return all.find((e) => e.id === id) ?? null;
}

// ---------- projects ----------
export async function getProjects(): Promise<Project[]> {
  return publicFetch<Project[]>("/api/projects");
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return publicFetch<Project[]>("/api/projects?featured=true");
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    return await publicFetch<Project>(`/api/projects/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

// ---------- education ----------
// Same "list only" API shape as experience.
export async function getEducation(): Promise<Education[]> {
  return publicFetch<Education[]>("/api/education");
}

export async function getEducationById(id: string): Promise<Education | null> {
  const all = await getEducation();
  return all.find((e) => e.id === id) ?? null;
}

// ---------- skills ----------
// Same "list only" API shape as experience/education.
export async function getSkills(): Promise<Skill[]> {
  return publicFetch<Skill[]>("/api/skills");
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const all = await getSkills();
  return all.find((s) => s.id === id) ?? null;
}

// ---------- showcase ----------
// The Go API only exposes a list route (GET /api/showcase) — no
// single-item lookup — so "by id" reads filter the list.
export async function getShowcaseCategories(): Promise<ShowcaseCategory[]> {
  return publicFetch<ShowcaseCategory[]>("/api/showcase");
}

export async function getShowcaseCategoryById(id: string): Promise<ShowcaseCategory | null> {
  const all = await getShowcaseCategories();
  return all.find((c) => c.id === id) ?? null;
}

// ---------- posts (blog + learning-log) ----------
export async function getPublishedPostsByType(type: "blog" | "learning-log"): Promise<Post[]> {
  return publicFetch<Post[]>(`/api/posts?type=${type}`);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await publicFetch<Post>(`/api/posts/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

// Admin: all posts regardless of status/type.
export async function getAllPosts(): Promise<Post[]> {
  return adminFetch<Post[]>("/api/admin/posts");
}

// No single-item admin route either — filter the admin list, same pattern
// as experience/education/skills.
export async function getPostById(id: string): Promise<Post | null> {
  const all = await getAllPosts();
  return all.find((p) => p.id === id) ?? null;
}

// ---------- contact_messages (admin only) ----------
export async function getContactMessages(): Promise<ContactMessage[]> {
  return adminFetch<ContactMessage[]>("/api/admin/messages");
}

export async function getUnreadMessageCount(): Promise<number> {
  const rows = await getContactMessages();
  return rows.filter((m) => !m.read).length;
}
