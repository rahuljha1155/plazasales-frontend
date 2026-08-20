"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useBrandStore } from "@/store/useBrandStore";
import { IBrand } from "@/types/IBrand";
import { TransitionLink } from "../shared";
import Title from "./title";

const getBrandLogo = (brand: IBrand) => {
  return (
    brand.logoUrl ||
    (brand.brandImageUrls && brand.brandImageUrls[0]) ||
    brand.dropdownImage ||
    brand.indoorImage ||
    brand.outdoorImage ||
    ""
  );
};

export default function NewBrands() {
  const [mounted, setMounted] = useState(false);
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

  if (!mounted) {
    return (
      <section className="w-full bg-white py-16 px-4 md:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </section>
    );
  }

  // Split brands into 2 rows for the staggered offset layout
  const midPoint = Math.ceil(displayBrands.length / 2);
  const row1 = displayBrands.slice(0, midPoint);
  const row2 = displayBrands.slice(midPoint);

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        {/* Title & Subtitle */}
        <div className="text-center space-y-3">
          <Title title="Brands We Represent" />
          <p className="text-sm md:text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
            Brands that excel in their respective categories.
          </p>
        </div>

        {/* Staggered Honeycomb Logo Grid */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
          {/* Row 1 */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full">
            {row1.map((brand, index) => {
              const logo = getBrandLogo(brand);

              return (
                <motion.div
                  key={brand.id || brand.slug || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <TransitionLink
                    href={`/brand/${brand.slug}`}
                    className="group relative flex items-center justify-center w-[150px] sm:w-[190px] md:w-[230px] lg:w-[250px] h-[90px] sm:h-[110px] md:h-[130px] bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:border-zinc-300 transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-6"
                  >
                    {logo ? (
                      <img
                        src={logo}
                        alt={brand.name}
                        className="max-h-12 sm:max-h-16 md:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-sm sm:text-base font-extrabold text-zinc-800 uppercase tracking-wide text-center">
                        {brand.name}
                      </span>
                    )}
                  </TransitionLink>
                </motion.div>
              );
            })}
          </div>

          {/* Row 2 (Staggered / Offset with accent circle) */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full">
            {row2.map((brand, index) => {
              const logo = getBrandLogo(brand);

              return (
                <motion.div
                  key={brand.id || brand.slug || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                >
                  <TransitionLink
                    href={`/brand/${brand.slug}`}
                    className="group relative flex items-center justify-center w-[150px] sm:w-[190px] md:w-[230px] lg:w-[250px] h-[90px] sm:h-[110px] md:h-[130px] bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:border-zinc-300 transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-6"
                  >
                    {logo ? (
                      <img
                        src={logo}
                        alt={brand.name}
                        className="max-h-12 sm:max-h-16 md:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-sm sm:text-base font-extrabold text-zinc-800 uppercase tracking-wide text-center">
                        {brand.name}
                      </span>
                    )}
                  </TransitionLink>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
