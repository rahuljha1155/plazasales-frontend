"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useBrandStore } from "@/store/useBrandStore";
import { IBrand } from "@/types/IBrand";
import { TransitionLink } from "../shared";
import Title from "./title";

const getBrandImage = (brand: IBrand) => {
  return (
    (brand.brandImageUrls && brand.brandImageUrls.length > 0 && brand.brandImageUrls[0]) ||
    brand.logoUrl ||
    brand.indoorImage ||
    brand.outdoorImage ||
    brand.dropdownImage ||
    ""
  );
};

export default function NewBrands() {
  const [mounted, setMounted] = useState(false);
  const { brands, fetchBrands } = useBrandStore();

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && brands.length === 0) {
      fetchBrands();
    }
  }, [brands.length, fetchBrands, mounted]);

  const displayBrands = brands || [];

  if (!mounted) {
    return (
      <section className="w-full bg-white dark:bg-zinc-950 py-16 px-4 md:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-14">
        {/* Title Header */}
        <div className="text-center space-y-3">
          <Title title="Brands We Represent" />
          <p className="text-sm md:text-lg text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
            Brands that excel in their respective categories.
          </p>
        </div>

        {/* Embla Auto-Carousel Container */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-5 md:gap-6">
            {displayBrands.map((brand, index) => {
              const brandImg = getBrandImage(brand);

              return (
                <div
                  key={brand.id || brand.slug || index}
                  className="flex-[0_0_280px] sm:flex-[0_0_320px] md:flex-[0_0_350px] min-w-0"
                >
                  <TransitionLink
                    href={`/brand/${brand.slug}`}
                    className="group relative flex items-stretch gap-4 w-full h-[135px] sm:h-[155px] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 transform hover:-translate-y-1 p-3 sm:p-3.5 overflow-hidden"
                  >
                    {/* Left: Brand Image / Logo Container (Full Card Height) */}
                    <div className="relative w-[105px] sm:w-[125px] md:w-[140px] h-full shrink-0 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800/50 p-2 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                      {brandImg ? (
                        <img
                          src={brandImg}
                          alt={brand.name}
                          className="w-full h-full object-contain object-center"
                        />
                      ) : (
                        <span className="text-2xl font-black text-primary uppercase">
                          {brand.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Right: Brand Information (Title Top Right Aligned) */}
                    <div className="flex flex-col justify-start min-w-0 flex-1 pt-1 space-y-1.5">
                      <h3
                        className="text-base sm:text-lg font-extrabold uppercase tracking-wide truncate transition-colors"
                        style={{ color: brand.themeColor ? brand.themeColor : undefined }}
                      >
                        {brand.name}
                      </h3>

                      {brand.description ? (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                          {brand.description}
                        </p>
                      ) : (
                        <span className="inline-block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          Authorized Brand
                        </span>
                      )}
                    </div>
                  </TransitionLink>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
