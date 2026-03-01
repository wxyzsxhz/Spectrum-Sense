import { ArticleCard } from "@/components/ArticleCard";

export function RelatedArticles({ articles }: any) {
  return (
    <>
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        Related Articles
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((a: any) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </>
  );
}
