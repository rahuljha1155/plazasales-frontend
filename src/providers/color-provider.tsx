"use client";
import { BRANDS } from '@/data/brand';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'

export default function ColorProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const brand = BRANDS.find(b => b.name.toLowerCase() === pathname.split('/')[2]?.toLowerCase());

  useEffect(() => {
    // Skip color setting for product detail pages - handled by DetailsMain component
    if (pathname.includes('/products/')) {
      return;
    }

    if (pathname.includes('/brand')) {
      if (brand) {
        document.documentElement.style.setProperty('--primary', brand.color);
      }
      else {
        document.documentElement.style.setProperty('--primary', '#DA2B34');
      }
    }
    else {
      document.documentElement.style.setProperty('--primary', '#DA2B34');
    }
  }, [brand, pathname]);

  return (
    <>
      {children}
    </>
  )
}
