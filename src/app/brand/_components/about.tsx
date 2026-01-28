"use client"

import { Button } from "@/components/ui/button";
import { IBrand } from "@/types/IBrand";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Title from "@/components/home/title";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BookDemoModal from "@/components/dialog/demo-request";
import DOMPurify from 'dompurify';
import { useEffect, useState } from "react";

export default function BrandAbout({ brand }: { brand: IBrand }) {
  const pathname = usePathname()

  const [sanitizedDescription, setSanitizedDescription] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    setSanitizedDescription(DOMPurify.sanitize(brand?.description?.trim() || ""));
  }, [brand?.description, mounted])

  if (!brand) return null

  return (
    <div className="grid py-10 md:py-12 lg:py-20 max-w-7xl lg:grid-cols-2 gap-10 items-center  mx-auto">
      <div className="space-y-2 sm:space-y-3">
        <div className="space-y-2">
          <div className="mt-4">
            <Title wrapperClassName={"!mx-0 !mb-0 text-left"} title={"Our Identity as " + brand?.name} />
          </div>
        </div>
        {mounted && sanitizedDescription && (
          <div
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            className="text-sm sm:text-[16px] text-center lg:text-left leading-relaxed"
          />
        )}

        <div className="flex gap-5 mt-6 justify-center lg:justify-start  items-center flex-wrap">
          {
            !pathname.includes('/forward') ? (
              <Link href={`/brand/${brand.slug}/products`}>
                <Button >
                  <span className="relative z-10 flex items-center gap-2">
                    View Products
                    <Icon icon="tabler:arrow-right" className="size-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            ) : (
              <BookDemoModal />
            )
          }
        </div>
      </div>


      <div className="w-full h-full rounded-md overflow-hidden   relative group">
        <Image
          src={brand?.brandImageUrls[0] || '/placeholder-image.png'}
          width={1200}
          height={1200}
          className="size-60 md:size-80 lg:size-96 border aspect-square rounded-full object-cover  max-w-4xl mx-auto"
          alt="plaza sales"
        />
      </div>
    </div>
  )
}