"use client";
import { Icon } from "@iconify/react";
import { TransitionLink } from "../shared";
import { Button } from "../ui/button";

export default function PlazaHero() {
  return (
    <main className=" min-h-full  lg:min-h-[65vh] py-16 lg:py-0 px-4 xl:px-0 grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl relative mx-auto overflow-hidden">
      <div className="lg:hidden absolute  inset-0 w-full h-full z-10 pointer-events-none">
        <img
          src="/home/globe.png"
          alt="globe image"
          className="size-full translate-y-1/2 object-contain animate-float select-none pointer-events-none"
        />
      </div>

      <div className="space-y-2  sm:space-y-8 relative z-40 flex flex-col items-center text-center lg:text-left lg:items-start justify-center">
        <div className="text-sm sm:text-base lg:text-lg text-center lg:text-left">
          From <span className="text-primary font-medium">indoor</span> to{" "}
          <span className="text-primary font-medium">outdoor</span> to{" "}
          <span className="text-primary font-medium">office</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center lg:text-left font-semibold leading-tight">
          Empowering B2B brands to lead their market.
        </h1>
        <div className="flex justify-center lg:justify-start gap-6 sm:gap-8 w-full mt-4 lg:mt-0 divide-x divide-zinc-300 dark:divide-zinc-700 md:pt-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-1 sm:gap-3 md:items-center md:justify-center sm:justify-start sm:pr-8 last:pr-0"
            >
              <span className="text-2xl md:text-4xl xl:text-6xl font-bold text-primary">
                {(idx + 1) * 12}
              </span>
              <p className="text-xs backdrop-blur-lg sm:text-sm lg:text-base text-muted-foreground max-w-[120px]  lg:text-left leading-tight">
                Years of experience
              </p>
            </div>
          ))}
        </div>

        <TransitionLink
          href="/products"
          className="flex mt-4 sm:mt-6 lg:mt-8 justify-center h-fit w-fit lg:justify-start"
        >
          <Button className="">
            Explore Products
            <Icon icon="ant-design:arrow-right-outlined" className="text-xl" />
          </Button>
        </TransitionLink>
      </div>
      <div className="hidden lg:flex justify-center items-center w-full relative">
        <img
          src="/home/globe.png"
          alt="globe image"
          className="size-[90%] object-contain animate-float select-none pointer-events-none"
        />
      </div>
    </main>
  );
}
