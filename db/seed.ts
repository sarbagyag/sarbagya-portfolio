import "./load-env";
import { db, profile, experience, experienceSubRoles, projects, education, skills, posts } from "./index";
import { createAdminClient } from "../lib/supabase/admin";
import { experience as legacyExperience } from "./legacy-data/experience";
import { projects as legacyProjects } from "./legacy-data/projects";
import { education as legacyEducation, skills as legacySkills, contactInfo } from "./legacy-data/skills";
import { posts as legacyPosts } from "./legacy-data/posts";

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user creation.");
    return;
  }

  const supabase = createAdminClient();
  const { data: existing } = await supabase.auth.admin.listUsers();
  const alreadyExists = existing?.users.some((u) => u.email === email);

  if (alreadyExists) {
    console.log(`[seed] Admin user ${email} already exists — skipping.`);
    return;
  }

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("[seed] Failed to create admin user:", error.message);
  } else {
    console.log(`[seed] Created admin user ${email}.`);
  }
}

async function seedProfile() {
  await db
    .insert(profile)
    .values({
      id: 1,
      name: "Sarbagya Gho Shrestha",
      tagline: "Engineer | Innovator | Artist",
      bio: "Full-stack engineer and researcher working across web platforms, embedded systems, and applied ML — from digital governance infrastructure serving 100+ government websites in Nepal, to earthquake early-warning models and 5G vehicular network protocols. Also a music producer.",
      email: contactInfo.email,
      phone: contactInfo.phone,
      location: contactInfo.location,
      linkedinUrl: contactInfo.linkedin,
      githubUrl: contactInfo.github,
      youtubeUrl: "https://www.youtube.com/@Sarbagya42",
      instagramUrl: "https://www.instagram.com/sarbu.wav",
      websiteUrl: contactInfo.website,
      resumeUrl: contactInfo.cv,
      academicSkills: [
        "Research Design & Methodology",
        "Technical Writing",
        "Data Analysis & Visualization",
        "Literature Review",
        "Experimental Design",
        "Performance Analysis",
        "Mathematical Modeling",
        "Scientific Programming",
        "Presentation & Communication",
        "Collaborative Research",
      ],
      languages: [
        { name: "English", level: "Fluent (Proficient)" },
        { name: "Nepali", level: "Native" },
        { name: "Newari", level: "Native" },
        { name: "Hindi", level: "Intermediate" },
      ],
    })
    .onConflictDoUpdate({
      target: profile.id,
      set: { updatedAt: new Date() },
    });
  console.log("[seed] Profile seeded.");
}

async function seedExperience() {
  for (const exp of legacyExperience) {
    const { subRoles, ...rest } = exp;
    await db
      .insert(experience)
      .values({
        ...rest,
        endDate: rest.endDate ?? null,
        location: rest.location || null,
        companyUrl: rest.companyUrl ?? null,
        achievements: rest.achievements ?? [],
      })
      .onConflictDoNothing({ target: experience.id });

    if (subRoles && subRoles.length > 0) {
      await db.insert(experienceSubRoles).values(
        subRoles.map((sr, index) => ({
          experienceId: exp.id,
          title: sr.title,
          company: sr.company,
          startDate: sr.startDate,
          endDate: sr.endDate ?? null,
          description: sr.description,
          responsibilities: sr.responsibilities,
          technologies: sr.technologies,
          achievements: sr.achievements ?? [],
          sortOrder: index,
        }))
      );
    }
  }
  console.log(`[seed] Seeded ${legacyExperience.length} experience entries.`);
}

async function seedProjects() {
  for (const p of legacyProjects) {
    await db
      .insert(projects)
      .values({
        ...p,
        longDescription: p.longDescription ?? null,
        endDate: p.endDate ?? null,
        status: p.status ?? null,
        impact: p.impact ?? null,
        metrics: p.metrics ?? [],
        githubUrl: p.githubUrl ?? null,
        liveUrl: p.liveUrl ?? null,
        paperUrl: p.paperUrl ?? null,
        imageUrl: p.imageUrl ?? null,
      })
      .onConflictDoNothing({ target: projects.id });
  }
  console.log(`[seed] Seeded ${legacyProjects.length} projects.`);
}

async function seedEducation() {
  for (const edu of legacyEducation) {
    await db
      .insert(education)
      .values({
        ...edu,
        endDate: edu.endDate ?? null,
        gpa: edu.gpa ?? null,
        description: edu.description ?? null,
        achievements: edu.achievements ?? [],
        relevantCoursework: edu.relevantCoursework ?? [],
        thesis: edu.thesis ?? null,
      })
      .onConflictDoNothing({ target: education.id });
  }
  console.log(`[seed] Seeded ${legacyEducation.length} education entries.`);
}

async function seedSkills() {
  const existing = await db.select().from(skills).limit(1);
  if (existing.length > 0) {
    console.log("[seed] Skills already seeded — skipping.");
    return;
  }
  await db.insert(skills).values(
    legacySkills.map((s, index) => ({
      category: s.category,
      skills: s.skills,
      proficiency: s.proficiency ?? null,
      sortOrder: index,
    }))
  );
  console.log(`[seed] Seeded ${legacySkills.length} skill categories.`);
}

async function seedPosts() {
  for (const post of legacyPosts) {
    await db
      .insert(posts)
      .values({
        type: post.type,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? null,
        contentMarkdown: post.contentMarkdown,
        tags: post.tags,
        status: "published",
        publishedAt: new Date(post.publishedAt),
      })
      .onConflictDoNothing({ target: posts.slug });
  }
  console.log(`[seed] Seeded ${legacyPosts.length} posts.`);
}

async function main() {
  console.log("Seeding database...");
  await seedAdminUser();
  await seedProfile();
  await seedExperience();
  await seedProjects();
  await seedEducation();
  await seedSkills();
  await seedPosts();
  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
