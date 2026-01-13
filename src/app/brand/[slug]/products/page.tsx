import About from "@/components/home/about-us";
import { getAllProductsServer, searchProductsServer } from "@/services/productService";
import { fetchBrandsServer } from "@/services/brandService";
import { adService, adServiceById } from "@/services/adService";
import { LoadingProvider } from "@/app/products/_components/loading-context";
import Sidebar from "@/app/products/_components/sidebar";
import ProductList from "@/app/products/_components/product-list";

export const metadata = {
  title: "Products - Plaze Electronics",
  description: "Discover a wide range of high-quality electronics products at Plaze Electronics. From the latest gadgets to essential home appliances, we have everything you need to upgrade your lifestyle.",
  keywords: ["Products", "Electronics", "Gadgets", "Home Appliances", "Smart Home", "Innovative Technology",],
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Params = Promise<{ slug: string }>;

export const revalidate = 10;


export default async function Page({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const search = typeof searchParamsResolved.search === 'string' ? searchParamsResolved.search : '';
  const page = typeof searchParamsResolved.page === 'string' ? parseInt(searchParamsResolved.page) : 1;
  const limit = 16;
  const brand = slug; // Use the slug from the URL as the brand filter
  const category = typeof searchParamsResolved.category === 'string' ? searchParamsResolved.category : '';
  const subcategory = typeof searchParamsResolved.subcategory === 'string' ? searchParamsResolved.subcategory : '';
  const technology = typeof searchParamsResolved.technology === 'string' ? searchParamsResolved.technology : '';

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
    adServiceById.getAdsById(1, 10, brand).catch(() => ({ data: { ads: [] } })),
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
          hideBrandFilter={true}
          basePath={`/brand/${slug}/products`}
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
