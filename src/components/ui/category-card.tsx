"use client";
import { Icon } from '@iconify/react';
import { TransitionLink } from '../shared';

interface CategoryCardProps {
  data: {
    title: string;
    slug: string;
    coverImage: string;
    brand?: {
      name: string;
      logoUrl: string;
    };
  };
}

export default function CategoryCard({ data }: CategoryCardProps) {
  return (
    <TransitionLink href={`/products?category=${encodeURIComponent(data.slug)}`} className="group block">
      <article className="relative h-full  w-full sm:min-w-[200px] md:min-w-[300px]   border border-zinc-200 rounded-md md:rounded-2xl lg:rounded-3xl overflow-hidden  transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg">
        <div className=" inset-0 flex items-center justify-center ">
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
            <h3 className="md:text-xl text-center w-full capitalize lg:text-xl font-semibold leading-none mb-1 text- mb- tracking-tight">
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
  );
}
