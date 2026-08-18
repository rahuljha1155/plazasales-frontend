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
        <section className='pt-2 md:pt-4'>
            <div className="col-span-2">
                {mounted && sanitizedHtml && (
                    <div
                        className="editor mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:marker:text-primary [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:marker:text-primary"
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
