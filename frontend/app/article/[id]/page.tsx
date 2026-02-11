import { articles } from "../../../data/articles"
import { notFound } from "next/navigation"
import { ArticleCard } from "@/components/ArticleCard"
import { FeaturedArticle } from "@/components/FeaturedArticle"
import { Heart } from "lucide-react";

type Props = PageProps<"/article/[id]">

export default async function ArticleDetail({ params }: Props) {
    const { id } = await params
    const article = articles.find((a) => a.id === id)

    if (!article) notFound()

    const otherArticles = articles.filter((a) => a.id !== id)

    return (
        <main className="min-h-screen px-8 md:px-20 lg:px-[50px] pt-20">
            {/* Featured / Main Article */}
            <section className="max-w-6xl bg-[#fff] text-[#4b4b4b] bg-gradient-to-b from-white/40 via-white/20 to-white/40 rounded-xl shadow-md p-6 px-8 mx-auto sm:px-6 lg:px-8 md:py-14">
                <FeaturedArticle article={article} />
                
                {/* Related Articles */}
                {otherArticles.length > 0 && (
                    <section className="">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px flex-1" />
                            <h2 className="text-xl md:text-2xl font-semibold text-[#4b4b4b] px-4">
                                Related Articles
                            </h2>
                            <div className="h-px flex-1" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {otherArticles.map((art, index) => (
                                <ArticleCard
                                    key={art.id}
                                    article={art}
                                    index={index}
                                />
                            ))}
                        </div>
                    </section>
                )} 
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
                </section>
        </main>
    )
}
