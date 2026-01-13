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
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useBrandStore } from '@/store/useBrandStore';

export default function DetailsMain({ initialData }: { initialData: IProductBySlugResponse }) {
    const product = initialData;
    const params = useParams();
    const { setProductBrandLogo, clearProductBrandLogo } = useBrandStore();

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
        <section className="max-w-7xl px-4 xl:px-0 mx-auto mb-16 animate-in fade-in duration-300">
            <div className="mb-4 mt-4 capitalize! flex justify-between items-center">
                <CustomBreadcrumb paths={paths} className='bg-transparent' />
            </div>
            <ImagePreviews product={product?.product} slides={product?.product.gallery || []} defaultImage={product?.product?.coverImage as string} />
            <div className=" space-y-10">
                <ShortDescription product={product?.product} />
                <Summary summary={product?.product?.description || ""} />
                <Specifications productData={product} speficication={product?.product?.feature as string} productType={product?.product?.productType} />
                <DetailsImage images={product?.product?.detailImage} />
                <Downloads downloads={product?.product?.downloads || []} categories={product?.product?.downloadCategories} />
                <Videos productName={product?.product?.name || ""} videos={product?.product?.videos || []} />
                <RelatedProducts similarProduct={similarProductsTransformed} />
            </div>
        </section>
    )
}
