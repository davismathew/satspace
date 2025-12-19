import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { fetchPosts } from '../services/api';
import type { PostIndexItem } from '../types';
import './CategoryPage.css';

interface CategoryPageProps {
    category: string;
    title: string;
    description: string;
}

const CategoryPage = ({ category, title, description }: CategoryPageProps) => {
    const [posts, setPosts] = useState<PostIndexItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const tag = searchParams.get('tag');

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const response = await fetchPosts({ tag: tag || category, limit: 50 });
                setPosts(response.items);
            } catch (err) {
                setError('Failed to load articles');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [category, tag]);

    if (loading) {
        return (
            <div className="category-page">
                <div className="container">
                    <div className="loading">Loading articles...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="category-page">
                <div className="container">
                    <div className="error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="category-page">
            <div className="container">
                <header className="category-header">
                    <h1>{title}</h1>
                    <p className="category-description">{description}</p>
                </header>

                {posts.length === 0 ? (
                    <p className="no-articles">No articles found in this category.</p>
                ) : (
                    <div className="articles-grid">
                        {posts.map((post, index) => (
                            <div
                                key={post.slug}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <ArticleCard post={post} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
