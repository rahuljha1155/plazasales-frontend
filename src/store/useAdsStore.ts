import { IAd } from "@/types/IAd";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAdsStore = create<{
    selectedAd: IAd | null;
    setSelectedAd: (adId: IAd | null) => void;
}>()(
    persist(
        (set) => ({
            selectedAd: null,
            setSelectedAd: (adId) => set({ selectedAd: adId }),
        }),
        {
            name: "ads-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);