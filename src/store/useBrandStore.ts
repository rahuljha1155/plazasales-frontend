import { create } from 'zustand';
import { IBrand, IBrandResponse } from '@/types/IBrand';
import { fetchBrands } from '@/services/brandService';

interface BrandState {
  brands: IBrand[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  productBrandLogoUrl: string | null;
  fetchBrands: (forceRefresh?: boolean) => Promise<void>;
  setBrands: (brands: IBrand[]) => void;
  getBrandBySlug: (slug: string) => IBrand | undefined;
  setProductBrandLogo: (logoUrl: string | null) => void;
  clearProductBrandLogo: () => void;
  clearError: () => void;
}

const STORAGE_KEY = 'brands_cache';
const TIMESTAMP_KEY = 'brands_cache_timestamp';
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute in milliseconds

// Helper to check if cache is expired
const isCacheExpired = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const timestamp = sessionStorage.getItem(TIMESTAMP_KEY);
    if (!timestamp) return true;
    const cacheTime = parseInt(timestamp, 10);
    return Date.now() - cacheTime > CACHE_DURATION;
  } catch {
    return true;
  }
};

// Helper to load from sessionStorage
const loadFromSession = (): IBrand[] | null => {
  if (typeof window === 'undefined') return null;
  if (isCacheExpired()) return null;
  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

// Helper to save to sessionStorage
const saveToSession = (brands: IBrand[]) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
    sessionStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
  }
};

export const useBrandStore = create<BrandState>((set, get) => ({
  brands: loadFromSession() || [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  isLoading: false,
  error: null,
  hasFetched: false,
  productBrandLogoUrl: null,

  setProductBrandLogo: (logoUrl: string | null) => set({ productBrandLogoUrl: logoUrl }),
  clearProductBrandLogo: () => set({ productBrandLogoUrl: null }),

  setBrands: (brands: IBrand[]) => {
    set({ brands });
    saveToSession(brands);
  },

  fetchBrands: async (forceRefresh = false) => {
    // Check session cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = loadFromSession();
      if (cached && cached.length > 0) {
        // Sort cached brands by sortOrder
        const sortedCached = [...cached].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        set({ brands: sortedCached, isLoading: false, hasFetched: true });
        return;
      }
    }

    set({ isLoading: true, error: null });
    try {
      const response: IBrandResponse = await fetchBrands();
      // Sort brands by sortOrder
      const brands = [...response.data.brands].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      set({
        brands,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        isLoading: false,
        hasFetched: true,
      });
      saveToSession(brands);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch brands',
        isLoading: false,
        hasFetched: true,
      });
    }
  },

  getBrandBySlug: (slug: string) => {
    return get().brands.find((brand) => brand.slug === slug);
  },

  clearError: () => set({ error: null }),
}));
