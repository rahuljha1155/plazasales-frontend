"use client";
import React from "react";
import { Icon } from "@iconify/react";
import CustomBreadcumb from "@/components/ui/custom-breadcum";
import { useBrandStore } from "@/store/useBrandStore";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoading } from "./loading-context";

interface SidebarProps {
  children: React.ReactNode;
  search?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  technology?: string;
  breadcrumbPaths?: { name: string; href: string }[];
  hideBrandFilter?: boolean;
  basePath?: string;
}

export default function Sidebar({
  children,
  search,
  brand,
  category,
  subcategory,
  technology,
  breadcrumbPaths = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    search && {
      name: `Search: ${search}`,
      href: `/products?search=${encodeURIComponent(search)}`,
    },
  ].filter((path): path is { name: string; href: string } => Boolean(path)),
  hideBrandFilter = false,
  basePath = "/products",
}: SidebarProps) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [isBrandsOpen, setIsBrandsOpen] = React.useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const [selectedBrand, setSelectedBrand] = React.useState<string>(() => {
    return brand || "";
  });
  const [selectedCategory, setSelectedCategory] = React.useState<string>(() => {
    return category || "";
  });
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string>(
    () => {
      return subcategory || "";
    }
  );

  const { brands } = useBrandStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setSelectedBrand(brand || "");
    setSelectedCategory(category || "");
    setSelectedSubcategory(subcategory || "");
  }, [brand, category, subcategory]);

  const displayCategories = React.useMemo(() => {
    if (!selectedBrand) {
      const categoryMap = new Map<
        string,
        { id: string; title: string; slug: string; sortOrder?: number }
      >();
      brands.forEach((brand) => {
        if (brand.name?.toLowerCase() === "forward") return;
        brand.categories?.forEach((cat) => {
          if (!categoryMap.has(cat.id)) {
            categoryMap.set(cat.id, {
              id: cat.id,
              title: cat.title,
              slug: cat.slug,
              sortOrder: cat.sortOrder,
            });
          }
        });
      });
      return Array.from(categoryMap.values()).sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      );
    }

    // Show only selected brand's categories
    const selectedBrandData = brands.find((b) => b.slug === selectedBrand);
    return (
      selectedBrandData?.categories
        ?.map((cat) => ({
          id: cat.id,
          title: cat.title,
          slug: cat.slug,
          sortOrder: cat.sortOrder,
        }))
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) || []
    );
  }, [brands, selectedBrand]);

  const displaySubcategories = React.useMemo(() => {
    if (!selectedCategory) {
      const subcategoryMap = new Map<
        string,
        { id: string; title: string; slug: string; categorySlug: string }
      >();

      if (selectedBrand) {
        // If brand is selected, show only that brand's subcategories
        const selectedBrandData = brands.find((b) => b.slug === selectedBrand);
        selectedBrandData?.categories?.forEach((cat) => {
          cat.subCategories?.forEach((sub) => {
            if (!subcategoryMap.has(sub.id)) {
              subcategoryMap.set(sub.id, {
                id: sub.id,
                title: sub.title,
                slug: sub.slug,
                categorySlug: cat.slug,
              });
            }
          });
        });
      } else {
        brands.forEach((brand) => {
          if (brand.name?.toLowerCase() === "forward") return;
          brand.categories?.forEach((cat) => {
            cat.subCategories?.forEach((sub) => {
              if (!subcategoryMap.has(sub.id)) {
                subcategoryMap.set(sub.id, {
                  id: sub.id,
                  title: sub.title,
                  slug: sub.slug,
                  categorySlug: cat.slug,
                });
              }
            });
          });
        });
      }

      return Array.from(subcategoryMap.values());
    }

    // Show subcategories for selected category
    const subcategoryMap = new Map<
      string,
      { id: string; title: string; slug: string; categorySlug: string }
    >();

    if (selectedBrand) {
      // Filter by selected brand
      const selectedBrandData = brands.find((b) => b.slug === selectedBrand);
      selectedBrandData?.categories
        ?.filter((cat) => cat.slug === selectedCategory)
        .forEach((cat) => {
          cat.subCategories?.forEach((sub) => {
            if (!subcategoryMap.has(sub.id)) {
              subcategoryMap.set(sub.id, {
                id: sub.id,
                title: sub.title,
                slug: sub.slug,
                categorySlug: cat.slug,
              });
            }
          });
        });
    } else {
      // Show from all brands except 'forward'
      brands.forEach((brand) => {
        if (brand.name?.toLowerCase() === "forward") return;
        brand.categories
          ?.filter((cat) => cat.slug === selectedCategory)
          .forEach((cat) => {
            cat.subCategories?.forEach((sub) => {
              if (!subcategoryMap.has(sub.id)) {
                subcategoryMap.set(sub.id, {
                  id: sub.id,
                  title: sub.title,
                  slug: sub.slug,
                  categorySlug: cat.slug,
                });
              }
            });
          });
      });
    }

    return Array.from(subcategoryMap.values());
  }, [brands, selectedBrand, selectedCategory]);

  const handleBrandToggle = React.useCallback(
    (brandSlug: string) => {
      // Only allow one brand at a time
      const newBrand = selectedBrand === brandSlug ? "" : brandSlug;
      setSelectedBrand(newBrand);
      setSelectedCategory("");
      setSelectedSubcategory("");

      const params = new URLSearchParams();
      if (newBrand) params.set("brand", newBrand);
      // Don't preserve search param when clicking on brand
      if (technology) params.set("technology", technology);
      params.set("page", "1");

      setLoading(true);
      router.push(`${basePath}?${params.toString()}`);
    },
    [selectedBrand, router, technology, setLoading, basePath]
  );

  const handleCategoryToggle = React.useCallback(
    (categorySlug: string) => {
      // Only allow one category at a time
      const newCategory = selectedCategory === categorySlug ? "" : categorySlug;
      setSelectedCategory(newCategory);
      setSelectedSubcategory("");

      const params = new URLSearchParams();
      if (selectedBrand) params.set("brand", selectedBrand);
      if (newCategory) params.set("category", newCategory);
      if (search) params.set("search", search);
      if (technology) params.set("technology", technology);
      params.set("page", "1");

      setLoading(true);
      router.push(`${basePath}?${params.toString()}`);
    },
    [
      selectedCategory,
      selectedBrand,
      router,
      search,
      technology,
      setLoading,
      basePath,
    ]
  );

  const handleSubcategoryToggle = React.useCallback(
    (subcategorySlug: string) => {
      // Only allow one subcategory at a time
      const newSubcategory =
        selectedSubcategory === subcategorySlug ? "" : subcategorySlug;
      setSelectedSubcategory(newSubcategory);

      const params = new URLSearchParams();
      if (selectedBrand) params.set("brand", selectedBrand);
      if (selectedCategory) params.set("category", selectedCategory);
      if (newSubcategory) params.set("subcategory", newSubcategory);
      if (search) params.set("search", search);
      if (technology) params.set("technology", technology);
      params.set("page", "1");

      setLoading(true);
      router.push(`${basePath}?${params.toString()}`);
    },
    [
      selectedSubcategory,
      selectedBrand,
      selectedCategory,
      router,
      search,
      technology,
      setLoading,
      basePath,
    ]
  );

  const clearAllFilters = () => {
    if (!hideBrandFilter) {
      setSelectedBrand("");
    } else {
      setSelectedBrand(brand || "");
    }
    setSelectedCategory("");
    setSelectedSubcategory("");
    const params = new URLSearchParams();
    // Don't preserve search parameter - clear everything
    setLoading(true);
    router.push(`${basePath}?${params.toString()}`);
  };

  const hasActiveFilters =
    selectedBrand || selectedCategory || selectedSubcategory;

  return (
    <div className="">
      <CustomBreadcumb
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        paths={breadcrumbPaths}
        className="flex-1 min-w-0 py-2 px-4 xl:px-0"
      />

      <div className="flex relative max-w-7xl mx-auto">
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-[190] transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className={`
        w-full max-w-[260px] pt-10 lg:pt-0 border-r border-zinc-200 bg-white lg:bg-gradient-to-b from-white to-gray-50/50 shrink-0
        fixed lg:sticky top-0 left-0 h-screen z-[190] transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
        >
          <div className="flex px-4 xl:pr-4 xl:px-0 items-center justify-between bg-white/80 backdrop-blur-sm border-b border-zinc-200 py-3">
            <h3 className=" font-semibold text-sm flex gap-2 items-center">
              <Icon icon="lets-icons:filter" className="size-4" />
              Filters
            </h3>
            <button
              onClick={clearAllFilters}
              className=" text-xs text-zinc-600 hover:text-primary transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Filters Content - Scrollable */}
          <div className="overflow-y-auto h-[calc(100vh-73px)] lg:h-[calc(100vh-73px)] px-4 xl:px-0 py-4 pb-20 lg:pb-4 relative">
            {!hideBrandFilter && (
              <div className="mb-2 pr-4">
                <button
                  onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                  className="flex items-center justify-between w-full text-left mb-3 group"
                >
                  <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                    Brands
                  </h4>
                  <Icon
                    icon="mingcute:right-line"
                    className={`size-4 transition-transform duration-300 ${
                      isBrandsOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isBrandsOpen
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-2">
                    {!mounted
                      ? // Skeleton loader
                        Array.from({ length: 5 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 animate-pulse"
                          >
                            <div className="size-5 rounded-full bg-zinc-200"></div>
                            <div className="h-4 bg-zinc-200 rounded w-24"></div>
                          </div>
                        ))
                      : brands?.map((brandItem) => {
                          const isSelected = selectedBrand === brandItem.slug;
                          if (
                            brandItem.slug
                              .toLocaleLowerCase()
                              .includes("forward")
                          )
                            return null;
                          return (
                            <label
                              key={brandItem.id}
                              className="flex items-center gap-2 cursor-pointer rounded-md transition-colors group"
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleBrandToggle(brandItem.slug)
                                }
                                className="size-5 rounded-full"
                              />
                              <span className="text-sm text-zinc-700 group-hover:text-zinc-900">
                                {brandItem.name}
                              </span>
                            </label>
                          );
                        })}
                  </div>
                </div>
              </div>
            )}

            {/* Categories Filter */}
            <div className="mb-3 mt-4 pr-4">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center justify-between w-full text-left mb-3 group"
              >
                <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  Product Type
                </h4>
                <Icon
                  icon="mingcute:right-line"
                  className={`size-4 transition-transform duration-300 ${
                    isCategoriesOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden  transition-all duration-300 ease-in-out ${
                  isCategoriesOpen
                    ? "max-h-full opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-2">
                  {!mounted
                    ? // Skeleton loader
                      Array.from({ length: 5 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 animate-pulse"
                        >
                          <div className="size-5 rounded-full bg-zinc-200"></div>
                          <div className="h-4 bg-zinc-200 rounded w-32"></div>
                        </div>
                      ))
                    : [...displayCategories]
                        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                        .map((cat) => {
                          const isSelected = selectedCategory === cat.slug;
                          return (
                            <label
                              key={cat.id}
                              className="flex items-center gap-2 cursor-pointer rounded-md transition-colors group"
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleCategoryToggle(cat.slug)
                                }
                                className="size-5 rounded-full"
                              />
                              <span className="text-sm text-zinc-700 group-hover:text-zinc-900">
                                {cat.title}
                              </span>
                            </label>
                          );
                        })}
                </div>
              </div>
            </div>

            {mounted && displaySubcategories.length > 0 && (
              <div className="mb-6 pr-4">
                <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2 mb-3">
                  Product Category
                </h4>

                <div className="space-y-2">
                  {displaySubcategories.map((subcategory) => {
                    const isSelected = selectedSubcategory === subcategory.slug;
                    return (
                      <label
                        key={subcategory.id}
                        className="flex items-center gap-2 cursor-pointer rounded-md transition-colors group"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            handleSubcategoryToggle(subcategory.slug)
                          }
                          className="size-5 rounded-full"
                        />
                        <span className="text-sm text-zinc-700 group-hover:text-zinc-900">
                          {subcategory.title}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mobile Clear All Button - Fixed at bottom right */}
            {hasActiveFilters && (
              <div className="lg:hidden fixed border-t p-3 bottom-0 w-full flex h-fit bg-white justify-end right-0 z-50">
                <button
                  onClick={clearAllFilters}
                  className="text-primary  hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-[calc(100%-280px)]">
          <div className="py-0.5 px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
