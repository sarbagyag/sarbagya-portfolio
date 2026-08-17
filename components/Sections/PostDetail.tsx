"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Post } from "@/lib/api/types";

interface PostDetailProps {
  post: Post;
  basePath: "/blog" | "/learning";
  backLabel: string;
}

export default function PostDetail({ post, basePath, backLabel }: PostDetailProps) {
  return (
    <article className="section py-20 min-h-dvh bg-bg-primary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <Link
            href={basePath}
            className="inline-flex items-center gap-2 text-sm font-medium text-link hover:text-link-hover transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>

          <div className="flex items-center gap-2 text-sm text-text-tertiary mb-4">
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

          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">{post.title}</h1>

          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt=""
              className="w-full h-56 sm:h-80 object-cover rounded-xl border border-border-color mb-8"
            />
          )}

          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((tag) => (
              <span key={tag} className="tech-tag text-xs">
                {tag}
              </span>
            ))}
          </div>

          <div className="prose-carbon">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.contentMarkdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </article>
  );
}
