"use client"
import { IGalleryItem, Product } from '@/types/IProductBySlug'
import Image from 'next/image'
import ContactModal from '@/components/dialog/contact-modal';
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { NextButton, PrevButton, usePrevNextButtons } from "@/components/home/embla-carousel/embla-buttons";


export default function ImagesPreview({ slides, defaultImage, product }: { slides: IGalleryItem[], defaultImage: string | null, product: Product | undefined }) {

  const options: EmblaOptionsType = { loop: true };
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  // Flatten all media assets from nested arrays
  const allMediaAssets = slides?.flatMap(slide => slide.mediaAsset || []) || [];

  // Determine grid columns based on number of media assets
  const getGridCols = () => {
    const count = allMediaAssets?.length || 0;
    if (count >= 4) return 'lg:grid-cols-4';
    if (count === 3) return 'lg:grid-cols-3';
    if (count === 2) return 'lg:grid-cols-2';
    return 'lg:grid-cols-1';
  };


  if (allMediaAssets?.length === 0) return (
    <>
      <div className="h-64 sm:h-80 md:h-96 px-4 relative overflow-hidden border rounded-sm">
        <Image src={defaultImage || "/brokenimg.jpg"} fill alt='gallery' className='object-contain' sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      </div>

      <div className="flex justify-end items-end mt-4">
        <ContactModal productData={product} btnClassName="rounded-full py-2 text-sm! sm:text-base lg:hidden flex justify-center items-center" />
      </div>
    </>
  )

  return (
    <div className='w-full overflow-hidden'>
      {/* Embla Carousel - visible up to lg screen */}
      <div className="relative lg:hidden w-full">
        <div className="overflow-hidden rounded-sm w-full" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {allMediaAssets.map((media, index) => (
              <div
                key={media.id || index}
                className="flex-[0_0_100%] min-w-0"
              >
                <div className="embla__slide__inner h-64 sm:h-80 md:h-96 relative overflow-hidden rounded-sm border transition-transform duration-300">
                  {media?.type === "IMAGE" ? (
                    <Image
                      src={media.fileUrl || '/brokenimg.jpg'}
                      alt={`Product Image ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      quality={95}
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <video
                      src={media.fileUrl}
                      className="w-full h-full object-contain p-2"
                      controls
                      preload="metadata"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {allMediaAssets.length > 1 && (
          <div className="absolute inset-0 z-50 pointer-events-none flex justify-between items-center px-2">
            <div className="pointer-events-auto">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
                className='text-primary!'
              />
            </div>
            <div className="pointer-events-auto">
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
                className='text-primary!'
              />
            </div>
          </div>
        )}
      </div>

      <div className={`hidden lg:grid gap-4 ${getGridCols()}`}>
        {allMediaAssets?.map((media, index) => (
          <div
            key={media.id || index}
            className="h-64 xl:h-80 relative overflow-hidden rounded-sm border transition-transform duration-300 hover:scale-[1.02]"
          >
            {media?.type === "IMAGE" ? (
              <>
                <Image
                  src={media.fileUrl || '/brokenimg.jpg'}
                  alt={`Product Image ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 25vw, 33vw"
                  quality={95}
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </>
            ) : (
              <video
                src={media.fileUrl}
                className="w-full h-full object-contain p-2"
                controls
                preload="metadata"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end items-end mt-4">
        <ContactModal productData={product} btnClassName="rounded-full py-2 text-sm! sm:text-base lg:hidden flex justify-center items-center" />
      </div>

    </div>
  )
}
