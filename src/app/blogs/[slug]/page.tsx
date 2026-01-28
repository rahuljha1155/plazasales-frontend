import { getBlogBySlug } from '@/services/blogService';
import Image from 'next/image'
import React from 'react'
import "@/styles/ckeditor-custom.css"
import { Icon } from '@iconify/react';
import BlogCard from '@/components/ui/blogs-card';
import { TransitionLink } from '@/components/shared';
import CustomBreadcrumb from '@/components/ui/custom-breadcum';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let blogDetails;
    let hasError = false;

    try {
        blogDetails = await getBlogBySlug(slug);
    } catch {
        hasError = true;
    }

    if (hasError || !blogDetails?.blog) {
        return (
            <main>
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-start h-[90dvh] md:px-8">
                    <div className="max-w-xl mx-auto space-y-3 text-center">
                        <h3 className="text-primary font-semibold">
                            404 Error
                        </h3>
                        <p className="text-gray-800 uppercase text-4xl font-semibold sm:text-5xl">
                            Blog not found
                        </p>
                        <p className="text-gray-600">
                            Sorry, the blog you are looking for could not be found or has been removed.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <TransitionLink href="/blogs" className="block py-2 px-6 bg-primary/80 hover:bg-primary text-white rounded-sm">
                                View All Blogs
                            </TransitionLink>
                            <TransitionLink href="/contact" className="block py-2 px-6 border border-primary text-primary hover:bg-primary hover:text-white rounded-sm">
                                Need Help
                            </TransitionLink>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const paths = [
        { name: "Home", href: "/" },
        { name: "Blogs", href: "/blogs" },
        { name: blogDetails?.blog?.title || "Blog Details", href: "#" }
    ];

    // Sanitize blog content for security
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    const sanitizedExcerpt = purify.sanitize(blogDetails?.blog?.excerpt || '');
    const sanitizedDescription = purify.sanitize(blogDetails?.blog?.description || '');

    return (
        <div className='pb-20'>
            <div className="bg-muted/80 py-2 ">
                <CustomBreadcrumb paths={paths} className='bg-transparent' />
            </div>
            <div className="relative p-4 pb-10!">
                <div className="max-w-7xl   mx-auto ">
                    <div
                        className="  rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
                        <div className="">

                            <div className="w-full h-[35vh] md:h-[55vh] mb-4 rounded-sm overflow-hidden border  relative">
                                <Image src={blogDetails?.blog?.coverImage || '/brokenimg.webp'} alt="Blog Image" fill className="object-cover object-center " sizes="(max-width: 768px) 100vw"
                                />
                            </div>
                            <h1 className="text-gray-900 border-b pb-6 mb-6 font-bold text-xl md:text-3xl">{blogDetails?.blog?.title}</h1>
                            <div className="" dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }}></div>
                            <div className="ckeditor-content-display px-0 mx-0 text-sm!" dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></div>
                            {blogDetails.blog?.mediaAssets.length && (<div className="grid md:grid-cols-2 gap-4 lg:mt-10">
                                {blogDetails?.blog?.mediaAssets?.map((media) => (
                                    <div key={media.id} className="w-full aspect-video   relative">
                                        {media.type.toLowerCase() === 'image' ? (
                                            <Image
                                                src={media.fileUrl}
                                                alt="Blog Media"
                                                fill
                                                className="object-cover rounded-sm"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                                            />
                                        ) : (
                                            <video controls className="w-full h-full rounded-sm object-cover">
                                                <source src={media.fileUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                ))}
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl md:mt-10 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 lg:p-0">
                <h2 className='col-span-3 text-xl md:text-3xl font-semibold'>Similar Blogs</h2>
                {blogDetails.similarBlogs.map((blog) => (<TransitionLink href={`/blogs/${blog.slug}`} key={blog.id} className='col-span-3  md:col-span-1' >     <BlogCard className='p-0!' data={blog} /></TransitionLink>))}
                {blogDetails.similarBlogs.length > 3 && (
                    <div className="col-span-3 flex justify-end items-center">
                        <TransitionLink href="/blogs">
                            <button className='mt-4  flex gap-4 items-center px-8 py-4 text-zinc-800 hover:text-primary text-lg w-fit'>View All Blogs <Icon icon="akar-icons:chevron-right" /></button>
                        </TransitionLink>
                    </div>
                )
                }
            </div>
        </div>
    )
}
