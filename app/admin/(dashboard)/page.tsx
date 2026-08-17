import Link from "next/link";
import { Briefcase, FolderGit2, Rocket, FileEdit, Mail } from "lucide-react";
import { getExperience, getProjects, getShowcaseCategories, getAllPosts, getUnreadMessageCount } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [experience, projects, showcase, posts, unread] = await Promise.all([
    getExperience(),
    getProjects(),
    getShowcaseCategories(),
    getAllPosts(),
    getUnreadMessageCount(),
  ]);

  const stats = [
    { label: "Experience entries", value: experience.length, href: "/admin/experience", icon: Briefcase },
    { label: "Projects", value: projects.length, href: "/admin/projects", icon: FolderGit2 },
    { label: "Showcase categories", value: showcase.length, href: "/admin/showcase", icon: Rocket },
    { label: "Posts", value: posts.length, href: "/admin/posts", icon: FileEdit },
    { label: "Unread messages", value: unread, href: "/admin/messages", icon: Mail },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="p-5 rounded-xl border border-border-color bg-bg-card hover:border-primary-400 transition-colors"
            >
              <Icon size={18} className="text-link mb-3" />
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
