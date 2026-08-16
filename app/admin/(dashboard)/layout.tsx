"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  FileEdit,
  Mail,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { signOut } from "@/app/admin/actions";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Profile", href: "/admin/profile", icon: User },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Skills", href: "/admin/skills", icon: Wrench },
  { label: "Posts", href: "/admin/posts", icon: FileEdit },
  { label: "Messages", href: "/admin/messages", icon: Mail },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href));

  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary font-sans">
      <aside className="w-64 shrink-0 border-r border-border-color bg-bg-card flex flex-col">
        <div className="p-5 border-b border-border-color">
          <p className="font-bold text-text-primary">Admin</p>
          <Link
            href="/"
            className="text-xs text-text-tertiary hover:text-link flex items-center gap-1 mt-1 transition-colors"
          >
            View site <ExternalLink size={11} />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-link-subtle text-link"
                    : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action={signOut} className="p-3 border-t border-border-color">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-secondary hover:text-carbon-support-error transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
