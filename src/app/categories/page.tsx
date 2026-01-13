"use client";

import { useEffect, useState } from "react";
import { getAllCategories } from "@/services/categoryService";
import { ICategory } from "@/types/ICategory";
import CategoryCard from "@/components/ui/category-card";
import { Icon } from "@iconify/react";
import Title from "@/components/home/title";
import { TransitionLink } from "@/components/shared";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await getAllCategories({ page: 1, limit: 100 });
        setCategories(categoriesResponse.data.categories);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Exclude categories with brand name 'forward' and group by brand
  const categoriesByBrand = categories
    .filter(category => !category.brand?.name?.toLowerCase().includes('forward'))
    .reduce((acc, category) => {
      const brandName = category.brand?.name;
      if (!acc[brandName]) {
        acc[brandName] = [];
      }
      acc[brandName].push(category);
      return acc;
    }, {} as Record<string, ICategory[]>);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-8 md:pt-10 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center md:mb-8 lg:mb-12">
            <Title title="Explore Our Categories" />
            <p className="text-base md:text-xl mt-2 text-muted-foreground max-w-2xl mx-auto">
              Discover innovative technology designed for your lifestyle across all our product categories
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid by Brand */}
      <section className="pt-10 md:pt-0 md:pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(12)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-[250px] sm:h-[300px] rounded-md md:rounded-2xl lg:rounded-3xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-12">
                {Object.entries(categoriesByBrand).map(([brandName, brandCategories]) => {
                  if (brandName !== 'undefined' && brandName !== null && brandName.trim() !== '') {
                    return (
                <div key={brandName}>
                  <h2 className="text-2xl md:text-3xl text-center font-bold mb-6 capitalize">
                    {brandName}
                  </h2>
                        <div className="flex gap-2 justify-center flex-wrap mb-6 xl:gap-4">
                    {brandCategories.map((data) => (
                      <TransitionLink href={`/products?category=${encodeURIComponent(data.slug)}`} className="group block">
                        <article className="relative h-full w-[42vw] md:max-w-[25vw] xl:max-w-[20vw]   border border-zinc-200 rounded-md md:rounded-2xl lg:rounded-3xl overflow-hidden  transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg">
                          <div className=" flex items-center justify-center ">
                            <div className="relative w-full h-30 sm:h-50   transition-transform duration-700 ease-out group-hover:scale-105">
                              <img
                                src={data.coverImage || "/brokenimg.webp"}
                                alt={data.title}
                                loading="lazy"
                                className="w-full h-full object-contain object-center   "
                              />
                            </div>
                          </div>

                          <div className=" w-full text-center  z-40 inset-0 lg:flex items-end justify-center  bottom-0  px-2  sm:px-6 ">
                            <div className="transform transition-transform duration-500 ease-out group-hover:translate-y-[-8px]">
                              <h3 className="md:text-xl leading-none mb-2 text-center w-full capitalize lg:text-xl font-semibold text- mb- tracking-tight">
                                {data.title}
                              </h3>
                              {data.brand && (
                                <p className="text-primary/80 text-xs  sm:text-base mb-2 flex gap-2 justify-center items-center flex-wrap  md:mb-4 font-light">
                                  <Icon icon={"proicons:tag-multiple"} />
                                  {data.brand.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          </div>
                        </article>
                      </TransitionLink>
                    ))}
                  </div>
                </div>
                    )
                  }
                })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Icon
                icon="mdi:package-variant-closed"
                className="w-20 h-20 mx-auto text-muted-foreground mb-4"
              />
              <h3 className="text-xl md:text-2xl font-semibold mb-2">
                No categories found
              </h3>
              <p className="text-muted-foreground">
                    No categories available at the moment
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
