import "server-only";
import { eq, asc, desc } from "drizzle-orm";
import { db, profile, experience, experienceSubRoles, projects, education, skills, posts, contactMessages } from "./index";

// ---------- profile (singleton) ----------
export async function getProfile() {
  const rows = await db.select().from(profile).where(eq(profile.id, 1)).limit(1);
  return rows[0] ?? null;
}

// ---------- experience ----------
export async function getExperience() {
  const rows = await db.select().from(experience).orderBy(asc(experience.sortOrder), desc(experience.startDate));
  const subRoles = await db.select().from(experienceSubRoles).orderBy(asc(experienceSubRoles.sortOrder));

  return rows.map((exp) => ({
    ...exp,
    subRoles: subRoles.filter((sr) => sr.experienceId === exp.id),
  }));
}

export async function getExperienceById(id: string) {
  const rows = await db.select().from(experience).where(eq(experience.id, id)).limit(1);
  if (!rows[0]) return null;
  const subRoles = await db
    .select()
    .from(experienceSubRoles)
    .where(eq(experienceSubRoles.experienceId, id))
    .orderBy(asc(experienceSubRoles.sortOrder));
  return { ...rows[0], subRoles };
}

// ---------- projects ----------
export async function getProjects() {
  return db.select().from(projects).orderBy(asc(projects.sortOrder), desc(projects.startDate));
}

export async function getFeaturedProjects() {
  const all = await getProjects();
  return all.filter((p) => p.featured);
}

export async function getProjectById(id: string) {
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return rows[0] ?? null;
}

// ---------- education ----------
export async function getEducation() {
  return db.select().from(education).orderBy(asc(education.sortOrder), desc(education.startDate));
}

export async function getEducationById(id: string) {
  const rows = await db.select().from(education).where(eq(education.id, id)).limit(1);
  return rows[0] ?? null;
}

// ---------- skills ----------
export async function getSkills() {
  return db.select().from(skills).orderBy(asc(skills.sortOrder));
}

export async function getSkillById(id: string) {
  const rows = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  return rows[0] ?? null;
}

// ---------- posts (blog + learning-log) ----------
export async function getPublishedPostsByType(type: "blog" | "learning-log") {
  const rows = await db.select().from(posts).where(eq(posts.type, type)).orderBy(desc(posts.publishedAt));
  return rows.filter((p) => p.status === "published");
}

export async function getPostBySlug(slug: string) {
  const rows = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return rows[0] ?? null;
}

// Admin: all posts regardless of status/type.
export async function getAllPosts() {
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostById(id: string) {
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return rows[0] ?? null;
}

// ---------- contact_messages ----------
export async function getContactMessages() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function getUnreadMessageCount() {
  const rows = await getContactMessages();
  return rows.filter((m) => !m.read).length;
}
