import type { Metadata } from "next";
import Showcase from "@/components/Sections/Showcase";
import { getShowcaseCategories } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Showcase" };
export const dynamic = "force-dynamic";

export default async function ShowcasePage() {
  const categories = await getShowcaseCategories();
  return <Showcase categories={categories} />;
}
