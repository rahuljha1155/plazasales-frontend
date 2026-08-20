"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import TextCursorProximity from "@/components/ui/text-cursor-proximity";
import { ClassNameValue } from "tailwind-merge";

export default function Title({
  title,
  className = "",
  wrapperClassName = "",
  animation = true,
  colorFrom,
}: {
  title: string;
  className?: ClassNameValue;
  wrapperClassName?: ClassNameValue;
  animation?: boolean;
  colorFrom?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const defaultColor =
    colorFrom ||
    (String(className).includes("text-white")
      ? "white"
      : isDark
        ? "white"
        : "black");
  if (animation) {
    return (
      <>
        <div
          className={`max-w-4xl md:hidden block mx-auto ${wrapperClassName}`}
          ref={containerRef}
        >
          <h2
            className={`leading-none text-[22px] font-semibold sm:text-3xl text-center ${className}`}
          >
            {title || "title"}
          </h2>
        </div>
        <div
          className={`max-w-4xl hidden md:block mx-auto text-center ${wrapperClassName}`}
          ref={containerRef}
        >
          <TextCursorProximity
            label={title || "title"}
            className={`leading-none text-2xl sm:text-3xl ${className}`}
            styles={{
              transform: {
                from: "scale(1)",
                to: "scale(1.4)",
              },
              color: {
                from: defaultColor,
                to: "red",
              },
            }}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
          />
        </div>
      </>
    );
  }

  return (
    <div
      className={`max-w-4xl mx-auto text-center ${wrapperClassName}`}
      ref={containerRef}
    >
      <h2
        className={`leading-none text-[22px] font-bold sm:text-3xl md:text-4xl text-center ${className}`}
      >
        {title || "title"}
      </h2>
    </div>
  );
}
