import { api } from '@/config/axios.config'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { TransitionLink } from '@/components/shared'
import { searchProductsServer } from '@/services/productService'
import ProductCardV2 from '@/components/ui/product-card-v2'
import { Button } from '@/components/ui/button'

export interface TechnologyResponse {
    status: number;
    message: string;
    technology: Technology;
}

export interface Technology {
    id: string;
    createdAt: string;
    updatedAt: string;
    sortOrder: number;
    title: string;
    description: string;
    bannerUrls: string[];
    coverImage: string;
}

export const revalidate = 10;


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug: id } = await params
    const data = async (): Promise<TechnologyResponse> => {
        const res = await api.get(`/technology/get-technology/${id}`);
        return res?.data;
    }
    const technologyData = await data();
    const technology = technologyData.technology;

    // Fetch related products using wild search
    const relatedProductsData = await searchProductsServer({
        search: technology.title,
        limit: 8,
        page: 1
    });
    const relatedProducts = relatedProductsData?.data?.products || [];

    return (
        <div className=''>
            <div className="relative w-full h-[40vh] md:h-[60vh] bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50">
                <div className="absolute inset-0">
                    <Image
                        src={technology.coverImage || '/technology/default.jpg'}
                        alt={technology.title}
                        fill
                        className="object-contain opacity-90"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-800/70 via-black/30 to-transparent" />
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-white font-bold text-3xl text-center lg:text-left md:text-5xl  drop-shadow-lg">
                            {technology.title}
                        </h1>
                        <div className="flex items-center justify-center lg:justify-start text-xs md:text-base gap-4 mt-4 text-white/90">
                            <span className="flex items-center gap-2">
                                <Icon icon="solar:calendar-bold" className="size-4 md:size-5" />
                                {new Date(technology.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center gap-2">
                                <Icon icon="solar:eye-bold" className="size-4 md:size-5" />
                                Technology
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative bg-muted ">
                <div className="">
                    <div className="">
                        <div className="max-w-7xl p-4 xl:p-0 py-12! mx-auto  mb-8">
                            <div
                                className="prose prose-lg text-center lg:text-left max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-strong:text-gray-900"
                                dangerouslySetInnerHTML={{ __html: technology.description }}
                            />
                            <div className="flex justify-center lg:justify-start  mt-8">
                                <TransitionLink href={`/products?search=${technology.title}`}>
                                    <button className='flex items-center group gap-3 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold text-sm transition-colors '>
                                        Explore Products
                                        <Icon icon="solar:arrow-right-outline" className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </TransitionLink>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white ">
                        <div className="max-w-7xl p-4 xl:p-0 py-12! mx-auto  ">
                            {technology.bannerUrls && technology.bannerUrls.length > 0 && (
                                <div className="mb-8">
                                    <h2 className='text-xl lg:text-3xl text-center font-semibold mb-4'>Gallery Showcase</h2>
                                    <div className="flex flex-wrap justify-center items-center  gap-6">
                                        {technology.bannerUrls.map((imageUrl, index) => (
                                            <div
                                                key={index}
                                                className="relative w-full md:w-[45%] lg:w-[30%] aspect-video rounded-xl overflow-hidden border shadow-md hover:shadow-xl transition-shadow duration-300 group"
                                            >
                                                <Image
                                                    src={imageUrl}
                                                    alt={`${technology.title} - Image ${index + 1}`}
                                                    fill
                                                    quality={70}
                                                    sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 25vw, 33vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500 object-center"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {relatedProducts.length > 0 && (
                                <div className="mt-12">
                                    <h2 className='text-xl lg:text-3xl font-semibold mb-6 text-center'>Related Products</h2>
                                    <div className="flex justify-center">
                                        <div className={`${relatedProducts?.length >= 3 ? "grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex justify-center items-center flex-wrap"} gap-4 md:gap-6`}>
                                            {relatedProducts?.slice(0, 8).map((product) => (
                                                <ProductCardV2 key={product.id} data={product} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {
                                relatedProducts.length > 8 && (
                                    <div className="flex justify-center mt-8">
                                        <TransitionLink href={`/products?search=${technology.title}`}>
                                            <Button variant={"outline"}>
                                                Explore More Products
                                                <Icon icon="solar:arrow-right-outline" className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                                            </Button>
                                        </TransitionLink>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
