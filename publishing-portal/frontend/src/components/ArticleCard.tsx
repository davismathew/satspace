import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/data";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
}

export const ArticleCard = ({ article, variant = "default" }: ArticleCardProps) => {
  if (variant === "featured") {
    return (
      <Link
        to={`/article/${article.slug}`}
        className="group relative block overflow-hidden rounded-xl card-glow"
      >
        <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <Badge variant="default" className="mb-4">
            {article.category}
          </Badge>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-3 group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base line-clamp-2 max-w-3xl mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        to={`/article/${article.slug}`}
        className="group flex gap-4 items-start"
      >
        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Badge variant="secondary" className="mb-2 text-xs">
            {article.category}
          </Badge>
          <h3 className="font-serif text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{article.date}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/article/${article.slug}`}
      className="group block overflow-hidden rounded-xl bg-card border border-border card-glow"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="default">{article.category}</Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </div>
      </div>
    </Link>
  );
};
