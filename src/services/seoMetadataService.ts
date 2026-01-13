import { api } from "@/config/axios.config";
import { ISeoMetadataResponse, ISeoMetadataDetailResponse } from "@/types/ISeoMetadata";

// Cache for build-time SEO data to prevent multiple API calls
let siteSeoCache: SeoResponse | null = null;
let siteSeoLastFetch = 0;
const CACHE_TTL = 60000; // 1 minute cache during build

export async function getAllSeoMetadata({
  page = 1,
  limit = 10,
  search = "",
  entityType = ""
}: {
  page?: number;
  limit?: number;
  search?: string;
  entityType?: string;
}): Promise<ISeoMetadataResponse> {
  let url = `/seo-metadata?page=${page}&limit=${limit}&search=${search}`;
  if (entityType) {
    url += `&entityType=${entityType}`;
  }
  const res = await api.get<ISeoMetadataResponse>(url);
  return res.data;
}

export async function getSeoMetadataBySlug(slug: string): Promise<ISeoMetadataDetailResponse> {
  const res = await api.get<ISeoMetadataDetailResponse>(`/seo-metadata/${slug}`);
  return res.data;
}

export async function createSeoMetadata(data: FormData): Promise<ISeoMetadataDetailResponse> {
  const res = await api.post<ISeoMetadataDetailResponse>("/seo-metadata", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function updateSeoMetadata(id: string, data: FormData): Promise<ISeoMetadataDetailResponse> {
  const res = await api.put<ISeoMetadataDetailResponse>(`/seo-metadata/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function deleteSeoMetadata(id: string): Promise<{ status: number; message: string }> {
  const res = await api.delete(`/seo-metadata/${id}`);
  return res.data;
}


export interface SeoResponse {
  status: number;
  message: string;
  seoMetadata: SeoMetadata[];
}

export interface SeoMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  openGraph: OpenGraph;
  twitter: TwitterMeta;
  robots: RobotsMeta;
  alternates: AlternatesMeta;
  jsonLd: JsonLdMeta;
  extraMeta: ExtraMeta;
  isIndexable: boolean;
  isOptimized: boolean;
  sitemapUrl: string;
  manifestUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpenGraph {
  url: string;
  type: string;
  title: string;
  images: OpenGraphImage[];
  locale: string;
  siteName: string;
  description: string;
}

export interface OpenGraphImage {
  url: string;
}

export interface TwitterMeta {
  card: string;
  title: string;
  images: string[];
  description: string;
}

export interface RobotsMeta {
  index: boolean;
  follow: boolean;
  maxSnippet: number;
  maxImagePreview: string;
  maxVideoPreview: number;
}

export interface AlternatesMeta {
  languages: Record<string, string>;
}

export interface JsonLdMeta {
  name: string;
  "@type": string;
  image: string[];
  "@context": string;
  description: string;
}

export interface ExtraMeta {
  category: string;
  themeColor: string;
}


async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getSiteSeoMetadata(): Promise<SeoResponse> {
  // Return cached data if available and fresh
  const now = Date.now();
  if (siteSeoCache && (now - siteSeoLastFetch) < CACHE_TTL) {
    return siteSeoCache;
  }

  // Retry logic with exponential backoff for rate limiting
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const res = await api.get<SeoResponse>("/seo-metadata/site-seo");
      siteSeoCache = res.data;
      siteSeoLastFetch = now;
      return res.data;
    } catch (error: unknown) {
      // If rate limited (429), wait and retry
      if ((error as { response?: { status?: number } }).response?.status === 429 && retryCount < maxRetries - 1) {
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        await delay(waitTime);
        retryCount++;
        continue;
      }
      // For other errors or final retry, throw to use fallback
      throw error;
    }
  }

  throw new Error('Failed to fetch SEO metadata after retries');
}
