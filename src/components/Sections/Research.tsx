import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Users, Award, TrendingUp, FileText, Calendar } from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { research, advisors, researchInterests } from "../../data/research";

const Research: React.FC = () => {
  const [selectedResearch, setSelectedResearch] = useState<string | null>(null);

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
      transition: { duration: 0.5},
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
      id="research"
      className="section py-20 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div className="text-center mb-16" variants={itemVariants as any}>
          <h2 className="section-title text-center">
            Research <span className="gradient-text">Experience</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Collaborative research in machine learning and next-generation network systems
            with international institutions
          </p>
        </motion.div>

        {/* Research Projects */}
        <div className="space-y-8 mb-20">
          {research.map((item, index) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card variant="research" className="p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Award className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                      <div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                          {item.title}
                        </h3>
                        <p className="text-base text-primary-600 font-semibold">
                          {item.institution}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`status-badge ${item.status}`}>
                      {item.status}
                    </span>
                    {item.paperStatus && (
                      <span className="status-badge under-review">
                        {item.paperStatus}
                      </span>
                    )}
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                      <Calendar size={14} />
                      <span>
                        {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : "Present"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Advisors/Supervisors */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-primary-600" size={18} />
                    <h4 className="font-semibold text-text-primary">Research Advisors</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {item.supervisor.map((sup, idx) => {
                      const advisor = advisors.find((a) => sup.includes(a.name));
                      return (
                        <a
                          key={idx}
                          href={advisor?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                          <span className="font-medium">{sup}</span>
                          <ExternalLink size={14} />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Key Contributions */}
                <div className="mb-6">
                  <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <TrendingUp className="text-accent-600" size={18} />
                    Key Contributions
                  </h4>
                  <ul className="space-y-2">
                    {item.contributions.map((contribution, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-text-secondary">
                        <span className="text-primary-600 font-bold mt-1 flex-shrink-0">→</span>
                        <span>{contribution}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics */}
                {item.metrics && item.metrics.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-text-primary mb-3">Research Impact</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {item.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-3 bg-accent-50 rounded-lg border border-accent-200"
                        >
                          <p className="text-sm font-semibold text-accent-800">{metric}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="font-semibold text-text-primary mb-3 text-sm">
                    Technologies & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Collaborators */}
                {item.collaborators && (
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-sm text-text-tertiary">
                      <span className="font-medium text-text-secondary">Collaborators:</span>{" "}
                      {item.collaborators.join(" • ")}
                    </p>
                  </div>
                )}

                {/* Paper Link */}
                {item.venue && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-2 text-sm text-primary-600 font-medium">
                      <FileText size={16} />
                      <span>{item.venue}</span>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Research Interests */}
        <motion.div variants={itemVariants} className="mb-20">
          <h3 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Research Interests
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchInterests.map((interest) => (
              <Card key={interest.id} className="p-6">
                <h4 className="text-xl font-bold text-primary-600 mb-3">
                  {interest.title}
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {interest.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {interest.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="badge-primary text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Research Stats */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
            <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
              Research Impact Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="metric-card bg-white">
                <div className="metric-value">{research.length}</div>
                <div className="metric-label">Research Projects</div>
              </div>
              <div className="metric-card bg-white">
                <div className="metric-value">2</div>
                <div className="metric-label">International Collaborations</div>
              </div>
              <div className="metric-card bg-white">
                <div className="metric-value">1</div>
                <div className="metric-label">Paper Under Review</div>
              </div>
              <div className="metric-card bg-white">
                <div className="metric-value">3</div>
                <div className="metric-label">Research Advisors</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center mt-16">
          <p className="text-text-secondary mb-6">
            Interested in my research or potential collaboration?
          </p>
          <Button
            href="#contact"
            variant="primary"
            size="lg"
          >
            Get in Touch
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Research;