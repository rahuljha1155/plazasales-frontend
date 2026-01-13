"use client";

import { TransitionLink } from "@/components/shared";
import ProductCardV2 from "@/components/ui/product-card-v2";
import { IAllProduct } from "@/services/productService";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface PopularProductsProps {
  products: IAllProduct[];
}

export default function PopularProducts({ products }: PopularProductsProps) {
  return (
    <div className="flex gap-4 justify-center  flex-wrap">
      {products?.slice(0, 8).map((data) => (
        <TransitionLink
          href={`/products/${data?.brand?.slug}/${data?.category?.slug}/${data?.subcategory?.slug}/${data?.slug}`}
        >
          <div className="relative group cursor-pointer border-zinc-200 dark:border-zinc-800  overflow-hidden hover:shadow-primary/10 transition-all duration-500  flex flex-col  w-[90vw] sm:w-full h-full sm:max-w-[18.7rem] lg:min-w-[14.7rem] ">
            {data?.ispopular && (
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
              <div className="w-full!  md:h-45 aspect-video  border rounded-xl sm:rounded-2xl overflow-hidden relative">
                <Image
                  src={data?.coverImage || data?.coverImage || "/brokenimg.jpg"}
                  alt={data?.title || data?.name || "Product"}
                  fill
                  quality={90}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  className="bg-muted/80 object-contain w-auto   sm:h-40"
                />
              </div>

              <div className="mt-2 sm:mt-3 md:mt-4 flex-1 flex flex-col">
                <h2 className="text-sm line-clamp-1 sm:text-base font-semibold group-hover:underline  group-hover:text-primary transition-all duration-300">
                  {data?.title || data?.name}
                </h2>
                <h3 className="text-muted-foreground font-semibold mt-2 text-xs">
                  {data?.model || "MEHB-EWFJ12"}
                </h3>
                {data?.brand?.name && (
                  <div className="flex justify-between items-center mt-1 ">
                    <div className="flex gap-1 sm:gap-2 items-center text-sm text-muted-foreground">
                      <Icon
                        icon="proicons:tag-multiple"
                        className="w-3 h-3 sm:w-4 sm:h-4"
                      />

                      <span className="truncate">
                        {data?.brand?.name || data?.brandName || "No Brand"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TransitionLink>
      ))}
    </div>
  );
}
