import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useBrandStore } from '@/store/useBrandStore'
import TransitionLink from './transition-link'
import { Button } from '../ui/button'

export default function NavbarDropdown({
  drapdownState,
  setDrapdownState,
  modalRef,
  pathname
}: {
  drapdownState: { isActive: boolean; idx: number | null }
  setDrapdownState: React.Dispatch<React.SetStateAction<{ isActive: boolean; idx: number | null }>>
  modalRef: React.RefObject<HTMLDivElement | null>
  pathname: string
}) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const { brands, isLoading, fetchBrands } = useBrandStore()

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Set initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
    if (activeCategory === null && brands.length > 0) {
      setActiveCategory(0)
    }
  }, [brands.length, activeCategory])

  useEffect(() => {
    if (brands.length === 0 && !isLoading && !useBrandStore.getState().hasFetched) {
      fetchBrands()
    }
  }, [brands.length, isLoading, fetchBrands])

  // Determine dropdown position based on pathname and scroll
  const getDropdownPosition = () => {
    const isBrandsPage = pathname.includes('/brand/') || pathname.startsWith('/products/')
    const isScrolled = scrollY > 100

    if (drapdownState.isActive) {
      if (isBrandsPage && !isScrolled) {
        return 'translate-y-16' // Move up 20px on brand pages when not scrolled
      }
      return 'translate-y-0' // Normal position
    }
    return '-translate-y-[120%]' // Hidden position
  }

  return (
    <>
      {/* Dropdown modal area */}
      <div
        className={`fixed hidden md:block inset-0 ${drapdownState.isActive ? "backdrop-blur-[8px] " : ""} pointer-events-none z-[210]`}
      >
        <div
          ref={modalRef}
          className={`min-h-[50dvh] w-[65dvw] mx-auto py-4 dark:bg-zinc-900 pointer-events-auto rounded-b-md transition-all duration-500 ${getDropdownPosition()}`}
        >
          <div className="grid p-5 bg-background mt-[4rem] rounded-2xl border border-primary/20 md:grid-cols-2 lg:grid-cols-11 gap-4 xl:gap-8">
            <div className="px-4 col-span-3 space-y-3">
              <h2 className="xl:text-xl font-semibold">Our Brands</h2>
              <ul className="space-y-1">
                {!mounted || isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <li key={idx} className="py-1 border border-zinc-200 rounded-full animate-pulse">
                      <div className="p-0.5 px-3 flex items-center justify-between">
                        <div className="h-[25px] w-24 bg-zinc-200 rounded"></div>
                        <div className="h-3 w-8 bg-zinc-200 rounded"></div>
                      </div>
                    </li>
                  ))
                ) : (
                  brands.map((brand, idx) => (
                    <li
                      className={`font-medium py-1 group border hover:border-primary rounded-full ${activeCategory === idx
                        ? "border-primary"
                        : "border-zinc-200"
                        } cursor-pointer transition-all duration-300`}
                      onMouseOver={() => setActiveCategory(idx)}
                      onClick={() => setDrapdownState({ isActive: false, idx: null })}
                      key={brand.id}
                      style={{
                        backgroundColor: brand.themeColor || '#ffffff'
                      }}
                    >
                      <TransitionLink
                        href={`/brand/${brand.slug}`}
                        className="!w-full p-0.5 px-3 justify-between items-center flex"
                      >
                        <Image
                          src={brand.logoUrl || '/brokenimg.jpg'}
                          alt={brand?.name || "Product"}
                          height={20}
                          width={100}
                          className="object-contain h-[20px] xl:h-[27px] w-fit p-1 brightness-0 invert"
                        />
                        <span
                          className='text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                          style={{
                            opacity: activeCategory === idx ? 1 : 0
                          }}
                        >
                          view
                        </span>
                      </TransitionLink>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="col-span-8 space-y-3">
              <h2 className="xl:text-xl font-semibold flex gap-6 items-center justify-between pr-4">
                {activeCategory !== null && brands[activeCategory]?.slug?.toLowerCase() === 'forward' ? 'About Forward' : 'Featured Products'}
                {activeCategory !== null && brands[activeCategory]?.popularProducts?.length > 0 && brands[activeCategory]?.slug?.toLowerCase() !== 'forward' && (
                  <TransitionLink href={`/brand/${brands[activeCategory]?.slug}/products`}>
                    <span className="flex gap-3 hover:text-primary items-center text-base font-normal">
                      See All <Icon icon="mingcute:arrow-right-line" className="w-4 h-4" />
                    </span>
                  </TransitionLink>
                )}
              </h2>
              <ul className="space-y-3 pr-4 grid grid-cols-3 gap-3!">
                {isLoading || activeCategory === null ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <li key={idx} className="border bg-white h-full rounded-xl p-2 border-zinc-300 animate-pulse">
                      <div className="bg-zinc-200 rounded-lg w-full aspect-[1/0.7]"></div>
                      <div className="mt-2 space-y-2">
                        <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                        <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
                      </div>
                    </li>
                  ))
                ) : brands[activeCategory]?.slug?.toLowerCase() === 'forward' ? (
                  <div className="col-span-3 ">
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      Discover our comprehensive range of UPS systems designed to provide reliable power protection for your business. From small offices to large data centers, Forward has the perfect solution.
                    </p>
                    <TransitionLink href={`/brand/${brands[activeCategory]?.slug}`}>
                      <Button variant={"link"} className='px-0 mx-0 md:px-0 md:mx-0! xl:px-0! xl:mx-0!'>
                        Learn More <Icon icon="tabler:arrow-right" className="w-4 h-4" />
                      </Button>
                    </TransitionLink>
                  </div>
                ) : (
                  brands[activeCategory]?.popularProducts
                    ?.slice(0, 3)
                    .map((data: any) => (
                      <TransitionLink
                        key={data.id}
                        href={`/products/${brands[activeCategory]?.slug}/${data?.category?.slug}/${data?.subcategory?.slug}/${data?.slug}`}
                      >
                        <div className="relative group cursor-pointer border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full max-w-[18.7rem] lg:min-w-full w-full">
                          {data?.ispopular && (
                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-primary to-primary/90 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full z-10 shadow-lg flex items-center gap-1">
                              <Icon icon="prime:star-fill" width="12" height="12" className="sm:w-[14px] sm:h-[14px]" />
                              <span className="hidden sm:block">Popular</span>
                            </div>
                          )}

                          <div className="flex flex-col h-full">
                            <div className="w-full! h-35 xl:h-45 bg-white border rounded-xl sm:rounded-2xl overflow-hidden relative">
                              <Image
                                src={data?.coverimage || data?.coverImage || "/brokenimg.jpg"}
                                alt={data?.title || data?.name || "Product"}
                                fill
                                quality={90}
                                sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-contain p-2"
                              />
                            </div>

                            <div className="mt-2 sm:mt-3 md:mt-4 flex-1 flex flex-col">
                              <h2 className="text-sm xl:text-base font-semibold group-hover:underline line-clamp-2 group-hover:text-primary transition-all duration-300">
                                {data?.title || data?.name}
                              </h2>
                              <h3 className="text-muted-foreground font-semibold mt-2 text-xs">{data?.model || "MEHB-EWFJ12"}</h3>
                              {data?.brand?.name && (
                                <div className="flex justify-between items-center mt-1">
                                  <div className="flex gap-1 sm:gap-2 items-center text-sm text-muted-foreground">
                                    <Icon icon="proicons:tag-multiple" className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="truncate">{data?.brand?.name || data?.brandName || "No Brand"}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TransitionLink>
                    ))
                )}

                {(typeof activeCategory === "number" && brands[activeCategory]?.popularProducts?.length === 0 && !isLoading && brands[activeCategory]?.slug?.toLowerCase() !== 'forward') && (
                  <p className="text-muted-foreground mt-10 col-span-3 text-center">No Featured products available.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}