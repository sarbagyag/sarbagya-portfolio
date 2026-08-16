"use client";

import { useActionState } from "react";
import { Field, TextAreaField, ArrayField, SubmitButton } from "@/components/Admin/fields";
import FileUploadField from "@/components/Admin/FileUploadField";
import { updateProfile } from "@/app/admin/(dashboard)/profile/actions";
import type { profile as profileTable } from "@/db/schema";

type Profile = typeof profileTable.$inferSelect;

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useActionState(updateProfile, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={profile?.name} required />
        <Field label="Email" name="email" type="email" defaultValue={profile?.email} required />
      </div>

      <Field label="Tagline" name="tagline" defaultValue={profile?.tagline} required hint='e.g. "Engineer | Innovator | Artist"' />
      <TextAreaField label="Bio" name="bio" defaultValue={profile?.bio ?? undefined} required rows={4} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone" name="phone" defaultValue={profile?.phone ?? undefined} />
        <Field label="Location" name="location" defaultValue={profile?.location ?? undefined} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="LinkedIn URL" name="linkedinUrl" type="url" defaultValue={profile?.linkedinUrl ?? undefined} />
        <Field label="GitHub URL" name="githubUrl" type="url" defaultValue={profile?.githubUrl ?? undefined} />
        <Field label="Twitter/X URL" name="twitterUrl" type="url" defaultValue={profile?.twitterUrl ?? undefined} />
        <Field label="YouTube URL" name="youtubeUrl" type="url" defaultValue={profile?.youtubeUrl ?? undefined} />
        <Field label="Instagram URL" name="instagramUrl" type="url" defaultValue={profile?.instagramUrl ?? undefined} />
        <Field label="Scholar URL" name="scholarUrl" type="url" defaultValue={profile?.scholarUrl ?? undefined} />
        <Field label="ORCID URL" name="orcidUrl" type="url" defaultValue={profile?.orcidUrl ?? undefined} />
        <Field label="Website URL" name="websiteUrl" type="url" defaultValue={profile?.websiteUrl ?? undefined} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FileUploadField
          label="Avatar image"
          name="avatarUrl"
          defaultValue={profile?.avatarUrl}
          folder="avatars"
          accept="image/*"
        />
        <FileUploadField
          label="Resume/CV"
          name="resumeUrl"
          defaultValue={profile?.resumeUrl}
          folder="resumes"
          accept="application/pdf"
        />
      </div>

      <ArrayField label="Academic skills" name="academicSkills" defaultValue={profile?.academicSkills} />
      <ArrayField
        label="Languages"
        name="languages"
        defaultValue={profile?.languages?.map((l) => `${l.name} - ${l.level}`)}
        hint='One per line, format: "English - Fluent"'
      />

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton label="Save changes" />
        {state?.success && <span className="text-sm text-carbon-support-success">Saved.</span>}
        {state?.error && <span className="text-sm text-carbon-support-error">{state.error}</span>}
      </div>
    </form>
  );
}
