"use client";

import React, { useState, useEffect } from "react";
import { useBrandStore } from "@/store/useBrandStore";
import { IBrand } from "@/types/IBrand";
import { TransitionLink } from "../shared";
import { Icon } from "@iconify/react";
import Title from "./title";
import { Button } from "../ui/button";

const getBrandImage = (brand?: Partial<IBrand>) => {
  if (!brand) return "/logo/logo.png";
  return (
    (brand.brandImageUrls &&
      brand.brandImageUrls.length > 0 &&
      brand.brandImageUrls[0]) ||
    brand.logoUrl ||
    brand.indoorImage ||
    brand.outdoorImage ||
    brand.dropdownImage ||
    "/logo/logo.png"
  );
};

export default function NewBrands() {
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { brands, fetchBrands } = useBrandStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && brands.length === 0) {
      fetchBrands();
    }
  }, [brands.length, fetchBrands, mounted]);

  const displayBrands = brands || [];

  // Fallback demo brands if database brands are empty
  const sampleBrands: Partial<IBrand>[] = [
    {
      id: "sample-1",
      name: "Indoor Excellence",
      slug: "indoor-excellence",
      description:
        "State-of-the-art climate control & architectural indoor solutions engineered for comfort.",
      indoorImage: "/indoor.jpg",
    },
    {
      id: "sample-2",
      name: "Architectural Lighting",
      slug: "architectural-lighting",
      description:
        "Intelligent lighting fixtures designed to elevate residential and commercial spaces.",
      outdoorImage: "/outdoor.jpg",
    },
    {
      id: "sample-3",
      name: "Smart Automation",
      slug: "smart-automation",
      description:
        "Seamless luxury home automation and connected living ecosystems.",
      dropdownImage: "/ad.png",
    },
    {
      id: "sample-4",
      name: "Outdoor Living",
      slug: "outdoor-living",
      description:
        "Premium weather-resistant equipment designed for durability and modern style.",
      dropdownImage: "/adr.png",
    },
  ];

  const allBrands: Partial<IBrand>[] =
    displayBrands.length >= 4
      ? displayBrands
      : [...displayBrands, ...sampleBrands.slice(displayBrands.length)];

  // Duplicate list to create a seamless 100% infinite vertical loop
  const marqueeBrands = [...allBrands, ...allBrands];

  if (!mounted) {
    return (
      <section className="w-full bg-white dark:bg-zinc-950 py-16 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 py-2">
            {/* Title matching other sections */}
            <Title
              title="Brands We Represent"
              className="!text-left"
              wrapperClassName="!mx-0 !text-left !max-w-none"
            />
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-lg">
              Brands that excel in their respective categories. Discover our
              curated portfolio engineered for modern spaces.
            </p>

            <TransitionLink
              href="/brands"
              className="flex justify-start h-fit w-fit"
            >
              <Button className="flex items-center gap-2 cursor-pointer">
                Explore Brands
                <Icon
                  icon="ant-design:arrow-right-outlined"
                  className="text-lg"
                />
              </Button>
            </TransitionLink>
          </div>

          {/* Right Column: Continuous Vertical Moving Ticker */}
          <div
            className="lg:col-span-7 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="relative h-[500px] sm:h-[560px] lg:h-[600px] overflow-hidden py-2"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
              }}
            >
              <div
                className="flex flex-col gap-5 lg:gap-6 animate-vertical-scroll"
                style={{
                  animation: `verticalScroll ${Math.max(allBrands.length * 6, 22)}s linear infinite`,
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              >
                {marqueeBrands.map((brand, idx) => (
                  <TransitionLink
                    key={`${brand.id || brand.slug || "brand"}-${idx}`}
                    href={`/brand/${brand.slug || "brand"}`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="group bg-zinc-50 dark:bg-zinc-900/90 rounded-3xl p-6 sm:p-7 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5 shrink-0 min-h-[220px]"
                  >
                    {/* Image on Left Side */}
                    <div className="w-full sm:w-[42%] h-40 sm:h-44 rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 relative shadow-sm shrink-0">
                      <img
                        src={getBrandImage(brand)}
                        alt={brand.name || "Brand"}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>

                    {/* Text Content on Right Side */}
                    <div className="space-y-3 z-10 w-full sm:max-w-[55%] flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                          {brand.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                          {brand.description ||
                            "Leading innovator in category excellence and modern design."}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center text-xs sm:text-sm font-semibold text-primary group-hover:underline">
                        <span>Explore Collection</span>
                        <Icon
                          icon="lucide:arrow-up-right"
                          className="size-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </div>
                    </div>
                  </TransitionLink>
                ))}
              </div>
            </div>

            <style jsx global>{`
              @keyframes verticalScroll {
                0% {
                  transform: translateY(0%);
                }
                100% {
                  transform: translateY(-50%);
                }
              }
              .animate-vertical-scroll:hover,
              .animate-vertical-scroll:hover * {
                animation-play-state: paused !important;
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
}
