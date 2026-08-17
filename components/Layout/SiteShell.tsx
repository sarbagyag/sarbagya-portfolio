"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Layout/Navigation";
import BinaryRain from "@/components/Effects/BinaryRain";

// Shared chrome for every *public* page: background effect, nav, footer.
// Lives in app/layout.tsx so each route only has to render its own page
// content. The /admin panel has its own layout/chrome (app/admin/**) and
// deliberately skips all of this — no Matrix-rain sidebar for a CMS.
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="bg-bg-dark text-text-primary min-h-svh font-mono overflow-x-hidden">
      <BinaryRain opacity={0.08} />
      <Navigation />

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 border-t border-border-color bg-bg-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-text-secondary text-sm">© 2026 Sarbagya Gho Shrestha.</p>
            <p className="text-text-tertiary text-xs mt-1">Design inspired by the IBM Carbon Design System.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
