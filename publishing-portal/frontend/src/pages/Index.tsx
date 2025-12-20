import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import Newsletter from "@/components/Newsletter";
import { getFeaturedArticle, getLatestArticles } from "@/lib/data";
import { TrendingUp } from "lucide-react";

const Index = () => {
  const featuredArticle = getFeaturedArticle();
  const latestArticles = getLatestArticles(6).filter(a => !a.featured);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Breaking News
              </span>
            </div>
          </div>
          
          {featuredArticle && (
            <ArticleCard article={featuredArticle} variant="featured" />
          )}
        </section>

        {/* Latest Articles */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold">
              Latest Stories
            </h2>
            <CategoryFilter />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article, index) => (
              <div
                key={article.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
