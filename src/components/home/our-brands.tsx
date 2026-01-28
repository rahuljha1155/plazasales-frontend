"use client"
import { HoverSlider, HoverSliderImage, HoverSliderImageWrap, TextStaggerHover } from "./animated-slideshow"
import Title from "./title"
import { TransitionLink } from "../shared"
import { useBrandStore } from "@/store/useBrandStore"
import { useEffect, useState } from "react"

export default function HoverSliderDemo() {
    const [mounted, setMounted] = useState(false)
    const { brands, fetchBrands } = useBrandStore();

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && brands.length === 0) {
            fetchBrands();
        }
    }, [brands.length, fetchBrands, mounted]);

    if (!mounted) {
        return (
            <div className="md:min-h-svh place-content-center p-6 px-4 py-8 md:py-12 lg:py-20 md:px-12 bg-muted/80">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-3">
                    <div className="lg:mx-auto text-center">
                        <Title title="Brands We Represent" />
                        <p className='text-sm md:text-lg mt-1 lg:mt-3 text-center'>Brands that excel in their respective categories.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <HoverSlider className="md:min-h-svh place-content-center p-6 px-4 py-8 md:py-12 lg:py-20 md:px-12 bg-muted/80">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-3">
                <div className="lg:mx-auto text-center">
                    <Title title="Brands We Represent" />
                    <p className='text-sm md:text-lg mt-1 lg:mt-3 text-center'>Brands that excel in their respective categories.</p>
                </div>
            </div>

            <div className="flex mt-10 md:mt-20  items-center justify-center md:justify-center gap-6 md:gap-12">
                <div className="flex  flex-col items-center md:items-start space-y-2 md:space-y-4   ">
                    {brands?.map((slide, index) => (
                        <TransitionLink key={slide.name} href={`/brand/${slide.slug}`}>
                            <TextStaggerHover
                                index={index}
                                className="cursor-pointer text-2xl md:text-3xl font-bold uppercase tracking-tighter"
                                text={slide.name}
                                style={{
                                    color: slide?.themeColor || ""
                                }}

                            />
                        </TransitionLink>
                    ))}
                </div>
                <HoverSliderImageWrap className=" hidden max-w-xl md:grid">
                    {brands?.map((slide, index) => (
                        <div key={slide.id} className="  ">
                            <HoverSliderImage
                                index={index}
                                src={slide.brandImageUrls[0]}
                                alt={slide.name}
                                className="size-full rounded-lg max-h-96 object-cover"
                                loading="eager"
                                decoding="async"
                            />
                        </div>
                    ))}
                </HoverSliderImageWrap>
            </div>
        </HoverSlider>
    )
}