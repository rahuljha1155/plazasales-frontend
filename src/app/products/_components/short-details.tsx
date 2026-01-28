"use client"

import { Product } from '@/types/IProductBySlug'
import { decodeHtml } from './specifications'
import ContactModal from '@/components/dialog/contact-modal';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import Image from 'next/image';


export default function ShortDescription({ product }: { product: Product | undefined }) {
    const [sanitizedHtml, setSanitizedHtml] = useState("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        let html = decodeHtml(product?.shortDescription || '');
        html = html
            .replace(/^<pre><code[^>]*>/, '')
            .replace(/<\/code><\/pre>$/, '');

        setSanitizedHtml(DOMPurify.sanitize(html));
    }, [product?.shortDescription, mounted])

    return (
        <section className='pt-2 md:pt-6'>
            <div className="col-span-2">
                <span className='text-primary md:text-lg'>Brand : {product?.brand?.name}</span>
                <h1 className="text-xl  text-primary flex flex-wrap lg:gap-4 justify-between items-center leading-none text-[22px] font-semibold will-change-transform sm:text-3xl  font-overusedGrotesk ">
                    <div className="lg:max-w-[75%]  ">
                        {product?.name}
                    </div>

                    <ContactModal productData={product} btnClassName="rounded-full  lg:py-2 !text-base hidden lg:flex justify-center items-center" />
                </h1>
                {product?.model && <p className="text-zinc-600  sm:-mt-1 lg:-mt-2 dark:text-zinc-400 text-sm lg:text-base">Model: {product?.model}</p>}
                {mounted && sanitizedHtml && (
                    <div
                        className="editor mt-4"
                        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                    />
                )}

            </div>

            {(product?.icons && product.icons.length > 0 && <div className="flex gap-2 md:gap-2 items-center mt-8 flex-wrap">
                {product.icons.map((iconUrl, index) => (
                    <Image key={index} src={iconUrl} alt={`Icon ${index + 1}`} width={64} height={64} className="object-contain" />
                ))}
            </div>)}
        </section>
    )
}
