import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./components/Layout/Navigation";
import Projects from "./components/Sections/Projects";
import Experience from "./components/Sections/Experience";
import About from "./components/Sections/About";
import Contact from "./components/Sections/Contact";
import Hero from "./components/Sections/Hero";
import Showcase from "./components/Sections/Showcase";
import BinaryRain from "./components/Effects/BinaryRain";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App bg-bg-dark text-text-primary min-h-screen font-mono overflow-x-hidden">
      {/* Background Effects */}
      <BinaryRain opacity={0.08} />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Hero />
            <Showcase />
            {/* <Research /> */}
            <Projects />
            <Experience />
            <About />
            <Contact />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-color bg-bg-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              © 2026 Sarbagya Gho Shrestha.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
