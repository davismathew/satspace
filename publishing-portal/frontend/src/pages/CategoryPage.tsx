import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import Newsletter from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import { getArticlesByCategory, categories, type Category } from "@/lib/data";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  
  const categoryName = categories.find(
    (c) => c.toLowerCase() === category?.toLowerCase()
  );
  
  const articles = categoryName 
    ? getArticlesByCategory(categoryName as Category)
    : [];

  if (!categoryName) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold mb-4">
              Category Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Link to="/">
              <Button variant="hero">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All News
          </Link>

          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {categoryName}
            </h1>
            <p className="text-lg text-muted-foreground">
              Latest {categoryName.toLowerCase()} news and updates from the space industry
            </p>
          </div>

          <div className="mb-8">
            <CategoryFilter />
          </div>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <div
                  key={article.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No articles found in this category yet.
              </p>
              <Link to="/" className="mt-4 inline-block">
                <Button variant="outline">Browse All Articles</Button>
              </Link>
            </div>
          )}
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
