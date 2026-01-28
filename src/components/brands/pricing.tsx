"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { IBrand } from "@/types/IBrand";
import BookDemoModal from "../dialog/demo-request";

interface PricingProps {
  description?: string;
  data: IBrand
}

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

export function Pricing({
  data,
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const switchRef = useRef<HTMLButtonElement>(null);

  // Parse feature data from popularProducts if available
  const parsedFeatures = useMemo(() => {
    const features: Record<string, PricingPackage[]> = {};
    
    if (data.popularProducts && data.popularProducts.length > 0) {
      data.popularProducts.forEach((product) => {
        // Type assertion for products that may have specification or feature property
        const productWithFeature = product as typeof product & {
          specification?: string;
          feature?: string;
          productType?: string;
        };
        
        if (productWithFeature.productType?.toUpperCase() === 'SAAS') {
          try {
            // Check specification field first (like in specifications.tsx), then feature field
            const dataSource = productWithFeature.specification || productWithFeature.feature;
            
            if (dataSource) {
              const parsed = typeof dataSource === 'string'
                ? JSON.parse(dataSource)
                : dataSource;

              // Handle both array format and old object format for backwards compatibility
              const pricingData = Array.isArray(parsed) ? parsed : (parsed.packages || null);

              if (pricingData && Array.isArray(pricingData)) {
                // Use product name or slug as key
                const key = product.slug || (product.name || product.title || '').toLowerCase().replace(/\s+/g, '-');
                if (key) {
                  features[key] = pricingData;
                }
              }
            }
          } catch {
            // Error handled silently
          }
        }
      });
    }
    
    return features;
  }, [data.popularProducts]);

  const featureKeys = Object.keys(parsedFeatures);
  const hasFeatures = featureKeys.length > 0;

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
          "hsla(0, 100%, 59%, 1.00)",    // red
          "hsla(210, 100%, 64%, 1.00)",  // blue
          "hsla(120, 94%, 62%, 1.00)",  // green
          "hsla(50, 100%, 58%, 1.00)",   // yellow
          "hsla(330, 100%, 67%, 1.00)",  // pink
        ],

        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  // Render pricing card
  const renderPricingCard = (pkg: PricingPackage, index: number) => {
    const monthlyPrice = parseFloat(pkg.price) || 0;
    const yearlyPrice = parseFloat(pkg.yearlyPrice) || 0;
    const displayPrice = isMonthly ? monthlyPrice : yearlyPrice;
    const isPopular = pkg.isPopular;

    const savings = monthlyPrice > 0 && yearlyPrice > 0
      ? Math.round(((monthlyPrice - yearlyPrice) / monthlyPrice) * 100)
      : 0;

    return (
      <div
        key={index}
        className={cn(
          "rounded-2xl border p-4 sm:p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative",
          isPopular ? "border-primary border-2" : "border-border",
          "flex flex-col",
          !isPopular && "mt-5 border-zinc-400"
        )}
      >
        {isPopular && (
          <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
            <Star className="text-primary-foreground h-4 w-4 fill-current" />
            <span className="text-primary-foreground ml-1 font-sans font-semibold text-xs sm:text-sm">
              Popular
            </span>
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <p className="text-sm sm:text-base lg:text-xl font-semibold text-zinc-800 dark:text-zinc-100">
            {pkg.name}
          </p>
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-x-2">
            <span className="text-3xl sm:text-4xl lg:text-5xl text-primary font-bold tracking-tight">
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
            <span className="text-xs sm:text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
              {isMonthly ? "Per Month" : "Per Year"}
            </span>
          </div>

          <p className="text-xs leading-5 text-muted-foreground mt-1">
            {isMonthly ? "billed monthly" : "billed annually"}
          </p>

          {!isMonthly && savings > 0 && (
            <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-2">
              Save {savings}% with yearly billing
            </p>
          )}

          {pkg.description && (
            <p className="text-xs text-center text-muted-foreground mt-3">
              {pkg.description}
            </p>
          )}

          <ul className="mt-4 sm:mt-5 gap-2 flex flex-col">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm md:text-base">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-left">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mb-5"></div>
          <Link
            href={pkg.href || "/contact"}
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "group relative py-4 sm:py-6 w-full gap-2 overflow-hidden text-sm sm:text-lg font-semibold tracking-tighter",
              "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground",
              isPopular
                ? "bg-primary text-primary-foreground"
                : "bg-background text-primary"
            )}
          >
            {pkg.buttonText || "Get Started"}
          </Link>
        </div>
      </div>
    );
  };

  if (!hasFeatures) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:pt-16 lg:pt-20">
      <Tabs defaultValue={featureKeys[0]} className="space-y-8 sm:space-y-12">
        {featureKeys.length > 1 && (
          <TabsList className="mx-auto p-1.5 sm:p-2 h-fit rounded-full bg-white! flex-wrap gap-2">
            {featureKeys.map((key) => {
              const productName = data.popularProducts?.find(p =>
                (p.slug || (p.name || p.title || '').toLowerCase().replace(/\s+/g, '-')) === key
              )?.name || key;

              return (
                <TabsTrigger
                  key={key}
                  className="data-[state=active]:bg-primary capitalize! data-[state=active]:text-white rounded-full py-1.5 sm:py-2 px-3 sm:px-6 text-xs sm:text-base "
                  value={key}
                >
                  {productName}
                </TabsTrigger>
              );
            })}
          </TabsList>
        )}
        {featureKeys.map((key) => {
          const pricingPackages = parsedFeatures[key];

          // Calculate max savings for display
          const maxSavings = Math.max(
            ...pricingPackages
              .filter(pkg => pkg.price && pkg.yearlyPrice)
              .map(pkg => {
                const monthly = parseFloat(pkg.price);
                const yearly = parseFloat(pkg.yearlyPrice);
                return monthly > 0 ? Math.round(((monthly - yearly) / monthly) * 100) : 0;
              })
          );

          return (
            <TabsContent key={key} value={key} className="gap-0">
              <div className="text-center space-y-1 mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-primary">
                  Choose Your Plan
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg whitespace-pre-line max-w-6xl mx-auto px-4">
                  {description}
                </p>
              </div>

              <div className="flex justify-center items-center gap-2 sm:gap-0 mb-6 sm:mb-10">
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
                <span className="ml-2 font-semibold text-sm sm:text-base">
                  Annual billing{" "}
                  {maxSavings > 0 && (
                    <span className="text-primary">
                      (Save up to {maxSavings}%)
                    </span>
                  )}
                </span>
              </div>

              <div className={cn(
                "grid gap-4 sm:gap-5 mx-auto max-w-7xl",
                pricingPackages.length === 1 && "grid-cols-1 max-w-md",
                pricingPackages.length === 2 && "grid-cols-1 md:grid-cols-2 max-w-4xl",
                pricingPackages.length >= 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}>
                {pricingPackages.map((pkg, index) =>
                  renderPricingCard(pkg, index)
                )}
              </div>

              <div className="flex justify-center items-center mt-6 sm:mt-10">
                <BookDemoModal productData={data.popularProducts?.find(p =>
                  (p.slug || (p.name || p.title || '').toLowerCase().replace(/\s+/g, '-')) === key
                )} />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
