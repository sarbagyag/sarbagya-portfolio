"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import Card from "@/components/UI/Card";
import type { Post } from "@/lib/api/types";

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
  return (
    <section className="section py-20 min-h-svh bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="section-title text-center">{title}</h1>
          <p className="section-subtitle mt-4 mx-auto">{subtitle}</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-text-secondary">{emptyMessage}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`${basePath}/${post.slug}`} className="h-full">
                <Card className="h-full flex flex-col group">
                  {post.coverImageUrl && (
                    <img
                      src={post.coverImageUrl}
                      alt=""
                      className="w-full h-40 object-contain bg-bg-secondary rounded-t-xl"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-text-tertiary mb-3">
                      <Calendar size={14} />
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      )}
                    </div>

                    <div className="mb-4 flex-grow">
                      <h2 className="text-xl font-bold text-text-primary mb-3 group-hover:text-link transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-text-secondary text-sm leading-relaxed">{post.excerpt}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="tech-tag text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center pt-4 border-t border-border-color">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-link group-hover:gap-2 transition-all">
                        Read
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
