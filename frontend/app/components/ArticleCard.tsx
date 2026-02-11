import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "../../data/articles"

interface ArticleCardProps {
  article: Article;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <article
      className="bg-[#d0e9fc] bg-gradient-to-b from-white/40 via-white/20 to-white/40 shadow-sm hover:shadow-lg group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden transition-shadow flex flex-col">

        <img
          src={article.imageUrl}
          alt={article.title}
          style={{
            width: "100%",
            aspectRatio: "2 / 1",
            objectFit: "cover",
          }}
        />
        
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-[#4b4b4b] mb-3">
          <span>{article.publishedDate}</span>
          <span className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>

        <h3 className="font-heading text-lg font-semibold text-[#4b4b4b] mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        <Link
          href={`/article/${article.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#77c1e6] hover:text-[#4b4b4b] font-medium underline mt-2"
>
          Read article
          <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
