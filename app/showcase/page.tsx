import type { Metadata } from "next";
import Showcase from "@/components/Sections/Showcase";

export const metadata: Metadata = { title: "Showcase" };

export default function ShowcasePage() {
  return <Showcase />;
}
