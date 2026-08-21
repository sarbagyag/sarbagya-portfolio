import ProfileForm from "@/components/Admin/ProfileForm";
import { getProfile } from "@/lib/api/queries";

export const dynamic = "force-dynamic";
// Applies to this page's Server Actions too, including processFavoriteTrack
// (favorite-track-actions.ts) — it downloads+transcodes audio server-side
// via the Go API and can run well past Vercel's default duration. 60s is
// the Hobby plan's hard ceiling (Pro/Enterprise allow more but this stays
// portable); the Go route itself allows up to 150s (see router.go) for
// direct/non-Vercel callers.
export const maxDuration = 60;

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
