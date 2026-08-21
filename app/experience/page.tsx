import type { Metadata } from "next";
import Experience from "@/components/Sections/Experience";
import { getExperience } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Experience" };
export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const experience = await getExperience();
  return <Experience experience={experience} />;
}
