import { Skeleton } from "@/components/ui/skeleton";
import CustomBreadcrumb from "@/components/ui/custom-breadcum";

function ProductCardSkeleton() {
  return (
    <div className="relative border-zinc-200 dark:border-zinc-800 border rounded-lg overflow-hidden flex flex-col h-[50vh]">
      <div className="flex-1 relative">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="p-2 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  const breadcrumbPaths = [
    { name: "Home", href: "/" },
    { name: "Offers", href: "/products/offers" },
    { name: "Products", href: "#" },
  ];

  return (
    <section className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <CustomBreadcrumb 
          paths={breadcrumbPaths} 
          className="flex-1 min-w-0 py-2 mb-6" 
        />

        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-40" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
