import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, TrendingUp } from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { projects, getFeaturedProjects } from "../../data/projects";

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "featured">("featured");

  const displayProjects =
    filter === "featured" ? getFeaturedProjects() : projects;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      id="projects"
      className="section py-20 bg-neutral-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={itemVariants as any}
        >
          <h2 className="section-title text-center">
            Technical <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Problem solving through code. Here are some of my notable projects.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setFilter("featured")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "featured"
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-text-secondary border border-neutral-200 hover:border-primary-600"
            }`}
          >
            Featured ({getFeaturedProjects().length})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "all"
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-text-secondary border border-neutral-200 hover:border-primary-600"
            }`}
          >
            All Projects ({projects.length})
          </button>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className="badge-primary">{project.category}</span>
                  {project.status && (
                    <span className={`status-badge ${project.status}`}>
                      {project.status}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-grow">
                  {project.description}
                </p>

                {/* Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {project.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <TrendingUp
                          size={16}
                          className="text-accent-600 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-sm text-accent-700 font-medium">
                          {metric}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="tech-tag text-xs">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="tech-tag text-xs">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors text-sm font-medium"
                    >
                      <Github size={16} />
                      <span>Code</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors text-sm font-medium"
                    >
                      <ExternalLink size={16} />
                      <span>View Here</span>
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center mt-16">
          <p className="text-text-secondary mb-6">
            View more projects on my GitHub
          </p>
          <Button
            href="https://github.com/fernsky"
            variant="secondary"
            size="lg"
            external
            icon={<Github size={20} />}
          >
            Visit GitHub
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Projects;
