"use client";
import  { useState, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import DOMPurify from "dompurify";
import BookDemoModal from "@/components/dialog/demo-request";
import { IProduct, IProductBySlugResponse } from "@/types/IProduct";
import { IAllProduct } from "@/services/productService";


interface PricingPackage {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingData {
  title: string;
  shortDesc: string;
  packages: PricingPackage[];
}

export const decodeHtml = (html: string) => {
  // Check if running in browser environment
  if (typeof document !== 'undefined') {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  }

  // Server-side fallback: decode common HTML entities manually
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

export default function Specifications({ 
  speficication, 
  productType,
  productData
}: { 
  speficication: string;
  productType?: string;
    productData?: IProductBySlugResponse;
}) {
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  if (!speficication) {
    return null;
  }

  const isServiceOrSaas = productType === "SAAS";
  let pricingData: PricingPackage[] | null = null;

  if (isServiceOrSaas) {
    try {
      const parsed = JSON.parse(speficication);
      // Handle both array format and old object format for backwards compatibility
      pricingData = Array.isArray(parsed) ? parsed : (parsed.packages || null);
    } catch (error) {
    }
  }



  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "hsla(0, 100%, 59%, 1.00)",
          "hsla(210, 100%, 64%, 1.00)",
          "hsla(120, 94%, 62%, 1.00)",
          "hsla(50, 100%, 58%, 1.00)",
          "hsla(330, 100%, 67%, 1.00)",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  // If it's a SERVICE/SAAS with valid pricing data, show pricing table
  if (isServiceOrSaas && pricingData && Array.isArray(pricingData)) {
    // Calculate max savings for display
    const maxSavings = Math.max(
      ...pricingData
        .filter(pkg => pkg.price && pkg.yearlyPrice)
        .map(pkg => {
          const monthly = parseFloat(pkg.price);
          const yearly = parseFloat(pkg.yearlyPrice);
          return monthly > 0 ? Math.round(((monthly - yearly) / monthly) * 100) : 0;
        })
    );

    return (
      <section className="py-8">
        <div className="text-center space-y-1 mb-6 md:mb-12">
          <h2 className=" leading-none text-[22px] font-semibold will-change-transform sm:text-3xl    text-center text-primary">
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground text-lg whitespace-pre-line max-w-6xl mx-auto">
            Select the perfect plan for your needs
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center md:mb-10">
          <label className="relative inline-flex items-center cursor-pointer">
            <Label>
              <Switch
                ref={switchRef}
                checked={!isMonthly}
                onCheckedChange={handleToggle}
                className="relative"
              />
            </Label>
          </label>
          <span className="ml-2 font-semibold">
            Annual billing{" "}
            {maxSavings > 0 && (
              <span className="text-primary">
                (Save up to {maxSavings}%)
              </span>
            )}
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="flex justify-center h-full items-center flex-wrap sm:2 gap-5">
          {pricingData.map((pkg, index) => {
            const monthlyPrice = parseFloat(pkg.price) || 0;
            const yearlyPrice = parseFloat(pkg.yearlyPrice) || 0;
            const displayPrice = isMonthly ? monthlyPrice : yearlyPrice;
            const isPopular = pkg.isPopular;

            const savings = monthlyPrice > 0 && yearlyPrice > 0
              ? Math.round(((monthlyPrice - yearlyPrice) / monthlyPrice) * 100)
              : 0;

            return (
              <motion.div
                key={index}
                whileInView={
                  isDesktop
                    ? {
                      y: (isPopular && pricingData.length >= 3) ? -20 : 0,
                        opacity: 1,
                      x: (index === 2 && pricingData.length >= 3) ? -30 : (index === 0 && pricingData.length >= 3) ? 30 : 0,
                        scale: index === 0 || index === 2 ? 0.94 : 1.0,
                      }
                    : {}
                }
                viewport={{ once: true }}
                transition={{
                  duration: 1.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 30,
                  delay: 0.4,
                  opacity: { duration: 0.5 },
                }}
                className={cn(
                  `rounded-2xl border-[1px] w-full md:max-w-[280px] lg:max-w-[370px] p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative`,
                  isPopular ? "border-primary border-2" : "border-border",
                  "flex flex-col",
                  (!isPopular && pricingData.length >= 3) && "mt-5 border-zinc-400",
                  index === 0 || index === 2
                    ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                    : "z-10",
                  index === 0 && "origin-right",
                  index === 2 && "origin-left"
                )}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                    <Star className="text-primary-foreground h-4 w-4 fill-current" />
                    <span className="text-primary-foreground ml-1 font-sans font-semibold">
                      Popular
                    </span>
                  </div>
                )}

                <div className="flex-1 flex flex-col">
                  <p className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                    {pkg.name}
                  </p>
                  <div className="mt-2 lg:mt-6 flex items-center justify-center gap-x-2">
                    <span className="text-5xl text-primary font-bold tracking-tight">
                      <NumberFlow
                        value={displayPrice}
                        format={{
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                        transformTiming={{
                          duration: 500,
                          easing: "ease-out",
                        }}
                        willChange
                        className="font-variant-numeric: tabular-nums"
                      />
                    </span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                      {isMonthly ? "Per Months" : "Per Year"}
                    </span>
                  </div>

                  <p className="text-xs leading-5 text-muted-foreground">
                    {isMonthly ? "billed monthly" : "billed annually"}
                  </p>

                  {!isMonthly && savings > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      Save {savings}% with yearly billing
                    </p>
                  )}

                  {pkg.description && (
                    <p className="text-xs text-center text-muted-foreground mt-3 ">
                      {pkg.description}
                    </p>
                  )}

                  <ul className="mt-5 gap-2 flex flex-col justify-center items-center text-center">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-left text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="w-full my-4" />

                  <Link
                    href={pkg.href || "#"}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                      }),
                      "group relative py-6 w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                      "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground",
                      isPopular
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-primary"
                    )}
                  >
                    {pkg.buttonText || "Get Started"}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>


        <div className="mt-6 flex justify-center items-center">
          <BookDemoModal productData={productData?.product} />
        </div>
      </section>
    );
  }

  // Default: show regular specifications
  return (
    <section className="space-y-4">
      <h2 className="leading-none text-[22px] font-medium will-change-transform sm:text-3xl   font-overusedGrotesk mb-4 text-primary">
        Product Specifications
      </h2>


      <div
        className="editor text-base!"
        dangerouslySetInnerHTML={{
          __html: (() => {
            let html = decodeHtml(speficication || '');
            html = html
              .replace(/^<pre><code[^>]*>/, '')
              .replace(/<\/code><\/pre>$/, '');

            return DOMPurify.sanitize(html);
          })()
        }}
      >
      </div>
    </section>
  );
}
