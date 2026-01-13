import { IBlog } from '@/types/IBlog'
import Image from 'next/image'
import { ClassNameValue } from 'tailwind-merge'
import { memo } from 'react'
import { Icon } from '@iconify/react'

const BlogCard = memo(function BlogCard({ data, className }: { data: IBlog, className?: ClassNameValue }) {
  return (
    <article className={`space-y-3 relative bg-white rounded-xl cursor-pointer group ${className}`}>
      <div className="w-full aspect-video rounded-sm relative overflow-hidden">
        <Image
          src={data.coverImage || '/brokenimg.jpg'}
          alt={data.title}
          fill
          quality={90}
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover h-full object-top bg-muted rounded-sm"
        />
      </div>
      <div className="">
        <p className='md:text-lg line-clamp-2 text-zinc-800 group-hover:text-primary font-semibold lg:font-medium group-hover:underline transition-colors'>{data.title}</p>
        <p className='text-zinc-500 md:mt-2 text-sm md:text-base !line-clamp-2 hidden md:block'>{data.excerpt}</p>
        <div className="flex mt-4 items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
          <span className="text-sm lg:text-sm">View details</span>
          <Icon icon="tabler:arrow-right" className="ml-1 w-3 h-3 lg:w-4 lg:h-4" />
        </div>
      </div>
    </article>
  )
})

export default BlogCard

