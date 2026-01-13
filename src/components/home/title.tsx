"use client"

import { useRef } from "react"
import { useTheme } from "next-themes"
import TextCursorProximity from "@/components/ui/text-cursor-proximity"
import { ClassNameValue } from "tailwind-merge"


export default function Title({ title, className, wrapperClassName, animation = true }: { title: string, className?: ClassNameValue, wrapperClassName?: ClassNameValue, animation?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  if (animation) {
    return (
    <>

      <div
          className={`max-w-4xl md:hidden block mx-auto   ${wrapperClassName}`}
        ref={containerRef}
      >
        <h2
            className={`leading-none text-[22px] font-semibold will-change-transform sm:text-3xl    text-center ${className}`}
        >
          {title || "title"}
        </h2>
      </div>

      <div
        className={`max-w-4xl hidden md:block mx-auto text-center  ${wrapperClassName}`}
        ref={containerRef}
      >
        <TextCursorProximity
          label={title || "title"}
            className={`leading-none text-2xl will-change-transform sm:text-3xl    ${className}`}
          styles={{
            transform: {
              from: "scale(1)",
              to: "scale(1.4)",
            },
            color: {
              from: "black",
              to: isDark ? "red" : "red"
            },
          }}
          falloff="gaussian"
          radius={100}
          containerRef={containerRef as React.RefObject<HTMLDivElement>}
        />
      </div>
    </>
  )
  }

  return (
    <div
      className={`max-w-4xl md:hidden block mx-auto   ${wrapperClassName}`}
      ref={containerRef}
    >
      <h2
        className={`leading-none text-[22px] font-semibold will-change-transform sm:text-3xl   ${className}`}
      >
        {title || "title"}
      </h2>
    </div>
  )
}

