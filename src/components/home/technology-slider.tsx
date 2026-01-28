"use client"
import React, { useCallback, useEffect, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import type { EmblaOptionsType, EmblaCarouselType, EmblaEventType } from "embla-carousel"
import { DotButton, useDotButton } from "./embla-carousel/embla-dots"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"


const TWEEN_FACTOR_BASE = 0.2

type PropType = {
  slides: {
    title: string
    description: string
    imageUrl: string
  }[]
  options?: EmblaOptionsType
}

const TechnologySlider: React.FC<PropType> = ({ slides, options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ])
  const tweenFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  // const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
  //   usePrevNextButtons(emblaApi)

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) =>
      slideNode.querySelector("[data-parallax-layer]") as HTMLElement
    )
  }, [])

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenParallax = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine()
      const scrollProgress = emblaApi.scrollProgress()
      const slidesInView = emblaApi.slidesInView()
      const isScrollEvent = eventName === "scroll"

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress
        const slidesInSnap = engine.slideRegistry[snapIndex]

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target()
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target)
                diffToTarget =
                  sign === -1
                    ? scrollSnap - (1 + scrollProgress)
                    : scrollSnap + (1 - scrollProgress)
              }
            })
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100
          const tweenNode = tweenNodes.current[slideIndex]
          tweenNode.style.transform = `translateX(${translate}%)`
        })
      })
    },
    []
  )

  useEffect(() => {
    if (!emblaApi) return
    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenParallax(emblaApi)

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenParallax)
      .on("scroll", tweenParallax)
      .on("slideFocus", tweenParallax)
  }, [emblaApi, tweenParallax, setTweenNodes, setTweenFactor])

  return (
    <div className=" mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">
          {slides.map((data,index) => (
            <div key={index} className="flex-[0_0_60%] pl-4">
              <div className="rounded-2xl h-120 overflow-hidden">
                <div data-parallax-layer className="relative h-full w-full flex justify-center">
                  <Image
                    className="object-cover w-[120%] h-full"
                    src={data.imageUrl}
                    alt={data.title}
                    width={800}
                    height={600}
                  />
                </div>
              </div>
              <h2 className="text-3xl mt-4">{data.title}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">


        <div className="flex gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`w-4 h-4 rounded-full border ${
                index === selectedIndex ? "bg-primary border-primary" : "border-primary"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TechnologySlider
