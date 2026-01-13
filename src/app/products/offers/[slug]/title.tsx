"use client"
import { useAdsStore } from '@/store/useAdsStore';
import React from 'react'

export default function AdTitle() {
  const { selectedAd } = useAdsStore();
  return (
    <h1 className="text-3xl md:text-3xl font-bold mb-1">
        {selectedAd?.title || "Special Offer Products"}
        </h1>
  )
}
