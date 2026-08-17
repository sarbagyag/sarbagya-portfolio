import type { Metadata } from "next";
import Contact from "@/components/Sections/Contact";
import { getProfile } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Contact" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        Profile not set up yet.
      </div>
    );
  }

  return <Contact profile={profile} />;
}
