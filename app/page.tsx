import Hero from "@/components/Sections/Hero";
import SiteOverview from "@/components/Sections/SiteOverview";
import { getProfile } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const profile = await getProfile();

  if (!profile) {
    // Should only happen before the seed script has run.
    return (
      <div className="min-h-dvh flex items-center justify-center text-text-secondary">
        Profile not set up yet — run the seed script or fill it in from /admin/profile.
      </div>
    );
  }

  return (
    <>
      <Hero profile={profile} />
      <SiteOverview />
    </>
  );
}
