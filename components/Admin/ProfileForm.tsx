"use client";

import { useActionState } from "react";
import { Field, TextAreaField, ArrayField, SubmitButton } from "@/components/Admin/fields";
import FileUploadField from "@/components/Admin/FileUploadField";
import { updateProfile } from "@/app/admin/(dashboard)/profile/actions";
import type { Profile } from "@/lib/api/types";

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useActionState(updateProfile, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={profile?.name} required />
        <Field label="Email" name="email" type="email" defaultValue={profile?.email} required />
      </div>

      <Field
        label="Logo initials"
        name="logoInitials"
        defaultValue={profile?.logoInitials}
        required
        hint='The wordmark in the top-left corner of every page, e.g. "sgs" or "AT".'
      />

      <Field label="Tagline" name="tagline" defaultValue={profile?.tagline} required hint='e.g. "Engineer | Innovator | Artist"' />
      <TextAreaField label="Bio" name="bio" defaultValue={profile?.bio ?? undefined} required rows={4} />

      {/* These three feed the homepage Hero section specifically — the
          role line, the italic motto under it, and the education badge. */}
      <ArrayField
        label="Hero roles"
        name="heroRoles"
        defaultValue={profile?.heroRoles}
        hint='One per line. Shown on the homepage as "Full Stack • AI/ML • ..."'
      />
      <Field
        label="Hero motto"
        name="heroMotto"
        defaultValue={profile?.heroMotto ?? undefined}
        hint="Short italic line under the roles, e.g. a personal motto."
      />
      <Field
        label="Hero badge"
        name="heroBadge"
        defaultValue={profile?.heroBadge ?? undefined}
        hint='The highlighted pill on the homepage, e.g. "B.E. ... • Class of 2025".'
      />

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
