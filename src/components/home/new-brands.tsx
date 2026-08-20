"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useBrandStore } from "@/store/useBrandStore";
import { IBrand } from "@/types/IBrand";
import { TransitionLink } from "../shared";
import Title from "./title";
import { TextStaggerHover } from "./animated-slideshow";
import { Icon } from "@iconify/react";

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
        <div className="overflow-hidden cursor-grab active:cursor-grabbing py-2 w-full" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-5 md:gap-6">
            {displayBrands.map((brand, index) => {
              const brandImg = getBrandImage(brand);

              return (
                <div
                  key={brand.id || brand.slug || index}
                  className="flex-[0_0_calc(100%)] sm:flex-[0_0_calc(50%-10px)] md:flex-[0_0_calc(50%-12px)] min-w-0"
                >
                  <TransitionLink
                    href={`/brand/${brand.slug}`}
                    className="group relative flex flex-col justify-end w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[380px] rounded-2xl md:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 transform hover:-translate-y-1 p-5 sm:p-6 overflow-hidden select-none"
                  >
                    {/* Full Card Cover Background Image */}
                    <div className="absolute inset-0 z-0 bg-zinc-900">
                      {brandImg ? (
                        <img
                          src={brandImg}
                          alt={brand.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                          <span className="text-4xl font-black text-primary uppercase">
                            {brand.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Gradient Overlay for Text Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                    </div>

                    {/* Content Layer Over Image */}
                    <div className="relative z-10 space-y-1.5 text-white">
                      <TextStaggerHover
                        index={index}
                        text={brand.name}
                        className="text-xl sm:text-2xl font-black uppercase tracking-wider truncate drop-shadow-md"
                        style={{
                          color: brand.themeColor ? brand.themeColor : "#ffffff",
                        }}
                      />

                      {brand.description && (
                        <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2 leading-relaxed drop-shadow-xs">
                          {brand.description}
                        </p>
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
