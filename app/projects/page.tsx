import type { Metadata } from "next";
import Projects from "@/components/Sections/Projects";
import { getProjects } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <Projects projects={projects} />;
}
