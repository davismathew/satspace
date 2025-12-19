export interface PostMeta {
    slug: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    tags: string[];
    author: string;
    published_at: string;
    updated_at: string;
    hero_image_key?: string;
    reading_time_minutes?: number;
    status: 'draft' | 'published';
}

export interface PostIndexItem {
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    category?: string;
    published_at: string;
    hero_image_key?: string;
}


export interface PostListResponse {
    items: PostIndexItem[];
    total: number;
    limit: number;
    offset: number;
}

export interface PostDetailResponse {
    meta: PostMeta;
    article_markdown: string;
    hero_image_key?: string;
}
