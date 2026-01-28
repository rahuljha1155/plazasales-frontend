"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Title from '../home/title';
import { useBrandStore } from '@/store/useBrandStore';
import { TransitionLink } from '../shared';

const InteractiveSelector = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  const { brands, fetchBrands } = useBrandStore();

  useEffect(() => {
    if (brands.length === 0) {
      fetchBrands();
    }
  }, [brands, fetchBrands]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    const timeout = setTimeout(() => {
      handleOptionClick(index);
    }, 50);

    setHoverTimeout(timeout);
  };

  useEffect(() => {
    if (!mounted) return;

    const timers: NodeJS.Timeout[] = [];

    brands?.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [mounted, brands]);

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <div className="relative py-12 md:py-28 px-4 xl:px-0 flex h-full min-h-screen flex-col items-center justify-center bg-muted/50 font-sans text-zinc-800">
      {/* Header Section */}
      <div className="w-full mx-auto md:text-center mb-2">
        <Title
          wrapperClassName="!mb-1 text-center w-full"
          className="mb-0! text-black dark:text-white pb-0!"
          title="We&apos;re Your Growth Partners."
        />
        <p className="mt-2 text-sm text-center! md:text-xl text-zinc-700 font-medium mx-auto animate-fadeInTop delay-600">
          Discover luxurious camping experiences in nature&apos;s most breathtaking spots.
        </p>
      </div>

      {brands && brands.length > 0 && (
        <>
          {/* Desktop Interactive Selector - Hidden on mobile */}
          <div className="hidden md:flex options mt-14 w-full rounded-md max-w-7xl min-w-[600px] h-[500px] mx-0 items-stretch overflow-hidden relative">
            {brands?.map((option, index) => (
              <div
                key={index}
                className="option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out"
                style={{
                  backgroundImage: `linear-gradient(rgb(0, 0, 0, 0.4), rgb(0, 0, 0, 0.4)),url('${option.brandImageUrls[0]}')`,
                  backgroundSize: activeIndex === index ? 'auto 100%' : 'auto 120%',
                  backgroundPosition: 'center',
                  backfaceVisibility: 'hidden',
                  opacity: mounted && animatedOptions.includes(index) ? 1 : 0,
                  transform: mounted && animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-60px)',
                  minWidth: '60px',
                  minHeight: '100px',
                  margin: 0,
                  cursor: 'pointer',
                  backgroundColor: '#18181b',
                  boxShadow: activeIndex === index
                    ? '0 20px 60px rgba(0,0,0,0.50)'
                    : '0 10px 30px rgba(0,0,0,0.30)',
                  flex: activeIndex === index ? '7 1 0%' : '1 1 0%',
                  zIndex: activeIndex === index ? 10 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  overflow: 'hidden',
                  willChange: 'flex-grow, box-shadow, background-size, background-position',
                }}
                onMouseEnter={() => handleMouseEnter(index)}
              >
                <div
                  className="shadow absolute left-0 right-0 pointer-events-none transition-all duration-700 z-20 ease-in-out"
                  style={{
                    bottom: activeIndex === index ? '0' : '-40px',
                    height: '120px',
                  }}
                />

                <div className="label absolute left-0 right-0 bottom-5 flex items-center justify-start h-12 z-2 pointer-events-none p-4 pb-10 gap-3 w-full">
                  <TransitionLink
                    href={`/brand/${option.slug}`}
                    className="icon size-16 shrink-0 bg-white rounded-full p-2 flex items-center justify-center grow-0 transition-all duration-200"
                  >
                    <Image
                      src={option.logoUrl}
                      alt={option.name}
                      width={200}
                      height={200}
                      className="object-contain w-20"
                    />
                  </TransitionLink>
                  <div className="info text-white whitespace-pre relative">
                    <div
                      className="main font-bold text-2xl transition-all duration-700 ease-in-out"
                      style={{
                        opacity: activeIndex === index ? 1 : 0,
                        transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                      }}
                    >
                      {option.name}
                    </div>
                    <div
                      className="sub text-base transition-all duration-700 ease-in-out"
                      style={{
                        opacity: activeIndex === index ? 1 : 0,
                        transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                      }}
                    >
                      {option.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Grid - Hidden on desktop */}
          <div className="md:hidden w-full mt-8 grid grid-cols-1 gap-4 max-w-md mx-auto">
            {brands?.slice(0, 4).map((option, index) => (
              <div
                key={index}
                className="relative flex flex-col justify-end overflow-hidden rounded-lg h-[200px]"
                style={{
                  backgroundImage: `linear-gradient(rgb(0, 0, 0, 0.4), rgb(0, 0, 0, 0.4)),url('${option.brandImageUrls[0]}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="p-4 flex items-center gap-3">
                  <TransitionLink
                    href={`/brand/${option.slug}`}
                    className="icon size-16 shrink-0 bg-white rounded-full p-2 flex items-center justify-center grow-0 transition-all duration-200"
                  >
                    <Image
                      src={option.logoUrl}
                      alt={option.name}
                      width={200}
                      height={200}
                      className="object-contain w-20"
                    />
                  </TransitionLink>
                  <div className="text-white">
                    <div className="font-bold">{option.name}</div>
                    <div className="text-xs">{option.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InteractiveSelector;
