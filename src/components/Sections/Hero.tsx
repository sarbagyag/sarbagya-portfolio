import React from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Mail,
  Github,
  Linkedin,
  FileText,
  ExternalLink,
} from "lucide-react";
import Button from "../UI/Button";
import { contactInfo } from "../../data/skills";

const Hero: React.FC = () => {
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const targetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-white via-primary-50/30 to-white px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="max-w-5xl mx-auto text-center pt-20 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-4 sm:mb-6"
        >
          Sarbagya Gho Shrestha
        </motion.h1>

        {/* Title */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <p className="text-xl sm:text-2xl md:text-3xl text-primary-600 font-semibold mb-2">
            Engineer | Innovator | Artist
          </p>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            Digital Transformation Architect • Full Stack Engineer
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          variants={itemVariants}
          className="mb-8 sm:mb-12 max-w-4xl mx-auto"
        >
          <p className="text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed italic">
            Empowering Nepal's digital transformation through innovative
            governance solutions. Architecting the future of public
            administration with precision and purpose.
          </p>
        </motion.div>

        {/* Education Highlight */}
        <motion.div
          variants={itemVariants}
          className="mb-8 sm:mb-12 inline-block"
        >
          <div className="px-4 sm:px-6 py-3 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <p className="text-sm sm:text-base text-text-secondary">
              <span className="font-semibold text-text-primary">
                B.E. Electronics & Communication
              </span>
              {" • "}IOE, Pulchowk Campus {" • "} Class of 2025
            </p>
          </div>
        </motion.div>

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
              link.href = "/resume/sarbagya-resume.pdf";
              link.download = "sarbagya-resume.pdf";
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
            onClick={() => scrollToSection("projects")}
            className="w-full sm:w-auto"
          >
            View Projects
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToSection("contact")}
            className="w-full sm:w-auto"
          >
            Get in Touch
          </Button>
        </motion.div>

        {/* Impact Highlights */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-4xl mx-auto"
        >
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">
              100+
            </div>
            <div className="text-sm sm:text-base text-text-secondary font-medium">
              Government Sites
            </div>
            <div className="text-xs sm:text-sm text-text-tertiary mt-1">
              ICMS Platform Live
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">
              50+
            </div>
            <div className="text-sm sm:text-base text-text-secondary font-medium">
              Municipalities
            </div>
            <div className="text-xs sm:text-sm text-text-tertiary mt-1">
              Digital e-Palika
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">
              100K+
            </div>
            <div className="text-sm sm:text-base text-text-secondary font-medium">
              Instagram Views
            </div>
            <div className="text-xs sm:text-sm text-text-tertiary mt-1">
              Music Artist
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center gap-4 sm:gap-6 mb-12"
        >
          <a
            href={`mailto:${contactInfo.email}`}
            className="p-3 bg-white rounded-full border border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all hover:scale-110 hover:shadow-md"
            aria-label="Email"
          >
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary hover:text-primary-600" />
          </a>
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full border border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all hover:scale-110 hover:shadow-md"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary hover:text-primary-600" />
          </a>
          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full border border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all hover:scale-110 hover:shadow-md"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary hover:text-primary-600" />
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.button
            onClick={() => scrollToSection("projects")}
            className="flex flex-col items-center gap-2 text-text-tertiary hover:text-primary-600 transition-colors group"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-label="Scroll to projects section"
          >
            <span className="text-xs sm:text-sm font-medium group-hover:text-primary-600 transition-colors">
              Explore My Work
            </span>
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-accent-200/30 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Hero;
