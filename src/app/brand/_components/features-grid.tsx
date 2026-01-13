import Title from "@/components/home/title";
import { ReactNode } from "react";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
}

export default function FeaturesGrid({
  title = "Why Choose Us?",
  subtitle = "Experience excellence with our comprehensive solutions and dedicated support",
  features
}: FeaturesGridProps) {
  return (
    <section className="py-10 md:py-12 lg:py-20 bg-muted/60">
      <div className="mx-auto px-4 max-w-7xl">
        <div className=" text-center space-y-4 mb-6 md:mb-16">
          <Title title={title} wrapperClassName="mb-2 !mx-0 lg:!mx-auto" />
          <p className="text-muted-foreground text-sm sm:text-lg max-w-3xl text-center lg:mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-4 md:p-8 rounded-lg md:rounded-2xl border border-border bg-white transition-all duration-300 flex flex-col justify-center items-center text-center hover:shadow-lg hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
