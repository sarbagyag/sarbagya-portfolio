"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Mail,
  Github,
  Linkedin,
  FileText,
  Youtube,
  Instagram,
} from "lucide-react";
import Button from "../UI/Button";
import type { Profile } from "@/lib/api/types";

const Hero: React.FC<{ profile: Profile }> = ({ profile }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section
      id="home"
      className="min-h-dvh flex items-center justify-center relative bg-gradient-to-b from-bg-dark via-link-subtle to-bg-dark px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <motion.div
        className="max-w-5xl mx-auto text-center pt-32 sm:pt-36 pb-16 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Image */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex justify-center"
        >
          <div className="relative group">
            {/* Gradient border — static now (was a continuous blur+opacity
                loop, one of the more expensive animation patterns on
                mobile; not essential, so it's gone rather than throttled) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full opacity-75 blur-md" />
            <div className="relative">
              <img
                src={profile.avatarUrl || "/sarbagya-hero.jpg"}
                alt={profile.name}
                className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-bg-primary shadow-2xl ring-2 ring-primary-200/60 transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 sm:mb-6"
        >
          {profile.name}
        </motion.h2>

        {/* Title */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <p className="text-xl sm:text-2xl md:text-3xl text-link font-semibold mb-2">
            {profile.tagline}
          </p>
          {profile.heroRoles.length > 0 && (
            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
              {profile.heroRoles.join(" • ")}
            </p>
          )}
          {profile.heroMotto && (
            <p className="text-sm sm:text-base md:text-lg text-text-tertiary mt-2 italic">
              {profile.heroMotto}
            </p>
          )}
        </motion.div>

        {/* Education Highlight */}
        {profile.heroBadge && (
          <motion.div
            variants={itemVariants}
            className="mb-8 sm:mb-12 inline-block"
          >
            <div className="px-4 sm:px-6 py-3 bg-bg-card rounded-xl border border-border-color shadow-sm">
              <p className="text-sm sm:text-base text-text-secondary">{profile.heroBadge}</p>
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              const link = document.createElement("a");
              link.href = profile.resumeUrl || "/resume/sarbagya-updated-resume.pdf";
              link.download = "";
              link.click();
            }}
            icon={<FileText size={20} />}
            className="w-full sm:w-auto"
          >
            Download CV
          </Button>

          <Button
            variant="secondary"
            size="lg"
            href="/projects"
            className="w-full sm:w-auto"
          >
            View Projects
          </Button>
          <Button
            variant="outline"
            size="lg"
            href="/contact"
            className="w-full sm:w-auto"
          >
            Get in Touch
          </Button>
        </motion.div>

        {/* Impact Highlights
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-4xl mx-auto"
        >
          <motion.div
            className="bg-bg-card p-4 sm:p-6 rounded-xl border border-border-color shadow-sm hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
            whileHover={{ y: -4 }}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">
              100+
            </div>
            <div className="text-sm sm:text-base text-text-secondary font-medium">
              Government Sites
            </div>
            <div className="text-xs sm:text-sm text-text-tertiary mt-1 group-hover:text-primary-500 transition-colors">
              ICMS Platform Live
            </div>
          </motion.div>
          <motion.div
            className="bg-bg-card p-4 sm:p-6 rounded-xl border border-border-color shadow-sm hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
            whileHover={{ y: -4 }}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-2">
              50+
            </div>
            <div className="text-sm sm:text-base text-text-secondary font-medium">
              Municipalities
            </div>
            <div className="text-xs sm:text-sm text-text-tertiary mt-1 group-hover:text-primary-500 transition-colors">
              Digital e-Palika
            </div>
          </motion.div>
          <motion.div
            className="bg-bg-card p-4 sm:p-6 rounded-xl border border-border-color shadow-sm hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
            whileHover={{ y: -4 }}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-600 to-accent-400 bg-clip-text text-transparent mb-2">
              100K+
            </div>
            <div className="text-sm sm:text-base text-text-secondary font-medium">
              Instagram Views
            </div>
            <div className="text-xs sm:text-sm text-text-tertiary mt-1 group-hover:text-accent-500 transition-colors">
              Music Artist
            </div>
          </motion.div>
        </motion.div> */}

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center gap-4 sm:gap-6 mb-12"
        >
          <motion.a
            href={`mailto:${profile.email}`}
            className="p-3 bg-bg-card rounded-full border border-border-color hover:border-primary-500 hover:bg-link-subtle transition-all shadow-sm hover:shadow-md group"
            aria-label="Email"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-link transition-colors" />
          </motion.a>
          {profile.githubUrl && (
            <motion.a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-bg-card rounded-full border border-border-color hover:border-primary-500 hover:bg-link-subtle transition-all shadow-sm hover:shadow-md group"
              aria-label="GitHub"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-link transition-colors" />
            </motion.a>
          )}
          {profile.linkedinUrl && (
            <motion.a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-bg-card rounded-full border border-border-color hover:border-primary-500 hover:bg-link-subtle transition-all shadow-sm hover:shadow-md group"
              aria-label="LinkedIn"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-link transition-colors" />
            </motion.a>
          )}
          {profile.youtubeUrl && (
            <motion.a
              href={profile.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-bg-card rounded-full border border-border-color hover:border-red-500 hover:bg-red-950/40 transition-all shadow-sm hover:shadow-md group"
              aria-label="YouTube"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-red-600 transition-colors" />
            </motion.a>
          )}
          {profile.instagramUrl && (
            <motion.a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-bg-card rounded-full border border-border-color hover:border-pink-500 hover:bg-pink-950/40 transition-all shadow-sm hover:shadow-md group"
              aria-label="Instagram"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-pink-600 transition-colors" />
            </motion.a>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <a
              href="#overview"
              className="flex flex-col items-center gap-2 text-text-tertiary hover:text-link transition-colors group"
            >
              <span className="text-xs sm:text-sm font-medium group-hover:text-link transition-colors">
                Explore the Site
              </span>
              <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-accent-200/30 rounded-full blur-3xl" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #0ea5e9 1px, transparent 1px),
              linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
