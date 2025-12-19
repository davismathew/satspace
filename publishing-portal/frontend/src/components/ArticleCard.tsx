import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { PostIndexItem } from '../types';
import './ArticleCard.css';

interface ArticleCardProps {
    post: PostIndexItem;
    featured?: boolean;
}

const ArticleCard = ({ post, featured = false }: ArticleCardProps) => {
    const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    if (featured) {
        return (
            <article className="article-card featured animate-fade-in">
                <Link to={`/posts/${post.slug}`} className="article-link">
                    {post.hero_image_key && (
                        <div className="article-image-wrapper">
                            <div className="article-image">
                                <img
                                    src={`/images/${post.slug}.png`}
                                    alt={post.title}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <div className="image-overlay"></div>
                            </div>
                            <div className="featured-content">
                                {post.category && (
                                    <span className="category-badge">{post.category}</span>
                                )}
                                <h2 className="article-title">{post.title}</h2>
                                <p className="article-excerpt line-clamp-2">{post.excerpt}</p>
                                <div className="article-meta">
                                    <div className="meta-info">
                                        <span>SatSpace Team</span>
                                        <span>•</span>
                                        <time dateTime={post.published_at}>{formattedDate}</time>
                                    </div>
                                    <ArrowRight className="h-4 w-4 meta-arrow" />
                                </div>
                            </div>
                        </div>
                    )}
                </Link>
            </article>
        );
    }

    return (
        <article className="article-card animate-slide-up">
            <Link to={`/posts/${post.slug}`} className="article-link">
                {post.hero_image_key && (
                    <div className="article-image">
                        <img
                            src={`/images/${post.slug}.png`}
                            alt={post.title}
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <div className="category-badge-overlay">
                            <span className="category-badge">{post.category}</span>
                        </div>
                    </div>
                )}

                <div className="article-content">
                    <h3 className="article-title">{post.title}</h3>

                    <p className="article-excerpt line-clamp-2">{post.excerpt}</p>

                    <div className="article-meta">
                        <div className="meta-info">
                            <span>SatSpace Team</span>
                            <span>•</span>
                            <time dateTime={post.published_at}>{formattedDate}</time>
                        </div>
                        <ArrowRight className="h-4 w-4 meta-arrow" />
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default ArticleCard;
