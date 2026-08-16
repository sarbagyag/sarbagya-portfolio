"use client";

import React from "react";
import { Calendar, MapPin, ExternalLink, Award } from "lucide-react";
import Card from "../UI/Card";
import type { experience as experienceTable, experienceSubRoles as experienceSubRolesTable } from "@/db/schema";

type ExperienceEntry = typeof experienceTable.$inferSelect & {
  subRoles: (typeof experienceSubRolesTable.$inferSelect)[];
};

const getExperienceDuration = (exp: { startDate: string; endDate: string | null }): string => {
  const start = new Date(exp.startDate);
  const end = exp.endDate ? new Date(exp.endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));

  if (diffMonths < 1) return "< 1 month";
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;

  const years = Math.floor(diffMonths / 12);
  const remainingMonths = diffMonths % 12;
  return remainingMonths === 0
    ? `${years} year${years > 1 ? "s" : ""}`
    : `${years} yr${years > 1 ? "s" : ""} ${remainingMonths} mo`;
};

const Experience: React.FC<{ experience: ExperienceEntry[] }> = ({ experience }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section id="experience" className="section py-20 bg-bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Motivation and work history
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 hidden md:block" />

          {/* Experience Items */}
          <div className="space-y-12">
            {experience.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-bg-primary shadow-md hidden md:block transform -translate-x-1/2" />

                {/* Content */}
                <div className="flex-1 md:w-1/2">
                  <Card
                    className={`p-6 ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"}`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`status-badge ${exp.type}`}>
                          {exp.type}
                        </span>
                      </div>
                      <div className="text-right text-sm text-text-tertiary">
                        <div className="flex items-center gap-1 justify-end">
                          <Calendar size={14} />
                          <span>
                            {formatDate(exp.startDate)} -{" "}
                            {exp.endDate ? formatDate(exp.endDate) : "Present"}
                          </span>
                        </div>
                        <div className="text-xs mt-1">
                          {getExperienceDuration(exp)}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-link font-semibold mb-2">
                      <Award size={16} />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-4">
                      <MapPin size={14} />
                      <span>{exp.location}</span>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-text-primary text-sm mb-2">
                          Key Achievements
                        </h4>
                        <ul className="space-y-1">
                          {exp.achievements.map((achievement, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-text-secondary"
                            >
                              <span className="text-accent-600 mt-1">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    <div>
                      <h4 className="font-semibold text-text-primary text-sm mb-2">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.slice(0, 6).map((tech) => (
                          <span key={tech} className="tech-tag text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sub-roles */}
                    {exp.subRoles && exp.subRoles.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border-color space-y-4">
                        {exp.subRoles.map((role, roleIdx) => (
                          <div key={roleIdx} className="pl-4 border-l-2 border-primary-200">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-sm text-text-primary">
                                {role.company}
                              </span>
                              <span className="text-xs text-text-tertiary flex items-center gap-1">
                                <Calendar size={11} />
                                {formatDate(role.startDate)} –{" "}
                                {role.endDate ? formatDate(role.endDate) : "Present"}
                              </span>
                            </div>
                            <div className="text-xs italic text-text-secondary mb-2">
                              {role.title}
                            </div>
                            <ul className="space-y-1">
                              {role.responsibilities.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                  <span className="text-primary-400 mt-1">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {role.technologies.map((tech) => (
                                <span key={tech} className="tech-tag text-xs">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {exp.companyUrl && (
                      <div className="mt-4 pt-4 border-t border-border-color">
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-link hover:text-link-hover font-medium"
                        >
                          <span>Visit Organization</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
