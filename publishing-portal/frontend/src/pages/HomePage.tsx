import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { fetchPosts } from '../services/api';
import type { PostIndexItem } from '../types';
import './HomePage.css';

const HomePage = () => {
    const [searchParams] = useSearchParams();
    const tag = searchParams.get('tag') || undefined;

    const [posts, setPosts] = useState<PostIndexItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const limit = 20;

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchPosts({ tag, limit, offset });
                setPosts(response.items);
                setTotal(response.total);
            } catch (err: any) {
                console.error('Error fetching posts:', err);
                setError('Failed to load articles. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [tag, offset]);

    const handleLoadMore = () => {
        setOffset((prev) => prev + limit);
    };

    const handlePrevious = () => {
        setOffset((prev) => Math.max(0, prev - limit));
    };

    if (loading && posts.length === 0) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    const [featuredPost, ...regularPosts] = posts;

    return (
        <div className="home-page">
            <div className="container">
                {tag && (
                    <div className="page-header">
                        <h1>Articles tagged: {tag}</h1>
                    </div>
                )}

                {featuredPost && (
                    <section className="featured-section">
                        <ArticleCard post={featuredPost} featured />
                    </section>
                )}

                {regularPosts.length > 0 && (
                    <section className="articles-grid">
                        {regularPosts.map((post, index) => (
                            <div
                                key={post.slug}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <ArticleCard post={post} />
                            </div>
                        ))}
                    </section>
                )}

                {total > limit && (
                    <div className="pagination">
                        {offset > 0 && (
                            <button onClick={handlePrevious} className="btn btn-primary">
                                Previous
                            </button>
                        )}
                        <span className="pagination-info">
                            Showing {offset + 1} - {Math.min(offset + limit, total)} of {total}
                        </span>
                        {offset + limit < total && (
                            <button onClick={handleLoadMore} className="btn btn-primary">
                                Next
                            </button>
                        )}
                    </div>
                )}

                {posts.length === 0 && !loading && (
                    <div className="no-posts">
                        <p>No articles found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
