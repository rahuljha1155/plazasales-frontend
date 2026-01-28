"use client";
import { Icon } from "@iconify/react";
import { TransitionLink } from "../shared";
import { Button } from "../ui/button";

export default function PlazaHero() {
  return (
    <main className="min-h-full lg:min-h-[65vh] py-16 lg:py-0 px-4 xl:px-0 grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl relative mx-auto overflow-hidden">
      <div className="lg:hidden absolute inset-0 w-full h-full z-10 pointer-events-none">
        <img
          src="/home/globe.png"
          alt="globe image"
          className="size-full translate-y-1/2 object-contain animate-float select-none pointer-events-none"
        />
      </div>

      <div className="space-y-2 sm:space-y-8 relative z-40 flex flex-col items-center text-center lg:text-left lg:items-start justify-center">
        <div className="text-sm sm:text-base lg:text-lg text-center lg:text-left">
          From <span className="text-primary font-medium">core</span> to{" "}
          <span className="text-primary font-medium">edge</span> to{" "}
          <span className=" font-medium">the full spectrum of it and electronics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-center lg:text-left font-semibold leading-tight">
          Empowering Productivity through better IT.
        </h1>
        <div className="flex justify-center lg:justify-start gap-3 sm:gap-6 w-full mt-4 lg:mt-0 divide-x divide-zinc-300 dark:divide-zinc-700 md:pt-4">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-center sm:items-center sm:pr-4">
            <span className="text-xl md:text-2xl xl:text-3xl font-bold text-primary">
              12
            </span>
            <p className="text-[10px] sm:text-xs text-center sm:text-left text-muted-foreground max-w-[80px] leading-tight">
              Years of Experience
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-center sm:items-center sm:pl-4 sm:pr-4">
            <span className="text-xl md:text-2xl xl:text-3xl font-bold text-primary">
              300+
            </span>
            <p className="text-[10px] sm:text-xs text-center sm:text-left text-muted-foreground max-w-[80px] leading-tight">
              Authorized Partners
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-center sm:items-center sm:pl-4">
            <span className="text-xl md:text-2xl xl:text-3xl font-bold text-primary">
              1000+
            </span>
            <p className="text-[10px] sm:text-xs text-center sm:text-left text-muted-foreground max-w-[80px] leading-tight">
              Product SKU Range
            </p>
          </div>
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
          className="size-[75%] xl:size-[80%] 2xl:size-[85%] max-w-[520px] object-contain animate-float select-none pointer-events-none"
        />
      </div>
    </main>
  );
}
