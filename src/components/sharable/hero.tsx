import { Icon } from "@iconify/react";

export default function ShareableHero() {
  return (
    <div className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Icon icon="solar:document-bold" className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Shareable Resources
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download brochures, manuals, catalogs, and datasheets for our products
          </p>
        </div>
      </div>
    </div>
  );
}
