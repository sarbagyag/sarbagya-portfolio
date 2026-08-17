import ProfileForm from "@/components/Admin/ProfileForm";
import { getProfile } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
