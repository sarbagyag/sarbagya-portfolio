"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Github, ExternalLink, TrendingUp, ArrowUpRight } from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import type { Project } from "@/lib/api/types";

const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [filter, setFilter] = useState<"all" | "featured">("featured");

  const featuredProjects = projects.filter((p) => p.featured);
  const displayProjects = filter === "featured" ? featuredProjects : projects;

  return (
    <section id="projects" className="section py-20 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center">
            Technical <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Problem solving through code. Here are some of my notable projects.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter("featured")}
            className={`px-6 py-3 font-semibold transition-colors ${
              filter === "featured"
                ? "bg-primary-500 text-white"
                : "bg-bg-card text-text-secondary border border-border-color hover:border-primary-500"
            }`}
          >
            Featured ({featuredProjects.length})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 font-semibold transition-colors ${
              filter === "all"
                ? "bg-primary-500 text-white"
                : "bg-bg-card text-text-secondary border border-border-color hover:border-primary-500"
            }`}
          >
            All Projects ({projects.length})
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <Card key={project.id} className="p-6 h-full flex flex-col">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt=""
                    className="-mx-6 -mt-6 mb-4 w-[calc(100%+3rem)] h-40 object-cover rounded-t-xl"
                  />
                )}
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
                  <Link href={`/projects/${project.id}`} className="hover:text-link transition-colors">
                    {project.title}
                  </Link>
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
                        <span className="text-sm text-carbon-support-success font-medium">
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
                <div className="flex gap-3 pt-4 border-t border-border-color">
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-2 text-link hover:text-link-hover transition-colors text-sm font-medium"
                  >
                    <ArrowUpRight size={16} />
                    <span>Details</span>
                  </Link>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-text-secondary hover:text-link transition-colors text-sm font-medium"
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
                      className="flex items-center gap-2 text-text-secondary hover:text-link transition-colors text-sm font-medium"
                    >
                      <ExternalLink size={16} />
                      <span>View Here</span>
                    </a>
                  )}
                </div>
              </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-text-secondary mb-6">
            View more projects on my GitHub
          </p>
          <Button
            href="https://github.com/sarbagyag"
            variant="secondary"
            size="lg"
            external
            icon={<Github size={20} />}
          >
            Visit GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
