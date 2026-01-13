import React from "react";
import About from "@/components/home/about-us";
import CustomBreadcrumb from "@/components/ui/custom-breadcum";
import { getAdProducts, AdProduct } from "@/services/adService";
import Image from "next/image";
import { TransitionLink } from "@/components/shared";
import { Icon } from "@iconify/react";
import AdTitle from "./title";

export const metadata = {
  title: "Special Offers - Plaze Electronics",
  description:
    "Discover exclusive offers and deals on high-quality electronics products at Plaze Electronics. Limited time special offers on your favorite brands.",
  keywords: [
    "Special Offers",
    "Deals",
    "Electronics",
    "Discounts",
    "Sales",
    "Plaze Electronics",
  ],
};

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  let products: AdProduct[] = [];
  let total = 0;
  let error = null;

  try {
    const response = await getAdProducts(slug);
    products = response.data.products;
    total = response.data.total;
  } catch (err) {
    error = "Failed to load products";
  }

  const breadcrumbPaths = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Offers", href: "#" },
  ];

  return (
    <section className="min-h-screen">
      <div className="bg-muted/80">
        <CustomBreadcrumb
          paths={breadcrumbPaths}
          className="flex-1 min-w-0 py-2 mb-6"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 xl:px-0 ">
        <div className="mb-8">
          <AdTitle />
          <p className="text-gray-600 dark:text-gray-300">
            {total > 0
              ? `${total} product${total !== 1 ? "s" : ""} available`
              : "No products available"}
          </p>
        </div>

        {error ? (
          <div className="text-center py-10">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              No products found in this offer
            </p>
          </div>
        ) : (
          <div className="grid mb-16 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {products.map((data) => (
              <TransitionLink
                key={data?.id}
                href={`/products/${data?.brand?.slug}/${data?.category?.slug}/${data?.subcategory?.slug}/${data?.slug}`}
              >
                <div className="relative  group cursor-pointer border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full">
                  {data?.isPopular && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-primary to-primary/90 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full z-10 shadow-lg flex items-center gap-1">
                      <Icon
                        icon="prime:star-fill"
                        width="12"
                        height="12"
                        className="sm:w-[14px] sm:h-[14px]"
                      />
                      <span className="hidden sm:block">Popular</span>
                    </div>
                  )}

                  <div className=" flex flex-col h-full">
                    <div className="w-full h-35 border md:h-45 rounded-xl sm:rounded-2xl overflow-hidden relative">
                      <Image
                        src={
                          data?.coverImage ||
                          data?.coverImage ||
                          "/brokenimg.jpg"
                        }
                        alt={data?.name || "Product"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        className=" object-contain w-auto   sm:h-40"
                      />
                    </div>

                    <div className="mt-2 sm:mt-3 md:mt-4 flex-1 flex flex-col">
                      <h2 className="text-sm sm:text-base font-semibold group-hover:underline line-clamp-2 group-hover:text-primary transition-all duration-300">
                        {data?.name}
                      </h2>
                      <div className="flex justify-between items-center mt-1 ">
                        <div className="flex gap-1 sm:gap-2 items-center text-xs sm:text-sm text-muted-foreground">
                          <Icon
                            icon="proicons:tag-multiple"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />

                          <span className="truncate">
                            {data?.brand?.name || "No Brand"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionLink>
            ))}
          </div>
        )}
      </div>
      <About />
    </section>
  );
}
