"use client";
import React from "react";
import {
    EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { NextButton, PrevButton, usePrevNextButtons } from "./embla-carousel/embla-buttons";
import { useDotButton } from "./embla-carousel/embla-dots";
import Image from "next/image";
import { IBlog } from "@/types/IBlog";
import { TransitionLink } from "../shared";
import { Icon } from "@iconify/react";

type PropType = {
    slides: IBlog[];
    options?: EmblaOptionsType;
};

const BlogsCarousel: React.FC<PropType> = ({ slides, options }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({
            delay: 3000,
        }),
    ]);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    return (
        <div className="embla  overflow-hidden mx-auto ">
            {/* Viewport */}
            <div className="overflow-hidden  relative" ref={emblaRef}>
                <div className="flex relative touch-pan-y  w-full ">
                    {slides.map((data, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_90%]  w-full pl-2 -translate-x-1.5 min-w-0 transform-gpu"
                        >
                            <div className=" pb-4   overflow-hidden">
                                <TransitionLink href={`/blogs/${data.slug}`}>
                                    <div className="flex flex-col ">
                                        <div className="h-[30dvh] rounded-md overflow-hidden  relative">
                                            <Image
                                                src={data?.coverImage || '/placeholder-image.png'}
                                                alt="Slide image"
                                                fill
                                                quality={90}
                                                sizes="90vw"
                                                className="  object-cover "
                                            />
                                        </div>
                                        <div className=" py-2">
                                            <h2 className="font-semibold md:text-lg line-clamp-2">{data.title}</h2>
                                            <button className='mt-1 md:mt-4 group-hover:text-primary font-medium text-lg flex gap-2 items-center text-primary lg:text-zinc-800 transition-colors'>
                                                Read <Icon icon="tabler:arrow-right" className="size-5" />
                                            </button>
                                        </div>
                                    </div>
                                </TransitionLink>
                            </div>
                        </div>
                    ))}
                </div>


            </div>

            {/* Controls */}
        </div>
    );
};

export default BlogsCarousel;
