import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { fetchPostBySlug } from '../services/api';
import type { PostDetailResponse } from '../types';
import './ArticlePage.css';

const ArticlePage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<PostDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPost = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);
                const data = await fetchPostBySlug(slug);
                setPost(data);
            } catch (err: any) {
                console.error('Error fetching post:', err);
                if (err.response?.status === 404) {
                    setError('Article not found.');
                } else {
                    setError('Failed to load article. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="error">
                <h2>Error</h2>
                <p>{error || 'Article not found'}</p>
                <Link to="/" className="btn btn-primary">
                    Back to Home
                </Link>
            </div>
        );
    }

    const formattedDate = new Date(post.meta.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="article-page">
            <div className="container">
                <article className="article">
                    {post.hero_image_key && (
                        <div className="article-hero">
                            <img
                                src={`/images/${slug}.png`}
                                alt={post.meta.title}
                                onError={(e) => {
                                    // Hide image container if load fails
                                    e.currentTarget.parentElement!.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    <header className="article-header">
                        {post.meta.tags && post.meta.tags.length > 0 && (
                            <div className="article-tags">
                                {post.meta.tags.map((tag) => (
                                    <Link key={tag} to={`/?tag=${tag}`} className="tag">
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <h1 className="article-title">{post.meta.title}</h1>

                        {post.meta.subtitle && (
                            <p className="article-subtitle">{post.meta.subtitle}</p>
                        )}

                        <div className="article-meta">
                            <span className="author">By {post.meta.author}</span>
                            <span className="separator">•</span>
                            <time dateTime={post.meta.published_at}>{formattedDate}</time>
                            {post.meta.reading_time_minutes && (
                                <>
                                    <span className="separator">•</span>
                                    <span>{post.meta.reading_time_minutes} min read</span>
                                </>
                            )}
                        </div>
                    </header>

                    <div className="article-body">
                        <ReactMarkdown>{post.article_markdown}</ReactMarkdown>
                    </div>
                </article>

                <div className="article-footer">
                    <Link to="/" className="btn btn-primary">
                        ← Back to Articles
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArticlePage;
