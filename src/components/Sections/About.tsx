import React from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Languages } from "lucide-react";
import Card from "../UI/Card";
import {
  skills,
  education,
  certifications,
  languages,
  researchInterests,
} from "../../data/skills";

const About: React.FC = () => {
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
      id="about"
      className="section py-20 bg-neutral-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={itemVariants as any}>
          <h2 className="section-title text-center">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Academic background, skills, and qualifications
          </p>
        </motion.div>

        {/* Education */}
        <motion.div variants={itemVariants} className="mb-16">
          <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <BookOpen className="text-primary-600" />
            Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <Card key={edu.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-primary-600">
                    {edu.degree}
                  </h4>
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
        </motion.div>

        {/* Skills */}
        <motion.div variants={itemVariants} className="mb-16">
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
        </motion.div>

        {/* Certifications & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Certifications */}
          <motion.div variants={itemVariants}>
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
          </motion.div>

          {/* Languages */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <Languages className="text-primary-600" />
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
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;