import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ExternalLink, Award } from "lucide-react";
import Card from "../UI/Card";
import { experience, getExperienceDuration } from "../../data/experience";

const Experience: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <motion.section
      id="experience"
      className="section py-20 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={itemVariants as any}>
          <h2 className="section-title text-center">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Research positions and technical roles
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 hidden md:block" />

          {/* Experience Items */}
          <div className="space-y-12">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className={`relative flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-md hidden md:block transform -translate-x-1/2" />

                {/* Content */}
                <div className="flex-1 md:w-1/2">
                  <Card className={`p-6 ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"}`}>
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
                            {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
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
                    <div className="flex items-center gap-2 text-primary-600 font-semibold mb-2">
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
                            <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
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

                    {exp.companyUrl && (
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <span>Visit Organization</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Experience;