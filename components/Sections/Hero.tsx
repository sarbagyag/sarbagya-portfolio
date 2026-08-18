"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Mail, Github, Linkedin, Youtube, Instagram } from "lucide-react";
import type { Profile } from "@/lib/api/types";
import FavoriteTrack from "@/components/FavoriteTrack";

// Carbon-style block hero: a solid layer-01 panel (bg-secondary/bg-card —
// already mapped to --cds-layer-01, so this reads correctly in both themes
// rather than being a one-off color), photo bleeding to the block's own
// edges (but starting below the fixed nav, not under it — see pt-20). No
// gradients, shadows, rounded pills, or decorative motion. CV + socials are
// kept deliberately quiet: a Carbon "tertiary" outline button (not a filled
// block) and plain icon links, both secondary to the name.
//
// Every /admin/profile hero field gets used here (tagline, heroRoles,
// heroMotto, heroBadge) — just as typographic hierarchy rather than
// boxes/pills, so nothing you can edit sits unused. favoriteTrackAudioUrl
// is the one exception: it renders as an actual player (FavoriteTrack),
// not typography, since it needs to be playable.
const Hero: React.FC<{ profile: Profile }> = ({ profile }) => {
  const socialLinks = [
    { href: profile.githubUrl, label: "GitHub", icon: Github },
    { href: profile.linkedinUrl, label: "LinkedIn", icon: Linkedin },
    { href: profile.youtubeUrl, label: "YouTube", icon: Youtube },
    { href: profile.instagramUrl, label: "Instagram", icon: Instagram },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href));

  return (
    // overflow-hidden + the motion.div's exact md:h-[calc(100svh-5rem)]
    // below (5rem = the fixed nav's own h-20, which floats over this
    // section rather than sitting in normal flow above it, so "one full
    // screen" is nav-height + this section, not nav-height + this + more)
    // together guarantee the hero is the entire initial screen on
    // desktop — nothing from the next section (SiteOverview) peeks in
    // before scrolling. Not applied below md: the stacked mobile layout
    // never had a height constraint here either (min-h-[70svh] was
    // already md-only), and forcing one screen's worth of height onto a
    // vertically-stacked photo+text layout would cramp it far more than
    // it does the two-column desktop layout.
    <section id="home" className="bg-bg-secondary pt-20 overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto grid md:grid-cols-2 md:h-[calc(100svh_-_5rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Text. Without a favorite track, centered as before. With one,
            top content stays put and the player itself grows (flex-1) to
            consume whatever's left down to the column's bottom — which
            now exactly matches the photo's bottom, since the column above
            is a fixed height rather than a min-height. */}
        <div
          className={`order-2 md:order-1 flex flex-col px-6 sm:px-10 lg:px-20 py-12 md:py-20 ${
            profile.favoriteTrackAudioUrl ? "" : "justify-center"
          }`}
        >
          {profile.tagline && (
            <p className="text-sm sm:text-base font-semibold text-link mb-3">{profile.tagline}</p>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-4 leading-tight">
            {profile.name}
          </h1>

          {profile.heroRoles.length > 0 && (
            <p className="text-base sm:text-lg text-text-secondary mb-5 max-w-md">
              {profile.heroRoles.join(" • ")}
            </p>
          )}

          {profile.heroMotto && (
            <p className="text-base sm:text-lg text-text-secondary max-w-md leading-relaxed mb-10">
              {profile.heroMotto}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={profile.resumeUrl || "/resume/sarbagya-updated-resume.pdf"}
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-link text-link text-sm font-semibold hover:bg-link-subtle transition-colors"
            >
              <FileText size={16} />
              Download CV
            </a>

            <div className="flex items-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="text-text-tertiary hover:text-link transition-colors"
              >
                <Mail size={18} />
              </a>
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-text-tertiary hover:text-link transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {profile.heroBadge && (
            <p className="mt-8 text-xs sm:text-sm text-text-tertiary">{profile.heroBadge}</p>
          )}

          {profile.favoriteTrackAudioUrl && (
            <FavoriteTrack
              className="mt-8"
              audioUrl={profile.favoriteTrackAudioUrl}
              coverUrl={profile.favoriteTrackCoverUrl}
              title={profile.favoriteTrackTitle}
              artist={profile.favoriteTrackArtist}
              label={profile.favoriteTrackLabel}
            />
          )}
        </div>

        {/* Photo — bleeds to the block's own edges, no radius/border/shadow.
            Starts right below the fixed nav (section's pt-20) rather than
            running under it, where a transparent nav made the logo/links
            hard to read against the image.
            md:h-[85%] md:self-start (rather than the grid's default
            stretch-to-fill-row): now that the row itself is pinned to
            exactly one screen tall, stretching the photo to match that
            full height read as an overly elongated crop. Capping it at
            85% and top-aligning keeps it flush against the nav like
            before, just shorter — the section's own background (matching
            the panel behind it) shows through in the gap below rather
            than the photo stretching to fill it. */}
        <div className="order-1 md:order-2 relative h-72 sm:h-96 md:h-[85%] md:self-start">
          <img
            src={profile.avatarUrl || "/sarbagya-hero.jpg"}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover grayscale"
            loading="eager"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
