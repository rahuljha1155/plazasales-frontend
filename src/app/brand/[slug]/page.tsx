import BrandSlider from "../_components/brand-slider";
import { Pricing } from "@/components/brands/pricing";
import PopularProducts from "../_components/popular-products";
import { fetchBrandBySlugServer } from "@/services/brandService";
import BrandAbout from "../_components/about";
import Title from "@/components/home/title";
import Certificate from "../_components/certificate";
import { TransitionLink } from "@/components/shared";
import ImageShowcase from "../_components/image-showcase";
import FeaturesGrid from "../_components/features-grid";
import CTASection from "../_components/cta-section";
import { brandFeatures } from "../_components/features-data";
import AppStore from "../_components/app-store";

export const revalidate = 1;
export const dynamicParams = true; 

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let brandData;
  let hasError = false;

  try {
    const response = await fetchBrandBySlugServer(slug);
    brandData = response.brand;
  } catch {
    hasError = true;
  }

  if (hasError || !brandData) {
    return (
      <main>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-start h-[90dvh] md:px-8">
          <div className="max-w-xl mx-auto space-y-3 text-center">
            <h3 className="text-primary font-semibold">
              404 Error
            </h3>
            <p className="text-gray-800 uppercase text-4xl font-semibold sm:text-5xl">
              Brand not found
            </p>
            <p className="text-gray-600">
              Sorry, the brand you are looking for could not be found or has been removed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <TransitionLink href="/brand" className="block py-2 px-6 bg-primary/80 hover:bg-primary text-white rounded-sm">
                View All Brands
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

  // Filter products by type
  const filteredSaasProducts = brandData?.popularProducts.filter(
    product => product.productType?.toLowerCase() === 'saas'
  ) || [];

  const filteredPopularProducts = brandData?.popularProducts.filter(
    product => product.productType?.toLowerCase() !== 'saas'
  ) || [];

  return (
    <div className="">

      <div className="relative  overflow-hidden flex items-center justify-center">
        <BrandSlider options={{ loop: true }} slides={brandData.bannerUrls} />
      </div>

      <div className="w-full  max-w-[90%] mx-auto">
        <BrandAbout brand={brandData} />
      </div>

      <Certificate url={brandData?.certificate as string} />

      <ImageShowcase
        indoorImage={brandData.indoorImage || undefined}
        outdoorImage={brandData.outdoorImage || undefined}
        brandName={brandData.name}
      />

      {/* Features/Benefits Section */}
      <FeaturesGrid
        title={`Why Choose ${brandData.name}?`}
        subtitle="Experience excellence with our comprehensive solutions and dedicated support"
        features={brandFeatures}
      />


      {filteredSaasProducts.length > 0 && (
        <section className="relative py-8 bg-muted/80! border-t border-primary/20 ">
          <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <div className="mx-auto px-4 max-w-7xl">
            <Pricing data={{ ...brandData, popularProducts: filteredSaasProducts }} />
          </div>
        </section>
      )}

      {filteredPopularProducts.length > 0 && (
        <section className="relative  py-8 pb-10 md:py-12 lg:py-20">
          <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <div className="mx-auto px-4 max-w-7xl">
            <div className="space-y-6 md:space-y-12">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row justify-center text-center items-center gap-6">
                <div className="space-y-3 text-center! lg:flex-1">
                  <Title title="Popular Products" wrapperClassName="!mx-0 lg:!mx-auto   mb-2 " />
                  <p className="text-muted-foreground lg:text-lg max-w-2xl lg:mx-auto">
                    Discover our most sought-after solutions trusted by industry leaders
                  </p>
                </div>
              </div>

              <PopularProducts products={filteredPopularProducts} />
            </div>

            {filteredPopularProducts.length > 4 && (
              <div className="flex justify-end items-center mt-6">
                <TransitionLink
                  href={`/brand/${brandData.slug}/products`}
                  className="group inline-flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300"
                >
                  View all products
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </TransitionLink>
              </div>
            )}
          </div>
        </section>
      )}



      <CTASection />


      <AppStore appStoreUrl={brandData.appStoreUrl} playStoreUrl={brandData.playStoreUrl} />
    </div>
  );
}


