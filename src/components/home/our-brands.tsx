"use client";

import {
  HoverSlider,
  TextStaggerHover,
  useHoverSliderContext,
} from "./animated-slideshow";
import Title from "./title";
import { TransitionLink } from "../shared";
import { useBrandStore } from "@/store/useBrandStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { IBrand } from "@/types/IBrand";

// Right side vertical accordion component using the HoverSlider context
function BrandAccordionGallery({ displayBrands }: { displayBrands: IBrand[] }) {
  const { activeSlide, changeSlide } = useHoverSliderContext();
  const isAnyActive = activeSlide !== null;

  return (
    <div className="hidden md:flex w-full max-w-2xl h-96 gap-2 p-2 rounded-lg overflow-hidden">
      {displayBrands.map((brand, index) => {
        const isActive = activeSlide === index;
        const brandImg =
          (brand.brandImageUrls && brand.brandImageUrls[0]) ||
          brand.indoorImage ||
          brand.outdoorImage ||
          brand.logoUrl ||
          "";

        return (
          <motion.div
            key={brand.id || brand.slug || index}
            onMouseEnter={() => changeSlide(index)}
            onClick={() => changeSlide(index)}
            layout
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
            }}
            className={`relative rounded-md overflow-hidden cursor-pointer select-none transition-all duration-500 ${
              isAnyActive
                ? isActive
                  ? "flex-[100%] opacity-100"
                  : "flex-0 w-0 opacity-0 pointer-events-none overflow-hidden"
                : "flex-1"
            }`}
          >
            {/* Background Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brandImg}
              alt={brand.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isActive
                  ? "scale-100"
                  : "scale-100 filter grayscale brightness-75 hover:grayscale-0 hover:brightness-100"
              }`}
              loading="eager"
            />

            {/* Vertical Brand Name Overlay (Visible when no slide is active) */}
            <AnimatePresence>
              {!isAnyActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/30"
                >
                  <span className="text-white text-sm lg:text-base font-extrabold uppercase tracking-widest whitespace-nowrap -rotate-90 drop-shadow-md select-none">
                    {brand.name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expanded Active Card Info */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 p-6 flex flex-col justify-end text-white z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                >
                  <div className="space-y-2">
                    <h3
                      className="text-xl lg:text-3xl font-extrabold uppercase tracking-wide"
                      style={{ color: brand.themeColor ? brand.themeColor : "#ffffff" }}
                    >
                      {brand.name}
                    </h3>

                    {brand.description && (
                      <p className="text-xs md:text-sm text-zinc-200 line-clamp-2 max-w-md leading-relaxed">
                        {brand.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

function BrandSectionContent({ displayBrands }: { displayBrands: IBrand[] }) {
  const { changeSlide } = useHoverSliderContext();

  return (
    <div
      onMouseLeave={() => changeSlide(null)}
      className="flex mt-10 md:mt-20 items-center justify-center md:justify-center gap-6 md:gap-12"
    >
      {/* Left Side: Original TextStaggerHover List */}
      <div className="flex flex-col items-center md:items-start space-y-2 md:space-y-4">
        {displayBrands.map((slide, index) => (
          <TransitionLink key={slide.name || index} href={`/brand/${slide.slug}`}>
            <TextStaggerHover
              index={index}
              className="cursor-pointer text-2xl md:text-3xl font-bold uppercase tracking-wider"
              text={slide.name}
              style={{
                color: slide?.themeColor || "",
              }}
            />
          </TransitionLink>
        ))}
      </div>

      {/* Right Side: Vertical Accordion Slices */}
      <BrandAccordionGallery displayBrands={displayBrands} />
    </div>
  );
}

export default function HoverSliderDemo() {
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

  if (!mounted || displayBrands.length === 0) {
    return null;
  }

  return (
    <HoverSlider className="md:min-h-svh place-content-center p-6 px-4 py-8 md:py-12 lg:py-20 md:px-12">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-3">
        <div className="lg:mx-auto text-center">
          <Title title="Brands We Represent" />
          <p className="text-sm md:text-lg mt-1 lg:mt-3 text-center">
            Brands that excel in their respective categories.
          </p>
        </div>
      </div>

      <BrandSectionContent displayBrands={displayBrands} />
    </HoverSlider>
  );
}
