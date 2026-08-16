"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import Card from "@/components/UI/Card";
import type { posts as postsTable } from "@/db/schema";

type Post = typeof postsTable.$inferSelect;

interface PostListProps {
  posts: Post[];
  basePath: "/blog" | "/learning";
  title: ReactNode;
  subtitle: string;
  emptyMessage: string;
}

// Shared list view for both /blog and /learning — same `posts` content
// type under the hood (see db/schema.ts postTypeEnum), just filtered and
// labeled differently per section.
export default function PostList({ posts, basePath, title, subtitle, emptyMessage }: PostListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="section py-20 min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <h1 className="section-title text-center">{title}</h1>
          <p className="section-subtitle mt-4 mx-auto">{subtitle}</p>
        </motion.div>

        {posts.length === 0 ? (
          <p className="text-center text-text-secondary">{emptyMessage}</p>
        ) : (
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {posts.map((post) => (
              <motion.div key={post.slug} variants={itemVariants}>
                <Link href={`${basePath}/${post.slug}`}>
                  <Card className="p-6 sm:p-8 group">
                    {post.coverImageUrl && (
                      <img
                        src={post.coverImageUrl}
                        alt=""
                        className="-mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] h-48 sm:h-56 object-cover rounded-t-xl"
                      />
                    )}
                    <div className="flex items-center gap-2 text-xs text-text-tertiary mb-3">
                      <Calendar size={14} />
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt.toISOString()}>
                          {post.publishedAt.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 group-hover:text-link transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="tech-tag text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-link group-hover:gap-2 transition-all shrink-0 ml-4">
                        Read
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
