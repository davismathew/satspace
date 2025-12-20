import { Link, useLocation } from "react-router-dom";
import { categories } from "@/lib/data";

export const CategoryFilter = () => {
  const location = useLocation();
  const currentCategory = location.pathname.split("/category/")[1];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        to="/"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
          location.pathname === "/"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          to={`/category/${category.toLowerCase()}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            currentCategory === category.toLowerCase()
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
};
