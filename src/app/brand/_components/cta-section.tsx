import { TransitionLink } from "@/components/shared";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export default function CTASection({
  title = "Ready to Get Started?",
  description = "Join thousands of satisfied customers and transform your business today",
  primaryButtonText = "Contact Sales",
  primaryButtonHref = "/contact",
  secondaryButtonText = "Explore Products",
  secondaryButtonHref = "/products"
}: CTASectionProps) {
  return (
    <section className="py-12 lg:py-20 bg-primary">
      <div className="mx-auto px-4 max-w-5xl">
        <div className="relative bg-gradient-to-r from-primary to-primary/80 sm:p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />

          <div className="relative z-10 space-y-2">
            <h2 className="text-2xl lg:text-4xl font-bold text-primary-foreground">
              {title}
            </h2>
            <p className="text-primary-foreground/90 sm:text-lg md:text-xl max-w-3xl mx-auto">
              {description}
            </p>
            <div className="flex mt-8 gap-4 justify-center flex-wrap items-center md:pt-4">
              <TransitionLink
                href={primaryButtonHref}
              >
                <Button className="hover:bg-white!  hover:text-primary!">
                  {primaryButtonText}
                </Button>
              </TransitionLink>
              <TransitionLink
                href={secondaryButtonHref}
              >
                <Button variant={"outline"} className="bg-white! hover:bg-transparent! hover:border-white hover:text-white!">
                  {secondaryButtonText}
                </Button>
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
