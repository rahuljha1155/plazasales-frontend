"use client";

import React from "react";
import { IAd } from "@/types/IAd";
import AdBanner from "@/components/shared/ad-banner";

// Custom static advertisement images
const customPublicAds: IAd[] = [
  {
    id: "custom-ad-1",
    title: "Custom Advertisement",
    targetUrl: "/products",
    bannerUrls: ["/adr.png"],
    isActive: true,
  },
];

export default function Advertizement() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 xl:px-0 my-6 md:my-14">
      <AdBanner
        ads={customPublicAds}
        className="!mt-0 !mb-0 !h-32 sm:!h-44 md:!h-[300px] lg:!h-[360px] rounded-2xl md:rounded-3xl overflow-hidden shadow-md border border-zinc-200/80 dark:border-zinc-800/80"
      />
    </section>
  );
}
