import { TransitionLink } from '@/components/shared';
import BlogCard from '@/components/ui/blogs-card'
import { getAllBlogs } from '@/services/blogService';

export const metadata = {
    title: 'Blogs - Plaze Electronics',
    description: 'Explore expert blogs on cutting-edge gadgets, home appliances, and emerging tech. Learn how modern electronics redefine comfort, productivity, and entertainment in your daily life.',
    keywords: ['Blogs', 'Tech Blogs', 'Gadgets', 'Home Appliances', 'Electronics Reviews', 'Tech News', 'Plaze Electronics Blogs', 'Smart Home', 'Innovative Technology'],
}

// Disable caching to fetch fresh blogs on every request
export const revalidate = 0;

export default async function BlogsPage() {
    let blogs;
    let hasError = false;

    try {
        blogs = await getAllBlogs();
    } catch {
        hasError = true;
    }

    if (hasError) {
        return (
            <main>
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-start h-[90dvh] md:px-8">
                    <div className="max-w-xl mx-auto space-y-3 text-center">
                        <h3 className="text-primary font-semibold">
                            404 Error
                        </h3>
                        <p className="text-gray-800 uppercase text-4xl font-semibold sm:text-5xl">
                            Page not found
                        </p>
                        <p className="text-gray-600">
                            Sorry, the blogs could not be loaded at this time.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <TransitionLink href="/" className="block py-2 px-6 bg-primary/80 hover:bg-primary text-white rounded-sm">
                                Go Home
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

    return (
        <div className=" pb-16 px-4">
            <div className=' space-y-6  max-w-7xl  mx-auto w-full'>
                <div className="pt-10 md:py-14   text-center  md:pb-8">
                    <h2 className='text-xl md:text-3xl  font-semibold'>Our Popular Blogs </h2>
                    <p className='text-sm md:text-lg mx-auto max-w-5xl mt-2'>Explore expert blogs on cutting-edge gadgets, home appliances, and emerging tech.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4 ">
                    {blogs?.data?.blogs?.map((blog, idx) => (
                        <TransitionLink key={idx} href={`/blogs/${blog?.slug || blog?.id}`}>
                            <BlogCard data={blog} />
                        </TransitionLink>
                    ))}
                </div>
            </div >
        </div>
    )
}
