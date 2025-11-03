import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";

interface Project {
  name: string;
  url: string;
}

interface ShowcaseCategory {
  title: string;
  description: string;
  featured: {
    name: string;
    url: string;
    image: string;
  };
  otherProjects: Project[];
}

const Showcase: React.FC = () => {
  const categories: ShowcaseCategory[] = [
    {
      title: "Digital Profiles",
      description: "Modern digital governance platforms for municipalities",
      featured: {
        name: "Pokhara Metropolitan City",
        url: "https://pokhara.digprofile.com",
        image: "/pokhara-digprofile.png",
      },
      otherProjects: [
        {
          name: "Buddhashanti Digital Profile",
          url: "https://digital.buddhashantimun.gov.np",
        },
        {
          name: "Kerabari Digital Profile",
          url: "https://digital.kerabarimun.gov.np",
        },
        {
          name: "Lungri Digital Profile",
          url: "https://digital.lungrimun.gov.np",
        },
        {
          name: "Pariwartan Digital Profile",
          url: "https://digital.pariwartanmun.gov.np",
        },
        {
          name: "Khajura Digital Profile",
          url: "https://digital.khajuramun.gov.np",
        },
        {
          name: "Gadhawa Digital Profile",
          url: "https://gadhawa.digprofile.com",
        },
        {
          name: "Duduwa Digital Profile",
          url: "https://digital.duduwa.gov.np",
        },
      ],
    },
    {
      title: "iCMS",
      description: "Integrated Content Management Systems for government",
      featured: {
        name: "SDDO Dang",
        url: "https://sddodang.lumbini.gov.np",
        image: "/icms-main.png",
      },
      otherProjects: [
        {
          name: "SDO Dolpa - Karnali",
          url: "https://icms.sdodolpa.karnali.easypalika.com",
        },
        {
          name: "MoLMAC - Gandaki Province (pending launch)",
          url: "https://molmac.gandaki.gov.np",
        },
        {
          name: "DFO Bardiya (pending launch)",
          url: "https://dfobardiya.gov.np",
        },
        {
          name: "Hospital Banke - Lumbini (pending launch)",
          url: "https://hobanke.lumbini.gov.np",
        },
        {
          name: "IAL - Karnali Province (pending launch)",
          url: "https://ial.karnali.gov.np",
        },
        {
          name: "PBIP - DWRI (pending launch)",
          url: "https://pbip.dwri.gov.np",
        },
        {
          name: "SDDO Rupandehi (pending launch)",
          url: "https://sddorupandehi.lumbini.gov.np",
        },
      ],
    },
    {
      title: "SMS",
      description: "Survey Management Systems for data collection and analysis",
      featured: {
        name: "Buddhashanti Admin",
        url: "#",
        image: "/buddhashanti.png",
      },
      otherProjects: [
        { name: "Kerabari Admin", url: "https://kerabari-admin.vercel.app" },
        {
          name: "Gadhawa Admin",
          url: "https://gadhawa-admin-eq6q.vercel.app/",
        },
        { name: "Lungri Admin", url: "https://lungri-admin.vercel.app" },
        { name: "Duduwa Admin", url: "https://duduwa-admin.vercel.app" },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section
      id="showcase"
      className="section bg-gradient-to-b from-white to-primary-50/20 py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Project Showcase
          </h2>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
            Transforming Nepal's digital infrastructure, one platform at a time
          </p>
        </motion.div>

        {/* Showcase Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              className="group"
            >
              {/* Card */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral-200 hover:border-primary-300 flex flex-col h-full">
                {/* Featured Project Image */}
                <div className="relative h-48 sm:h-56 bg-gradient-to-br from-primary-100 to-accent-100 overflow-hidden">
                  <img
                    src={category.featured.image}
                    alt={category.featured.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category Badge */}
                  <div className="absolute bottom-1 left-2 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-600 shadow-sm">
                      {category.title}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Featured Project */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary-600 transition-colors">
                      {category.featured.name}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      {category.description}
                    </p>
                    <a
                      href={category.featured.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 group/link"
                    >
                      Visit Site
                      <ExternalLink
                        size={14}
                        className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                      />
                    </a>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-200 my-4" />

                  {/* Other Projects */}
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-3">
                      Other Projects
                    </p>
                    <ul className="space-y-2">
                      {category.otherProjects.map((project, idx) => (
                        <li key={idx}>
                          <a
                            href={project.url}
                            className="text-sm text-text-secondary hover:text-primary-600 flex items-center gap-2 group/item transition-colors"
                          >
                            <ArrowRight
                              size={14}
                              className="text-primary-400 opacity-0 group-hover/item:opacity-100 -ml-5 group-hover/item:ml-0 transition-all"
                            />
                            <span className="group-hover/item:translate-x-1 transition-transform">
                              {project.name}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* View All Link */}
                  {/* <div className="mt-4 pt-4 border-t border-neutral-100">
                    <a
                      href="#showcase"
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 group/all"
                    >
                      View All {category.title}
                      <ArrowRight
                        size={14}
                        className="group-hover/all:translate-x-1 transition-transform"
                      />
                    </a>
                  </div> */}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-text-secondary mb-6">
            Interested in building your own digital platform?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Let's Talk
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Showcase;
