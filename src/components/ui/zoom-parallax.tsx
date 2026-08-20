'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { GalleryItem } from '../home/zoom';

interface ZoomParallaxProps {
  images: GalleryItem[];
}

interface DisplayImage {
  id: string;
  url: string;
  title: string;
}

const FALLBACK_IMAGES: DisplayImage[] = [
  { id: 'fb-1', url: '/feature/indoor.jpg', title: 'Indoor Experience' },
  { id: 'fb-2', url: '/feature/outdoor.jpg', title: 'Outdoor Security' },
  { id: 'fb-3', url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80', title: 'Surveillance Tech' },
  { id: 'fb-4', url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80', title: 'Smart Home IoT' },
  { id: 'fb-5', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80', title: 'AIoT Systems' },
  { id: 'fb-6', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80', title: 'Enterprise Wi-Fi' },
  { id: 'fb-7', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', title: 'Industrial Safety' },
  { id: 'fb-8', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', title: 'Office Automation' },
];

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Extract up to 8 images dynamically from API response
  const displayImages: DisplayImage[] = useMemo(() => {
    const list: DisplayImage[] = [];

    if (images && images.length > 0) {
      images.forEach((gallery, gIdx) => {
        if (gallery.sideImages && Array.isArray(gallery.sideImages)) {
          gallery.sideImages.forEach((imgUrl, sIdx) => {
            if (imgUrl && list.length < 8) {
              list.push({
                id: `g-${gIdx}-side-${sIdx}`,
                url: imgUrl,
                title: `Plaza Experience ${list.length + 1}`,
              });
            }
          });
        }
      });
    }

    // Always ensure exactly 8 images so grid has 4 left + 4 right
    while (list.length < 8) {
      const fb = FALLBACK_IMAGES[list.length % FALLBACK_IMAGES.length];
      list.push({
        id: `fb-${list.length}-${fb.id}`,
        url: fb.url,
        title: fb.title,
      });
    }

    return list.slice(0, 8);
  }, [images]);

  const leftImages = useMemo(() => displayImages.slice(0, 4), [displayImages]);
  const rightImages = useMemo(() => displayImages.slice(4, 8), [displayImages]);

  if (displayImages.length === 0) {
    return null;
  }

  const isLeftHovered = hoveredIndex !== null && hoveredIndex < 4;
  const isRightHovered = hoveredIndex !== null && hoveredIndex >= 4;
  const activeImage = hoveredIndex !== null ? displayImages[hoveredIndex] : null;

  return (
    <div
      onMouseLeave={() => setHoveredIndex(null)}
      className="w-full max-w-7xl mx-auto px-4 xl:px-0 py-4 select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-center">
        {/* LEFT SIDE BLOCK */}
        <div className="w-full">
          {isRightHovered && activeImage ? (
            /* When hovering an item on RIGHT side, LEFT side becomes 1 BIG featured image */
            <div className="relative h-[376px] sm:h-[416px] md:h-[464px] w-full border border-zinc-200 dark:border-zinc-800 rounded-md md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs bg-zinc-50 dark:bg-zinc-900/60">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeImage.url}
                    alt="Featured Experience"
                    fill
                    quality={95}
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain object-center p-3 md:p-6"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Default or Left-Hovered: 2x2 Grid of 4 Left Images */
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {leftImages.map((imgItem, idx) => {
                const globalIndex = idx;
                return (
                  <div
                    key={imgItem.id}
                    onMouseEnter={() => setHoveredIndex(globalIndex)}
                    className="relative h-[180px] sm:h-[200px] md:h-[220px] border border-zinc-200 dark:border-zinc-800 rounded-md md:rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer shadow-xs bg-zinc-50 dark:bg-zinc-900/60 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg"
                  >
                    <Image
                      src={imgItem.url}
                      alt="Plaza Experience"
                      fill
                      quality={90}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain object-center p-2.5 md:p-4"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDE BLOCK */}
        <div className="w-full">
          {isLeftHovered && activeImage ? (
            /* When hovering an item on LEFT side, RIGHT side becomes 1 BIG featured image */
            <div className="relative h-[376px] sm:h-[416px] md:h-[464px] w-full border border-zinc-200 dark:border-zinc-800 rounded-md md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs bg-zinc-50 dark:bg-zinc-900/60">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeImage.url}
                    alt="Featured Experience"
                    fill
                    quality={95}
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain object-center p-3 md:p-6"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Default or Right-Hovered: 2x2 Grid of 4 Right Images */
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {rightImages.map((imgItem, idx) => {
                const globalIndex = 4 + idx;
                return (
                  <div
                    key={imgItem.id}
                    onMouseEnter={() => setHoveredIndex(globalIndex)}
                    className="relative h-[180px] sm:h-[200px] md:h-[220px] border border-zinc-200 dark:border-zinc-800 rounded-md md:rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer shadow-xs bg-zinc-50 dark:bg-zinc-900/60 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg"
                  >
                    <Image
                      src={imgItem.url}
                      alt="Plaza Experience"
                      fill
                      quality={90}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain object-center p-2.5 md:p-4"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

