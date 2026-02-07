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
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-white via-primary-50/30 to-white px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <motion.div
        className="max-w-5xl mx-auto text-center pt-20 pb-16 relative z-10"
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
            {/* Animated gradient border */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full opacity-75 blur-md"
              animate={{
                opacity: [0.75, 1, 0.75],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Pulsing ring */}
            <motion.div
              className="absolute -inset-2 border-2 border-primary-300/30 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative">
              <img
                src="/sarbagya-pokhara-2.jpg"
                alt="Sarbagya Gho Shrestha"
                className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-2xl ring-2 ring-primary-100 transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold font-cormorant text-text-primary mb-4 sm:mb-6"
        >
          Sarbagya Gho Shrestha
        </motion.h2>

        {/* Title */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <p className="text-xl sm:text-2xl md:text-3xl text-primary-600 font-semibold mb-2">
            Engineer | Innovator | Artist
          </p>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            Full Stack • AI/ML • Embedded Systems • Edge AI • Music Producer
          </p>
          <p className="text-sm sm:text-base md:text-lg text-text-tertiary mt-2 italic">
            Building things that work and sounds that connect.
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
                B.E. Electronics, Communication & Information 
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
              link.href = "/resume/sarbagya-updated-resume.pdf";
              link.download = "sarbagya-updated-resume.pdf";
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
          <motion.div
            className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
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
            className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
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
            className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
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
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center gap-4 sm:gap-6 mb-12"
        >
          <motion.a
            href={`mailto:${contactInfo.email}`}
            className="p-3 bg-white rounded-full border border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all shadow-sm hover:shadow-md group"
            aria-label="Email"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-primary-600 transition-colors" />
          </motion.a>
          <motion.a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full border border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all shadow-sm hover:shadow-md group"
            aria-label="GitHub"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-primary-600 transition-colors" />
          </motion.a>
          <motion.a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full border border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all shadow-sm hover:shadow-md group"
            aria-label="LinkedIn"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-primary-600 transition-colors" />
          </motion.a>
          <motion.a
            href="https://www.youtube.com/@Sarbagya42"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full border border-neutral-200 hover:border-red-500 hover:bg-red-50 transition-all shadow-sm hover:shadow-md group"
            aria-label="YouTube"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-red-600 transition-colors" />
          </motion.a>
          <motion.a
            href="https://www.instagram.com/sarbu.wav"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full border border-neutral-200 hover:border-pink-500 hover:bg-pink-50 transition-all shadow-sm hover:shadow-md group"
            aria-label="Instagram"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-pink-600 transition-colors" />
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.button
            onClick={() => scrollToSection("showcase")}
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
