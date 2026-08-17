"use client";

import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, FileText, TrendingUp, Calendar } from "lucide-react";
import type { Project } from "@/lib/api/types";

export default function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="section py-20 min-h-screen bg-bg-primary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-link hover:text-link-hover transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="badge-primary">{project.category}</span>
            {project.status && <span className={`status-badge ${project.status}`}>{project.status}</span>}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{project.title}</h1>

          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt=""
              className="w-full h-56 sm:h-80 object-cover rounded-xl border border-border-color mb-8"
            />
          )}

          <div className="flex items-center gap-2 text-sm text-text-tertiary mb-8">
            <Calendar size={14} />
            <span>
              {project.startDate}
              {project.endDate ? ` – ${project.endDate}` : " – Present"}
            </span>
          </div>

          <p className="text-text-secondary leading-relaxed text-base sm:text-lg mb-8">
            {project.longDescription || project.description}
          </p>

          {project.impact && (
            <div className="mb-8 p-4 rounded-lg bg-link-subtle border border-primary-300/30">
              <p className="text-sm font-semibold text-link">{project.impact}</p>
            </div>
          )}

          {project.metrics && project.metrics.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-text-primary mb-3">Impact</h2>
              <div className="space-y-2">
                {project.metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <TrendingUp size={16} className="text-carbon-support-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-carbon-support-success font-medium">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-lg font-semibold text-text-primary mb-3">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-tag text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-border-color">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-link transition-colors text-sm font-medium"
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
                className="inline-flex items-center gap-2 text-text-secondary hover:text-link transition-colors text-sm font-medium"
              >
                <ExternalLink size={16} />
                <span>Visit Site</span>
              </a>
            )}
            {project.paperUrl && (
              <a
                href={project.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-link transition-colors text-sm font-medium"
              >
                <FileText size={16} />
                <span>Paper</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
