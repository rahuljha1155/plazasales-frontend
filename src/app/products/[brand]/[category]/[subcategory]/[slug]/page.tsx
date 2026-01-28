import { Suspense } from "react";

import { getProductBySlugServer } from "@/services/productService";
import { Metadata } from "next";
import ProductDetailsSkeleton from "@/app/products/_components/product-details-skeleton";
import DetailsMain from "@/app/products/_components/details-main";

export async function generateMetadata({ params }: { params: Promise<{ brand: string; category: string; subcategory: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await getProductBySlugServer(slug);
    const { product } = data;
    const seo = product.seoMetadata as Record<string, unknown>;

    return {
      title: seo?.title as string || product.metaTitle || product.name,
      description: seo?.description as string || product.metadescription || product.shortDescription,
      keywords: seo?.keywords as string[] || product.metatag || [],
      openGraph: {
        title: (seo?.openGraph as Record<string, unknown>)?.title as string || product.name,
        description: (seo?.openGraph as Record<string, unknown>)?.description as string || product.shortDescription,
        // type: (seo?.openGraph?.type as 'website' | 'article') || 'website',
        url: (seo?.openGraph as Record<string, unknown>)?.url as string || seo?.canonicalUrl as string,
        siteName: (seo?.openGraph as Record<string, unknown>)?.siteName as string,
        locale: (seo?.openGraph as Record<string, unknown>)?.locale as string || 'en_US',
        images: ((seo?.openGraph as Record<string, unknown>)?.images as Array<{url: string}>)?.map((img) => img.url) || [product.coverImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: (seo?.twitter as Record<string, unknown>)?.title as string || product.name,
        description: (seo?.twitter as Record<string, unknown>)?.description as string || product.shortDescription,
        images: (seo?.twitter as Record<string, unknown>)?.images as string[] || [product.coverImage],
      },
      robots: {
        index: (seo?.robots as Record<string, unknown>)?.index as boolean ?? true,
        follow: (seo?.robots as Record<string, unknown>)?.follow as boolean ?? true,
        'max-snippet': (seo?.robots as Record<string, unknown>)?.maxSnippet as number,
        'max-image-preview': "large",
        'max-video-preview': (seo?.robots as Record<string, unknown>)?.maxVideoPreview as number,
      },
      alternates: {
        canonical: seo?.canonicalUrl as string,
        languages: (seo?.alternates as Record<string, unknown>)?.languages as Record<string, string>,
      },
      other: {
        'theme-color': (seo?.extraMeta as Record<string, unknown>)?.themeColor as string,
        'category': (seo?.extraMeta as Record<string, unknown>)?.category as string,
      },
    };
  } catch {
    return {
      title: 'Product',
      description: 'Product details',
    };
  }
}



export default async function Page({ params }: { params: Promise<{ brand: string; category: string; subcategory: string; slug: string }> }) {
  const { slug } = await params;

  try {
    const productData = await getProductBySlugServer(slug);
    const { product } = productData;
    const jsonLd = (product.seoMetadata as Record<string, unknown>)?.jsonLd as Record<string, unknown> | undefined;

    return (
      <main className="min-h-screen bg-background">
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <Suspense fallback={<ProductDetailsSkeleton />}>
          <DetailsMain key={product.id} initialData={productData} />
        </Suspense>
      </main>
    );
  } catch {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">The product you are looking for does not exist or has been removed.</p>
        </div>
      </main>
    );
  }
}
