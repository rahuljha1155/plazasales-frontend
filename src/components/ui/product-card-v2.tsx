import { Icon } from "@iconify/react";
import Image from "next/image";
import { TransitionLink } from "../shared";
import { IAllProduct } from "@/services/productService";

export default function ProductCardV2({ data }: { data: IAllProduct }) {
  const brandSlug =
    data?.brand?.slug ||
    data?.brand?.name?.toLowerCase().replace(/\s+/g, "-") ||
    "brand";
  const categorySlug =
    data?.category?.slug ||
    data?.category?.name?.toLowerCase().replace(/\s+/g, "-") ||
    "category";
  const subcategorySlug =
    data?.subcategory?.slug ||
    data?.subcategory?.name?.toLowerCase().replace(/\s+/g, "-") ||
    "subcategory";

  if (data.brand?.slug.toLowerCase().includes("forward")) return null;

  return (
    <TransitionLink
      href={`/products/${brandSlug}/${categorySlug}/${subcategorySlug}/${data?.slug}`}
    >
      <div className="relative group cursor-pointer border-zinc-200 dark:border-zinc-800  overflow-hidden hover:shadow-primary/10 transition-all duration-500  flex flex-col w-full! w-[90vw] h-full max-w-[18.7rem] lg:min-w-[14.7rem] ">
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
              src={data?.coverimage || data?.coverImage || "/brokenimg.jpg"}
              alt={data?.title || data?.name || "Product"}
              fill
              quality={100}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1920px) 25vw, 20vw"
              className=" object-contain w-auto   sm:h-40"
              priority={false}
            />
          </div>

          <div className="mt-2 sm:mt-3 md:mt-4 flex-1 flex flex-col">
            <h2 className="text-sm line-clamp-1 sm:text-base font-semibold group-hover:underline  group-hover:text-primary transition-all duration-300">
              {data?.title || data?.name}
            </h2>
            {data?.model && (
              <h3 className="text-muted-foreground line-clamp-1 font-semibold  text-xs">
                {data?.model}
              </h3>
            )}
            {data?.brand?.name && (
              <div className="flex justify-between items-center mt-1 ">
                <div className="flex gap-1 sm:gap-2 text-primary items-center text-sm ">
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
  );
}
