import { Product } from "./IProductBySlug";

export interface IAd {
    id: string;
    title: string;
    bannerUrls: string[];
    targetUrl: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    sortOrder?: number;
    description?: string;
    startAt?: string;
    endAt?: string;
    impressions?: string;
    clicks?: string;
    brand?: {
        id: string;
        name: string;
        slug: string;
        logoUrl: string;
    } | null;
    category?: {
        id: string;
        title: string;
    } | null;
    subcategory?: {
        id: string;
        title: string;
    } | null;
    product?: Product | null;
}

export interface IAdResponse {
    status: number;
    data: {
        ads: IAd[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    message: string;
    cached: boolean;
}
