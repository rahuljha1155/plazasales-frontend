import { api } from "@/config/axios.config";
import { IBlogBySlugResponse, IBlogResponse } from "@/types/IBlog";

export const getAllBlogs = async (): Promise<IBlogResponse> => {
  try {
    const res = await api.get<IBlogResponse>("/blog/get-all-blogs");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return {
      status: 500,
      data: { blogs: [], total: 0, page: 1, limit: 0, totalPages: 0 },
      cached: false,
    };
  }
};

export const getBlogBySlug = async (
  slug: string
): Promise<IBlogBySlugResponse> => {
  try {
    const res = await api.get<IBlogBySlugResponse>(`/blog/get-blog/${slug}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch blog ${slug}:`, error);
    throw error;
  }
};
