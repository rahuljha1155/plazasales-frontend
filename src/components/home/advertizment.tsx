"use client";

import React, { useEffect, useState } from "react";
import { adService } from "@/services/adService";
import { IAd } from "@/types/IAd";
import AdBanner from "@/components/shared/ad-banner";

export default function Advertizement() {
  const [ads, setAds] = useState<IAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await adService.getAds(1, 10);
        if (response?.data?.ads) {
          setAds(response.data.ads);
        }
      } catch {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 xl:px-0 my-8 md:my-14">
        <div className="w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-2xl md:rounded-3xl" />
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 xl:px-0 my-8 md:my-14">
      <AdBanner
        ads={ads}
        className="!mt-0 !mb-0 !h-[180px] sm:!h-[240px] md:!h-[300px] lg:!h-[360px] rounded-2xl md:rounded-3xl overflow-hidden shadow-md border border-zinc-200/80 dark:border-zinc-800/80"
      />
    </section>
  );
}
