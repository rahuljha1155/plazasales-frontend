import IndoorOutdoor from "@/components/home/indoor-outdoor";
import About from "@/components/home/about";
import Blogs from "@/components/home/blogs";
import ProductCategory from "@/components/home/product-category";
import PlazaHero from "@/components/home/scroll-hero";
import ZOOMXZoom from "@/components/home/zoomxzoom";
import NewBrands from "@/components/home/new-brands";
import Advertizement from "@/components/home/advertizment";

export const metadata = {
  title: "Plaza Sales | Enhancing Technology",
  description: `Plaza Sales Pvt. Ltd. is a leading IT and electronics distributor in Nepal, offering networking, surveillance, office automation, and technology solutions.`,
};

export default function Home() {
  return (
    <main className="font-sans max-w-screen">
      <PlazaHero />
      <About />
      <IndoorOutdoor />
      <NewBrands />
      {/* <OurBrands /> */}
      <ProductCategory />
      <Advertizement />
      <ZOOMXZoom />
      <Blogs />
    </main>
  );
}
