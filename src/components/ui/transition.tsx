"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type BackgroundTransitionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function BackgroundTransition({
  children,
  className = "",
}: BackgroundTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !gradientRef.current) return;

    const ctx = gsap.context(() => {
      const targetSection =
        containerRef.current?.querySelector<HTMLElement>("[data-gradient-target]");

      if (targetSection) {
        gsap.to(gradientRef.current, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: targetSection,
            start: "top 85%",
            end: "top 25%",
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`relative bg-white ${className}`}>
      {/* Red to Black Gradient layer that smoothly fades in as you scroll down */}
      <div
        ref={gradientRef}
        className="absolute inset-0 bg-gradient-to-r from-[#DA2127] to-[#000000] opacity-0 pointer-events-none z-0"
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
