"use client";

import { useEffect } from "react";
import { IBrand } from "@/types/IBrand";
import { Icon } from "@iconify/react";
import { useBrandStore } from "@/store/useBrandStore";
import ProductCardV2 from "@/components/ui/product-card-v2";
import ProductCardSkeleton from "@/components/ui/product-card-skeleton";
import { IAllProduct } from "@/services/productService";
import { Button } from "@/components/ui/button";
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

  // Sort products by category, subcategory, and then by sortOrder
  const sortedProducts = [...(initialProducts || [])].sort((a, b) => {
    // First sort by category name
    const categoryA = a.category?.name || a.category?.title || '';
    const categoryB = b.category?.name || b.category?.title || '';
    if (categoryA !== categoryB) {
      return categoryA.localeCompare(categoryB);
    }

    // Then sort by subcategory name
    const subcategoryA = a.subcategory?.name || a.subcategory?.title || '';
    const subcategoryB = b.subcategory?.name || b.subcategory?.title || '';
    if (subcategoryA !== subcategoryB) {
      return subcategoryA.localeCompare(subcategoryB);
    }

    // Finally sort by sortOrder
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });

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
          ) : initialProducts?.length > 0 ? (
            sortedProducts
              ?.filter((product) => product.isPublished === true) // Only show explicitly published products
              ?.map((product) => {
                if (!product.brand?.name?.includes("forward")) {
                  return <ProductCardV2 key={product.id} data={product} />;
                }
                return null;
              })
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
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-16 border-t pt-6">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * 16 + 1} to{" "}
              {Math.min(page * 16, totalProducts)} of {totalProducts} products
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/products?${buildUrlParams(page - 1)}`}
                className={page <= 1 ? "pointer-events-none" : ""}
                onClick={() => {
                  setLoading(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  className="gap-1 h-6 px-2 py-1"
                >
                  <Icon icon="tabler:chevron-left" width="14" height="14" />
                  <span className="hidden md:block text-xs">Previous</span>
                </Button>
              </Link>

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
                      <Button
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        className="min-w-[32px] h-6 px-2 py-1 text-xs"
                      >
                        {pageNum}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              <Link
                href={`/products?${buildUrlParams(page + 1)}`}
                className={page >= totalPages ? "pointer-events-none" : ""}
                onClick={() => {
                  setLoading(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  className="gap-1 h-5 px-2 py-0"
                >
                  <span className="hidden md:block text-xs">Next</span>

                  <Icon icon="tabler:chevron-right" width="12" height="12" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
