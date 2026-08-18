"use client";
import ImagePreviews from './image-previews'
import Specifications from './specifications'
import Summary from './product-simmary'
import RelatedProducts from './related-product'
import { IProductBySlugResponse } from '@/types/IProductBySlug';
import Videos from './videos';
import ShortDescription from './short-details';
import Downloads from './downloads';
import CustomBreadcrumb from '@/components/ui/custom-breadcum';
import DetailsImage from './details-image';
import ContactModal from '@/components/dialog/contact-modal';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useBrandStore } from '@/store/useBrandStore';
import { useScrollVisibility } from '@/hooks/use-scroll-visibility';

export default function DetailsMain({ initialData }: { initialData: IProductBySlugResponse }) {
    const product = initialData;
    const params = useParams();
    const { setProductBrandLogo, clearProductBrandLogo } = useBrandStore();
    const isVisible = useScrollVisibility({ threshold: 50, hideThreshold: 100 });

    const paths = [
        { name: "Home", href: "/" },
        { name: String(params?.brand || 'Brand'), href: `/products?brand=${params?.brand || ''}` },
        { name: String(params?.category || 'Category'), href: `/products?brand=${params?.brand || ''}&category=${params?.category || ''}` },
        { name: String(params?.subcategory || 'Subcategory'), href: `/products?brand=${params?.brand || ''}&category=${params?.category || ''}&subcategory=${params?.subcategory || ''}` },
    ]

    const similarProductsTransformed = (product?.similarProducts && Array.isArray(product.similarProducts))
        ? product.similarProducts.map(p => ({
            id: p.id,
            ispopular: p.isPopular,
            coverimage: p.coverImage || '',
            title: p.name,
            slug: p.slug,
            price: p.price,
            sortOrder: p.sortOrder,
            brandName: p?.brand?.name,
            brandId: p?.brand?.id,
            model: p.model || '',
            coverImage: p.coverImage || '',
            isPublished: p.isPublished,
            brand: {
                id: p?.brand?.id || '',
                name: p?.brand?.name || 'Brand',
                slug: p?.brand?.name?.toLowerCase().replace(/\s+/g, '-') || 'brand'
            },
            category: {
                id: p?.subcategory?.id || '',
                name: p?.subcategory?.title || 'Category',
                slug: p?.subcategory?.slug || 'category',
                title: p?.subcategory?.title || 'Category'
            },
            subcategory: {
                id: p?.subcategory?.id || '',
                name: p?.subcategory?.title || 'Subcategory',
                slug: p?.subcategory?.slug || 'subcategory',
                title: p?.subcategory?.title || 'Subcategory'
            }
        }))
        : [];


    useEffect(() => {
        // Set the --primary CSS custom property based on product brand theme color
        if (product?.product?.brand?.themeColor) {
            document.documentElement.style.setProperty('--primary', product.product.brand.themeColor);
        }

        // Set the brand logo in the store for navbar to use
        if (product?.product?.brand?.logoUrl) {
            setProductBrandLogo(product.product.brand.logoUrl);
        }
        return () => {
            document.documentElement.style.removeProperty('--primary');
            clearProductBrandLogo();
        };
    }, [product?.product?.brand?.themeColor, product?.product?.brand?.logoUrl, setProductBrandLogo, clearProductBrandLogo])

    return (
        <section className="max-w-7xl px-4 xl:px-0 mx-auto mb-16 animate-in fade-in duration-300 overflow-x-clip">
            <div className="mb-4 mt-4 capitalize! flex justify-between items-center">
                <CustomBreadcrumb paths={paths} className='bg-transparent' />
            </div>
            <ImagePreviews product={product?.product} slides={product?.product.gallery || []} defaultImage={product?.product?.coverImage as string} />
            
            {/* Sticky Container for Main Details */}
            <div className="relative">
                <div className={`sticky z-30 bg-background/95 backdrop-blur-md py-3 mt-0 mb-2 transition-all duration-500 border-b border-border/40 shadow-xs ${isVisible ? "top-10 sm:top-[44px] md:top-[48px]" : "top-0"}`}>
                    <div className="flex justify-between items-center gap-3">
                        <div className="flex-1 min-w-0">
                            <span className='text-primary text-xs md:text-base font-medium'>Brand : {product?.product?.brand?.name}</span>
                            <h1 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-primary font-overusedGrotesk leading-tight mt-0.5">
                                {product?.product?.name}
                            </h1>
                            {product?.product?.model && <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mt-0.5">Model: {product?.product?.model}</p>}
                        </div>

                        <div className="shrink-0">
                            <ContactModal productData={product?.product} btnClassName="rounded-full py-2 px-4 text-xs sm:text-sm lg:text-base flex justify-center items-center shadow-xs" />
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <ShortDescription product={product?.product} />
                    <Summary summary={product?.product?.description || ""} />
                    <Specifications productData={product} speficication={product?.product?.feature as string} productType={product?.product?.productType} />
                    <DetailsImage images={product?.product?.detailImage} />
                    <Downloads
                        downloads={product?.product?.downloads || []}
                        downloadCategories={product?.product?.downloadCategories || []}
                    />
                    <Videos productName={product?.product?.name || ""} videos={product?.product?.videos || []} />
                </div>
            </div>

            {/* Related Products - Outside sticky container so title un-sticks and scrolls up here */}
            <div className="mt-14">
                <RelatedProducts similarProduct={similarProductsTransformed} />
            </div>
        </section>
    )
}
