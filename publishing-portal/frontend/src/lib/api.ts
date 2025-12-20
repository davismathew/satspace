/**
 * SatSpace API Client
 * 
 * Handles all API communication with the backend
 * In production, this uses the API Gateway endpoint
 * In development, can fall back to mock data
 */

export interface Post {
    slug: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    content?: string;
    tags: string[];
    author: string;
    published_at: string;
    updated_at?: string;
    hero_image_key?: string;
    hero_image_url?: string;
    reading_time_minutes?: number;
    status: string;
}

export interface PostListItem {
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    published_at: string;
    hero_image_key?: string;
    status: string;
}

class ApiClient {
    private baseUrl: string;

    constructor() {
        // Use environment variable for API URL, fallback to placeholder
        this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    }

    /**
     * Fetch all published posts
     */
    async getPosts(): Promise<PostListItem[]> {
        try {
            const response = await fetch(`${this.baseUrl}/posts`);

            if (!response.ok) {
                throw new Error(`Failed to fetch posts: ${response.statusText}`);
            }

            const data = await response.json();
            return data.posts || [];
        } catch (error) {
            console.error('Error fetching posts:', error);
            // In development, return empty array
            // In production, you might want to throw or show error UI
            return [];
        }
    }

    /**
     * Fetch a single post by slug
     */
    async getPostBySlug(slug: string): Promise<Post | null> {
        try {
            const response = await fetch(`${this.baseUrl}/posts/${slug}`);

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`Failed to fetch post: ${response.statusText}`);
            }

            const post = await response.json();
            return post;
        } catch (error) {
            console.error(`Error fetching post ${slug}:`, error);
            return null;
        }
    }

    /**
     * Get posts by category/tag
     */
    async getPostsByTag(tag: string): Promise<PostListItem[]> {
        const allPosts = await this.getPosts();
        return allPosts.filter(post =>
            post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
        );
    }

    /**
     * Search posts by query
     */
    async searchPosts(query: string): Promise<PostListItem[]> {
        const allPosts = await this.getPosts();
        const lowerQuery = query.toLowerCase();

        return allPosts.filter(post =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.excerpt.toLowerCase().includes(lowerQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
}

// Export a singleton instance
export const apiClient = new ApiClient();
