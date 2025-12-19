import axios from 'axios';
import type { PostListResponse, PostDetailResponse } from '../types';

// API baseURL - update this after deploying the API Gateway
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface FetchPostsParams {
    tag?: string;
    limit?: number;
    offset?: number;
}

export const fetchPosts = async (
    params: FetchPostsParams = {}
): Promise<PostListResponse> => {
    const { tag, limit = 20, offset = 0 } = params;

    const response = await apiClient.get<PostListResponse>('/posts', {
        params: { tag, limit, offset },
    });

    return response.data;
};

export const fetchPostBySlug = async (
    slug: string
): Promise<PostDetailResponse> => {
    const response = await apiClient.get<PostDetailResponse>(`/posts/${slug}`);
    return response.data;
};

export default apiClient;
