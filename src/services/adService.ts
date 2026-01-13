import axios from 'axios';
import { IAdResponse } from '@/types/IAd';
import { api } from '@/config/axios.config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const adService = {
    async getAds(page: number = 1, limit: number = 10): Promise<IAdResponse> {
        try {
            const response = await axios.get(`${API_BASE_URL}/ads/get-ads`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};


export const adServiceById = {
    async getAdsById(page: number = 1, limit: number = 10, brandId: string): Promise<IAdResponse> {
        try {
            const response = await api.get(`/ads/context-ads`, {
                params: { page, limit, brandId }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};


export async function recordClick(id: string, token: string) {
    const res = await api.post(`/ads/${id}/click`, {}, {
        headers: {
            "X-Recaptcha-Token": token,
        }
    });
    return res?.data;
}

export async function recordImpression(id: string, token: string) {
    const res = await api.post(`/ads/${id}/impression`, {}, {
        headers: {
            "X-Recaptcha-Token": token,
        }
    });
    return res?.data;
}

export interface AdProduct {
    id: string;
    name: string;
    slug: string;
    coverImage: string | null;
    price: string | null;
    isPopular: boolean;
    sortOrder: number;
    brand: {
        id: string;
        name: string;
        slug: string;
    };
    subcategory: {
        id: string;
        name: string;
        slug: string;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
}

export interface AdProductsResponse {
    status: number;
    message: string;
    data: {
        products: AdProduct[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export async function getAdProducts(adId: string, page: number = 1, limit: number = 12): Promise<AdProductsResponse> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const res = await fetch(`${API_BASE_URL}/ads/${adId}/products?page=${page}&limit=${limit}`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch ad products: ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        throw error;
    }
}