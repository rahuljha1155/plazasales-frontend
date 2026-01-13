import React from "react";
import About from "@/components/home/about-us";
import ProductList from "./_components/product-list";
import { getAllProductsServer, searchProductsServer } from "@/services/productService";
import { fetchBrandsServer } from "@/services/brandService";
import { adService } from "@/services/adService";
import Sidebar from "./_components/sidebar";
import { LoadingProvider } from "./_components/loading-context";

export const metadata = {
  title: "Products - Plaze Electronics",
  description: "Discover a wide range of high-quality electronics products at Plaze Electronics. From the latest gadgets to essential home appliances, we have everything you need to upgrade your lifestyle.",
  keywords: ["Products", "Electronics", "Gadgets", "Home Appliances", "Smart Home", "Innovative Technology",],
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const revalidate = 0;


export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const limit = 16;
  const brand = typeof params.brand === 'string' ? params.brand : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const subcategory = typeof params.subcategory === 'string' ? params.subcategory : '';
  const technology = typeof params.technology === 'string' ? params.technology : '';

  const filterParams = {
    page,
    limit,
    search,
    brand,
    category,
    subcategory,
    technology
  };

  const [productsResponse, brandsResponse, adsResponse] = await Promise.all([
    search ? searchProductsServer(filterParams) : getAllProductsServer(filterParams),
    fetchBrandsServer(),
    adService.getAds().catch(() => ({ data: { ads: [] } })),
  ]);

  const initialProducts = productsResponse.data.products || [];
  const totalProducts = productsResponse.data.total || 0;
  const totalPages = Math.ceil(totalProducts / limit);
  const initialBrands = brandsResponse.data.brands || [];
  const ads = adsResponse.data.ads || [];

  return (
    <section className="min-h-screen ">
      <LoadingProvider>
        <Sidebar
          search={search}
          brand={brand}
          category={category}
          subcategory={subcategory}
          technology={technology}
        >
          <ProductList
            search={search}
            page={page}
            limit={limit}
            brand={brand}
            category={category}
            subcategory={subcategory}
            technology={technology}
            initialProducts={initialProducts}
            initialBrands={initialBrands}
            totalPages={totalPages}
            totalProducts={totalProducts}
            ads={ads}
          />
        </Sidebar>
      </LoadingProvider>
      <About />
    </section>
  );
}
