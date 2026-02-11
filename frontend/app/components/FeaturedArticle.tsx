"use client";

import Link from "next/link"
import { Clock, ExternalLink, BookOpen } from "lucide-react";
import type { Article } from "../../data/articles"
import ReactMarkdown from "react-markdown";

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <article className="max-w-[1200px] mx-auto">
      {/* Hero Image Section */}
      <div className="w-full overflow-hidden rounded-md flex justify-center items-center -mt-8">
        <img
          src={article.imageUrl}
          alt={article.title}
          style={{
            width: "60%",
            borderRadius: "0.375rem",
            aspectRatio: "2 / 1",
            objectFit: "cover",
          }} />
      </div>

      {/* Content Section */}
      <div className="md:p-10 lg:p-12">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Featured Article
          </span>
          <span>{article.publishedDate}</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-4 
                        [&_ul]:list-disc
                        [&_ol]:list-decimal
                        [&_ul]:pl-6
                        [&_ol]:pl-6">
          <p className="text-text-body text-justify text-base md:text-lg leading-relaxed mb-4">
            {article.summary}
          </p>

          {article.content && (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-justify text-base md:text-lg leading-relaxed mb-2">
                    {children}
                  </p>
                ),
                li: ({ children }) => (
                  <li className="mb-2">
                    {children}
                  </li>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          )}

        </div>

        {/* Source Attribution */}
        <div className="pt-8 border-t border-border/60">
          <div className="text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-muted-foreground">
              <span className="font-medium">Source:</span>{" "}
              <Link
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#77c1e6] font-medium underline hover:text-[#4b4b4b] transition-colors"
              >
                {article.sourceName}
              </Link>
            </div>

            <Link
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#77c1e6] font-medium underline hover:text-[#4b4b4b] transition-colors"
            >
              Read original article
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </article>
  );
}
