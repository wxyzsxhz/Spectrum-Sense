"use client"

import Link from "next/link"
import { articles } from "../../data/articles"
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { ArticleCard } from "@/components/ArticleCard";
import { Heart } from "lucide-react";

const Index = () => {
  const featuredArticle = articles.find((a) => a.id === "what-is-asd");
  const otherArticles = articles.filter((a) => a.id !== "what-is-asd");

  return (
    <main className="min-h-screen px-8 md:px-20 lg:px-[50px] pt-20">

      {/* Main Content */}
      <div className="max-w-6xl bg-[#f1fafe] text-[#4b4b4b] bg-gradient-to-b from-white/40 via-white/20 to-white/40 rounded-xl shadow-md p-6 px-8 mx-auto sm:px-6 lg:px-8 py-10 md:py-14">        

        {/* Featured Article */}
        {featuredArticle && (
          <section className="">
            <FeaturedArticle article={featuredArticle} />
          </section>
        )}

        {/* Related Articles */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" />
            <h2 className="text-xl font-semibold md:text-2xl text-[#4b4b4b] px-4">
              Related Articles
            </h2>
            <div className="h-px flex-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {otherArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-surface-soft pt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                Providing trusted resources for the autism community
              </p>
              <p className="flex items-center justify-center gap-1">
                Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for families everywhere
              </p>
            </div>
          </div>
        </footer>
      </div>

    </main>
  );
};

export default Index;
