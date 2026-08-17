"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface NavItem {
  label: string;
  href: string;
}

// Ordered as a narrative rather than build order: who I am, what I've done
// professionally, what I've built, where it lives, what I write/learn, then
// how to reach me. "Home" isn't listed separately — the logo already links
// there, and repeating it as a nav item was redundant.
const navItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Showcase", href: "/showcase" },
  { label: "Blog", href: "/blog" },
  { label: "Learning", href: "/learning" },
  { label: "Contact", href: "/contact" },
];

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // rAF-throttled and with hysteresis (different on/off thresholds) —
    // an unthrottled 1:1 scroll->setState listener re-renders on nearly
    // every scroll event (mobile fires far more of these than desktop
    // during momentum scrolling), and a single threshold flickers the
    // backdrop-blur background on/off as scrollY oscillates around it
    // during iOS's rubber-band bounce at the top of the page.
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled((prev) => (prev ? window.scrollY > 4 : window.scrollY > 20));
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close the mobile menu on route change.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-bg-dark/95 backdrop-blur-md shadow-md border-b border-border-color"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 font-poppins text-2xl md:text-3xl font-extrabold text-link hover:text-link-hover transition-colors"
              aria-label="Home"
            >
              sgs.
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-lg whitespace-nowrap ${
                    isActive(item.href)
                      ? "text-link"
                      : "text-text-secondary hover:text-link hover:bg-link-subtle"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-600 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
              <a
                href="/resume/sarbagya-updated-resume.pdf"
                download="sarbagya-updated-resume.pdf"
                className="ml-3 inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg shrink-0"
              >
                <FileText size={16} />
                CV
              </a>
              <ThemeToggle className="ml-2" />
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center gap-1">
              <ThemeToggle />
              <motion.button
                className="p-2 text-text-primary hover:text-link transition-colors rounded-lg hover:bg-link-subtle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="xl:hidden bg-bg-card border-t border-border-color"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "text-link bg-link-subtle"
                        : "text-text-secondary hover:text-link hover:bg-link-subtle"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href="/resume/sarbagya-updated-resume.pdf"
                  download="sarbagya-updated-resume.pdf"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FileText size={18} />
                  Download CV
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ top: "5rem" }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
