"use client";
import React, { useEffect, useState, useMemo } from "react";
import Title from "./title";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/config/axios.config";

export interface GalleryResponse {
  status: number;
  message: string;
  data: GalleryData;
}

export interface GalleryData {
  galleries: GalleryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GalleryItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
  centerImage: string;
  sideImages: string[];
}

export default function ZOOMXZoom() {
  const [data, setData] = useState<GalleryResponse | null>(null);

  const fetchGallery = async (): Promise<void> => {
    try {
      const response = await api.get<GalleryResponse>(
        `/home-gallery/get-home-galleries`
      );
      setData(response.data);
    } catch {
      // Error handled silently
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Extract all available sideImages from galleries (excluding centerImage as requested)
  const allImages: string[] = useMemo(() => {
    const list: string[] = [];
    if (data?.data?.galleries && data.data.galleries.length > 0) {
      data.data.galleries.forEach((g) => {
        if (Array.isArray(g.sideImages)) {
          g.sideImages.forEach((img) => {
            if (img && typeof img === "string") list.push(img);
          });
        }
      });
    }
    return list;
  }, [data]);

  // Card image indices for the 5 grid slots: [left, centerTop, centerBottomLeft, centerBottomRight, right]
  const [cardIndices, setCardIndices] = useState<number[]>([0, 1, 2, 3, 4]);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);

  // Initialize slot indices when API images arrive
  useEffect(() => {
    if (allImages.length > 0) {
      setCardIndices([
        0 % allImages.length,
        1 % allImages.length,
        2 % allImages.length,
        3 % allImages.length,
        4 % allImages.length,
      ]);
    }
  }, [allImages]);

  // Every 2 seconds, change a RANDOM card slot to a unique unused image
  useEffect(() => {
    if (allImages.length <= 1) return;

    let lastSlot = -1;
    const timer = setInterval(() => {
      // Select a random slot (0 to 4) different from the previous step
      let randomSlot = Math.floor(Math.random() * 5);
      if (randomSlot === lastSlot) {
        randomSlot = (randomSlot + 1) % 5;
      }
      lastSlot = randomSlot;

      setActiveSlotIndex(randomSlot);
      setCardIndices((prevIndices) => {
        const updated = [...prevIndices];

        // Gather images currently visible on all OTHER card slots
        const activeImagesInUse = new Set(
          updated
            .map((idx, slot) => (slot !== randomSlot ? allImages[idx % allImages.length] : null))
            .filter(Boolean)
        );

        // Find the next image index that is NOT currently displayed on any other card
        let candidate = (updated[randomSlot] + 1) % allImages.length;
        let attempts = 0;
        while (activeImagesInUse.has(allImages[candidate]) && attempts < allImages.length) {
          candidate = (candidate + 1) % allImages.length;
          attempts++;
        }

        updated[randomSlot] = candidate;
        return updated;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [allImages]);

  if (allImages.length === 0) {
    return null;
  }

  // Active image for each of the 5 card slots
  const leftImage = allImages[cardIndices[0] % allImages.length] || allImages[0];
  const centerTopImage = allImages[cardIndices[1] % allImages.length] || allImages[0];
  const centerBottomLeftImage = allImages[cardIndices[2] % allImages.length] || allImages[0];
  const centerBottomRightImage = allImages[cardIndices[3] % allImages.length] || allImages[0];
  const rightImage = allImages[cardIndices[4] % allImages.length] || allImages[0];

  return (
    <main className="py-8 md:py-12 lg:py-16 w-full bg-white dark:bg-zinc-950">
      {/* Title Header */}
      <div className="relative px-4 xl:px-0 flex flex-col items-center justify-center mb-8 md:mb-12">
        <Title
          title="Focusing on Experience"
          wrapperClassName="text-center !mx-0 !mb-0 lg:mx-auto"
        />
        <p className="text-sm md:text-lg text-center text-zinc-600 dark:text-zinc-400 mt-1 lg:mt-3 max-w-2xl">
          We Focus on our customer experience through brand and quality service
        </p>
      </div>

      {/* Bento Box Gallery Container */}
      <div className="w-full max-w-7xl mx-auto px-4 xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5 h-auto md:h-[450px] lg:h-[500px]">
          {/* COLUMN 1: LEFT TALL CARD */}
          <div className="hidden md:block relative w-full h-[320px] md:h-full rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/60 group shadow-xs border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-2 md:p-3">
            <AnimatePresence initial={false}>
              <motion.div
                key={`left-${leftImage}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="absolute inset-0 w-full h-full p-2 md:p-3"
              >
                <Image
                  src={leftImage}
                  alt="Experience Left"
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain object-center p-1"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* COLUMN 2: CENTER SPLIT (TOP HORIZONTAL + BOTTOM 2 CARDS) */}
          <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 w-full h-[400px] md:h-full">
            {/* Center Top Horizontal Card */}
            <div className="relative w-full h-[180px] md:h-[48%] rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/60 group shadow-xs border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-2 md:p-3">
              <AnimatePresence initial={false}>
                <motion.div
                  key={`ctop-${centerTopImage}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1.0] }}
                  className="absolute inset-0 w-full h-full p-2 md:p-3"
                >
                  <Image
                    src={centerTopImage}
                    alt="Experience Center Top"
                    fill
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain object-center p-1"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Center Bottom Row (2 side-by-side cards) */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 flex-1 h-[200px] md:h-[48%]">
              {/* Bottom Left Card */}
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/60 group shadow-xs border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-2 md:p-3">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`cbotleft-${centerBottomLeftImage}`}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="absolute inset-0 w-full h-full p-2 md:p-3"
                  >
                    <Image
                      src={centerBottomLeftImage}
                      alt="Experience Center Bottom Left"
                      fill
                      quality={90}
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-contain object-center p-1"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Right Card */}
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/60 group shadow-xs border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-2 md:p-3">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`cbotright-${centerBottomRightImage}`}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="absolute inset-0 w-full h-full p-2 md:p-3"
                  >
                    <Image
                      src={centerBottomRightImage}
                      alt="Experience Center Bottom Right"
                      fill
                      quality={90}
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-contain object-center p-1"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* COLUMN 3: RIGHT TALL CARD */}
          <div className="hidden md:block relative w-full h-[320px] md:h-full rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/60 group shadow-xs border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-2 md:p-3">
            <AnimatePresence initial={false}>
              <motion.div
                key={`right-${rightImage}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="absolute inset-0 w-full h-full p-2 md:p-3"
              >
                <Image
                  src={rightImage}
                  alt="Experience Right"
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain object-center p-1"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* PAGINATION INDICATOR BAR */}
        <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
          {[0, 1, 2, 3, 4].map((slotIdx) => {
            const isActive = slotIdx === (activeSlotIndex === 0 ? 4 : activeSlotIndex - 1);
            return (
              <button
                key={`dot-${slotIdx}`}
                onClick={() => {
                  setCardIndices((prev) => {
                    const updated = [...prev];
                    updated[slotIdx] = (updated[slotIdx] + 1) % allImages.length;
                    return updated;
                  });
                }}
                aria-label={`Change card ${slotIdx + 1}`}
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-7 md:w-9 bg-primary"
                    : "w-3.5 md:w-4 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
                }`}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
