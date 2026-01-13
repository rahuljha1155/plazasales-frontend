import { fetchBrandsServer } from "@/services/brandService";
import BrandCard from "@/components/ui/brand-card";
import { TransitionLink } from "@/components/shared";
import Title from "@/components/home/title";
import { IBrand } from "@/types/IBrand";

export const metadata = {
  title: "Our Brands | Plaza Sales",
  description: "Explore our trusted brands and authorized partnerships",
};

export const revalidate = 1; // Revalidate every hour

export default async function BrandsPage() {
  let brands: IBrand[] = [];
  let hasError = false;

  try {
    const response = await fetchBrandsServer();
    brands = response?.data?.brands || [];
  } catch (error) {
    hasError = true;
  }

  if (hasError) {
    return (
      <main>
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-[90dvh] md:px-8">
          <div className="max-w-xl mx-auto space-y-3 text-center">
            <h3 className="text-primary font-semibold">
              404 Error
            </h3>
            <p className="text-gray-800 uppercase text-4xl font-semibold sm:text-5xl">
              Page not found
            </p>
            <p className="text-gray-600">
              Sorry, the brands could not be loaded at this time.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <TransitionLink href="/" className="block py-2 px-6 bg-primary/80 hover:bg-primary text-white rounded-sm">
                Go Home
              </TransitionLink>
              <TransitionLink href="/contact" className="block py-2 px-6 border border-primary text-primary hover:bg-primary hover:text-white rounded-sm">
                Need Help
              </TransitionLink>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 md:py-12 lg:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className=" text-center mb-6 md:mb-12">
          <Title title="Our Brands" />
          <p className="md:text-lg mt-1 md:mt-3 text-muted-foreground">
            Discover our trusted partners and authorized brands
          </p>
        </div>

        {brands.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <p className="text-muted-foreground text-lg">No brands available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4 lg:gap-6">
            {brands.map((brand) => (
              <TransitionLink key={brand.id} href={`/brand/${brand.slug}`}>
                <BrandCard data={brand} />
              </TransitionLink>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}