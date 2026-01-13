import IndoorOutdoor from "@/components/home/indoor-outdoor";
import Zoom from "@/components/home/zoom";
import About from "@/components/home/about";
import Blogs from "@/components/home/blogs";
import ProductCategory from "@/components/home/product-category";
import PlazaHero from "@/components/home/scroll-hero";
import OurBrands from "@/components/home/our-brands";


export default function Home() {
  return (
    <main className="font-sans max-w-screen  ">
      <PlazaHero />
      <About />
      <IndoorOutdoor />
      <OurBrands />
      <ProductCategory />
      <Zoom />
      <Blogs />
    </main>
  );
}