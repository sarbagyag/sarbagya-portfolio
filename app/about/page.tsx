import type { Metadata } from "next";
import About from "@/components/Sections/About";
import { getEducation, getSkills, getProfile } from "@/db/queries";

export const metadata: Metadata = { title: "About" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [education, skills, profile] = await Promise.all([getEducation(), getSkills(), getProfile()]);

  return <About education={education} skills={skills} languages={profile?.languages ?? []} />;
}
