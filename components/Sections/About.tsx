"use client";

import React from "react";
import { BookOpen, Languages } from "lucide-react";
import Card from "../UI/Card";
import type { Education, Skill } from "@/lib/api/types";
type Language = { name: string; level: string };

interface AboutProps {
  education: Education[];
  skills: Skill[];
  languages: Language[];
}

const About: React.FC<AboutProps> = ({ education, skills, languages }) => {
  return (
    <section id="about" className="section py-20 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Academic background, skills, and qualifications
          </p>
        </div>

        {/* Education */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <BookOpen className="text-link" />
            Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <Card key={edu.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-link">{edu.degree}</h4>
                  <span className="text-lg font-bold text-accent-600">
                    {edu.gpa}
                  </span>
                </div>
                <p className="text-text-secondary font-medium mb-2">
                  {edu.field}
                </p>
                <p className="text-text-secondary text-sm mb-2">
                  {edu.institution}
                </p>
                <p className="text-text-tertiary text-xs">
                  {edu.startDate} - {edu.endDate}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <Languages className="text-link" />
            Languages
          </h3>
          <Card className="p-6">
            <div className="space-y-3">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className="flex justify-between items-center"
                >
                  <span className="font-medium text-text-primary">
                    {lang.name}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Skills */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-text-primary mb-6">
            Technical Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skillCategory) => (
              <Card key={skillCategory.category} className="p-6">
                <h4 className="font-bold text-text-primary mb-3">
                  {skillCategory.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillCategory.skills.map((skill) => (
                    <span key={skill} className="tech-tag text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Certifications */}
          {/* <div>
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <Award className="text-accent-600" />
              Certifications
            </h3>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <Card key={cert.id} className="p-4">
                  <h4 className="font-bold text-text-primary mb-1">
                    {cert.name}
                  </h4>
                  <p className="text-sm text-text-secondary mb-1">
                    {cert.issuer}
                  </p>
                  <p className="text-xs text-text-tertiary">{cert.date}</p>
                </Card>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default About;
