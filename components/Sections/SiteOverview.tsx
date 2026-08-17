"use client";

import Link from "next/link";
import {
  User,
  Briefcase,
  FolderGit2,
  Rocket,
  PenLine,
  GraduationCap,
  Mail,
  ArrowRight,
} from "lucide-react";

interface OverviewItem {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const items: OverviewItem[] = [
  {
    label: "About",
    description: "Background, education, and skills",
    href: "/about",
    icon: <User size={20} />,
  },
  {
    label: "Experience",
    description: "Professional roles and impact",
    href: "/experience",
    icon: <Briefcase size={20} />,
  },
  {
    label: "Projects",
    description: "Things I've built, with the details",
    href: "/projects",
    icon: <FolderGit2 size={20} />,
  },
  {
    label: "Showcase",
    description: "Platforms live in production",
    href: "/showcase",
    icon: <Rocket size={20} />,
  },
  {
    label: "Blog",
    description: "Longer write-ups on engineering and more",
    href: "/blog",
    icon: <PenLine size={20} />,
  },
  {
    label: "Learning Log",
    description: "What I'm learning right now",
    href: "/learning",
    icon: <GraduationCap size={20} />,
  },
  {
    label: "Contact",
    description: "Get in touch",
    href: "/contact",
    icon: <Mail size={20} />,
  },
];

// A compact site map below the Hero — gives visitors (especially on mobile,
// where the nav is tucked behind a hamburger) an immediate sense of
// everything the site has, without duplicating each page's full content.
export default function SiteOverview() {
  return (
    <section id="overview" className="py-16 sm:py-20 bg-bg-secondary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 p-5 h-full border border-border-color bg-bg-card hover:border-primary-500 transition-colors duration-carbon-moderate-01 ease-carbon-productive"
            >
              <span className="p-2.5 bg-link-subtle text-link shrink-0">{item.icon}</span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 font-semibold text-text-primary group-hover:text-link transition-colors">
                  {item.label}
                  <ArrowRight
                    size={14}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </span>
                <span className="block text-sm text-text-secondary mt-1">{item.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
