import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group">
            <span className="text-2xl font-serif font-bold tracking-tight">
              SAT<span className="text-primary">SPACE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${location.pathname.includes(category.toLowerCase())
                  ? "text-primary"
                  : "text-muted-foreground"
                  }`}
              >
                {category}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="hero" size="sm" className="hidden sm:flex">
              Subscribe
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/40 animate-slide-up">
            <nav className="flex flex-col gap-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname.includes(category.toLowerCase())
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                    }`}
                >
                  {category}
                </Link>
              ))}
              <Button variant="hero" className="mt-4">
                Subscribe
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
