"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import type { ShowcaseCategory } from "@/lib/api/types";

const Showcase: React.FC<{ categories: ShowcaseCategory[] }> = ({ categories }) => {
  return (
    <section
      id="showcase"
      className="section bg-gradient-to-b from-bg-primary to-link-subtle py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Project Showcase
          </h2>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
            A closer look at platforms I've built and shipped
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group">
              {/* Card */}
              <div className="bg-bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-border-color hover:border-primary-300 flex flex-col h-full">
                {/* Featured Project Image */}
                <div className="relative h-48 sm:h-56 bg-bg-secondary overflow-hidden">
                  {category.featuredImageUrl && (
                    <img
                      src={category.featuredImageUrl}
                      alt={category.featuredName}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category Badge */}
                  <div className="absolute bottom-1 left-2 z-10">
                    <span className="px-3 py-1 bg-neutral-800/90 backdrop-blur-sm rounded-full text-xs font-semibold text-carbon-text-on-color shadow-sm">
                      {category.title}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Featured Project */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-link transition-colors">
                      {category.featuredName}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      {category.description}
                    </p>
                    <a
                      href={category.featuredUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-link hover:text-link-hover group/link"
                    >
                      Visit Site
                      <ExternalLink
                        size={14}
                        className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                      />
                    </a>
                  </div>

                  {/* Divider & Other Projects - only show if there are other projects */}
                  {category.items.length > 0 && (
                    <>
                      <div className="border-t border-border-color my-4" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-3">
                          Other Projects
                        </p>
                        <ul className="space-y-2">
                          {category.items.map((project) => (
                            <li key={project.id}>
                              <a
                                href={project.url}
                                className="text-sm text-text-secondary hover:text-link flex items-center gap-2 group/item transition-colors"
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
                    </>
                  )}

                  {/* View All Link */}
                  {/* <div className="mt-4 pt-4 border-t border-neutral-100">
                    <a
                      href="#showcase"
                      className="text-sm font-medium text-link hover:text-link-hover flex items-center gap-1 group/all"
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
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-text-secondary mb-6">
            Interested in building your own digital platform?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Let's Talk
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
