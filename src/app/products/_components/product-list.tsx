"use client";

import { useEffect } from "react";
import { IBrand } from "@/types/IBrand";
import { Icon } from "@iconify/react";
import { useBrandStore } from "@/store/useBrandStore";
import ProductCardV2 from "@/components/ui/product-card-v2";
import ProductCardSkeleton from "@/components/ui/product-card-skeleton";
import { IAllProduct } from "@/services/productService";
import Link from "next/link";
import { useLoading } from "./loading-context";
import AdBanner from "@/components/shared/ad-banner";
import { IAd } from "@/types/IAd";

export type IGetAllProduct = {
  brandName: string;
  id: string;
  isPopular: string;
  coverImage: string;
  title: string;
  price: string;
  sortorder: number;
  galleryCoverImage: string;
  slug: string;
};

interface ProductListProps {
  search: string;
  page: number;
  limit: number;
  brand?: string;
  category?: string;
  subcategory?: string;
  technology?: string;
  initialProducts: IAllProduct[];
  initialBrands: IBrand[];
  totalPages: number;
  totalProducts: number;
  ads?: IAd[];
}

export default function ProductList({
  search,
  initialProducts,
  initialBrands,
  page,
  limit,
  totalPages,
  totalProducts,
  brand,
  category,
  subcategory,
  technology,
  ads = [],
}: ProductListProps) {
  const { setBrands } = useBrandStore();
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    if (initialBrands.length > 0) {
      // Sort brands by sortOrder before setting
      const sortedBrands = [...initialBrands].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setBrands(sortedBrands);
    }
  }, [initialBrands, setBrands]);

  useEffect(() => {
    // Only reset loading if it's currently true
    if (isLoading) {
      setLoading(false);
    }
  }, [initialProducts, isLoading, setLoading]);

  const buildUrlParams = (pageNum: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (brand) params.set("brand", brand);
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    if (technology) params.set("technology", technology);
    params.set("page", String(pageNum));

    return params.toString();
  };

  // Simple sort by sortOrder
  // Filter out unpublished products (temporary fix until backend is updated)
  const publishedProducts = (initialProducts || []).filter(product => product.isPublished === true);
  const sortedProducts = [...publishedProducts].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <>
      <AdBanner ads={ads} />

      <div className="pb-6 max-w-7xl mx-auto  xl:px-0 relative">
        <div
          className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity duration-200 `}
        >
          {isLoading ? (
            // Show skeleton loaders
            Array.from({ length: 16 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : sortedProducts?.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCardV2 key={product.id} data={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Icon
                icon="tabler:package-off"
                width="64"
                height="64"
                className="mx-auto text-zinc-300 mb-4"
              />
              <p className="text-muted-foreground text-lg">
                {search
                  ? `No products found for "${search}"`
                  : "No products available"}
              </p>

              {search && (
                <Link href="/products">
                  <button
                    onClick={() => setLoading(true)}
                    className=" mt-6 border px-4 py-1 rounded-xs border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Clear Search
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 bg-white dark:bg-zinc-900 rounded-lg px-4 py-3">
            {/* Total Count */}
            <div className="text-sm text-muted-foreground">
              Total Products: <span className="font-semibold text-foreground">{totalProducts}</span>
            </div>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {/* Previous Arrow */}
              <Link
                href={`/products?${buildUrlParams(page - 1)}`}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                onClick={() => {
                  setLoading(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <button
                  disabled={page <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:cursor-not-allowed"
                >
                  <Icon icon="tabler:chevron-left" width="16" height="16" />
                </button>
              </Link>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <Link
                      key={pageNum}
                      href={`/products?${buildUrlParams(pageNum)}`}
                      onClick={() => {
                        setLoading(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <button
                        className={`min-w-[32px] h-8 px-3 rounded text-sm font-medium transition-colors ${
                          page === pageNum
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground"
                        }`}
                      >
                        {pageNum}
                      </button>
                    </Link>
                  );
                })}
              </div>

              {/* Next Arrow */}
              <Link
                href={`/products?${buildUrlParams(page + 1)}`}
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                onClick={() => {
                  setLoading(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <button
                  disabled={page >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:cursor-not-allowed"
                >
                  <Icon icon="tabler:chevron-right" width="16" height="16" />
                </button>
              </Link>
            </div>

            {/* Show per Page - Currently static, can be made dynamic */}
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Show per Page:</span>
              <span className="font-semibold text-foreground">{limit}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
