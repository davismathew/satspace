import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Share2, Bookmark, Twitter, Linkedin, Facebook } from "lucide-react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getArticleBySlug, getRelatedArticles } from "@/lib/data";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug || "");
  const relatedArticles = getRelatedArticles(slug || "", 3);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist.
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
        {/* Article Header */}
        <article className="container mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>

          <div className="max-w-4xl mx-auto">
            <Badge variant="default" className="mb-4">
              {article.category}
            </Badge>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <span className="font-medium text-foreground">{article.author}</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </span>

              <div className="flex-1" />

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative rounded-xl overflow-hidden mb-10">
              <img
                src={article.image}
                alt={article.title}
                className="w-full aspect-video object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              {article.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-foreground/90 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Share this article</h3>
                  <p className="text-sm text-muted-foreground">
                    Help spread the latest space news
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="container mx-auto px-4 py-12 border-t border-border">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">
              Related Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </section>
        )}

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default Article;
