import { ISellingPointResponse } from "@/types/ISellingPoint";

// Server-side function to fetch selling points
export async function fetchSellingPointsServer(brandId?: string): Promise<ISellingPointResponse> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    let url = `${API_BASE_URL}/brand-selling-point/get-all-brand-selling-points`;
    
    // Add brand filter if provided
    if (brandId) {
        url += `?brandId=${brandId}`;
    }

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        return {
            status: res.status,
            message: 'Failed to fetch selling points',
            data: {
                brandSellingPoints: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0
            }
        };
    }

    return res.json();
}
