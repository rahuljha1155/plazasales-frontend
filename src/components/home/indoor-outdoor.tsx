'use client'
import { Icon } from '@iconify/react';
import Title from './title';
import { TransitionLink } from '../shared';
import { useEffect, useState } from 'react';
import { getTechnology } from '@/services/technologyService';
import { ITechnology } from '@/types/ITechnology';
import Image from 'next/image';
import DOMPurify from 'dompurify';



export default function IndoorOutdoor() {

    const [data, setData] = useState<ITechnology[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTechnology();
                setData(data?.data?.technologies);
            } catch (error: unknown) {
                setError("Error Occoured" + error);
            }
        }
        fetchData()
    }, []);

    if (error) {
        return <div className='lg:px-0 py-8 md:py-12 lg:py-20 px-4 xl:px-0  max-w-screen overflow-x-hidden'>
            Error occurred
        </div>
    }

    return (
        <section className='lg:px-0 py-8 md:py-12 lg:py-20 px-4 xl:px-0  max-w-screen overflow-x-hidden'>
            <div className="relative pointer-events-none flex flex-col  w-full  justify-center items-center">
                <Title title="Explore Technologies" wrapperClassName={"!mx-0  mx-auto"} />
                <p className='text-sm md:text-xl mt-1 lg:mt-3 text-center'>Discover innovative technology designed for your lifestyle</p>
                <div className="grid grid-cols-2 mt-4 md:mt-14 lg:grid-cols-2 gap-3 lg:gap-4 py-2 max-w-5xl mx-auto relative  w-full pointer-events-auto">
                    {data?.map((item, idx) => {
                        return (
                            <TransitionLink

                                key={idx}
                                href={`/technology/${item?.id}`}
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-sm"
                            >
                                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-3 lg:gap-4 p-3 md:p-4 lg:p-5">
                                    <div className="w-full lg:w-2/5 shrink-0">
                                        <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden bg-white/50 dark:bg-black/50">
                                            <Image
                                                height={1000}
                                                width={1000}
                                                src={item.coverImage}
                                                alt={item.title}
                                                className="w-full h-full object-contain p-3"
                                            />
                                        </div>
                                    </div>

                                    {/* Text Section */}
                                    <div className="flex-1 flex flex-col justify-center space-y-2 lg:space-y-3">

                                        <h3 className="text-lg lg:text-xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                                            {item.title}
                                        </h3>

                                        <div className="hidden lg:block">
                                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.description) }} className="text-xs  line-clamp-2  lg:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                            </div>
                                        </div>

                                        {/* Arrow Icon */}
                                        <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                                            <span className="text-xs lg:text-sm">View details</span>
                                            <Icon icon="tabler:arrow-right" className="ml-1 w-3 h-3 lg:w-4 lg:h-4" />
                                        </div>
                                    </div>
                                </div>
                            </TransitionLink>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}
