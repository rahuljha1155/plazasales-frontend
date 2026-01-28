"use client"
import React from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/react';
import { TransitionLink } from '../shared';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';

interface CustomBreadcrumbProps {
  paths: { name: string; href: string }[]
  className?: string,
  onClick?: () => void
}

export default function CustomBreadcrumb({ paths, className, onClick }: CustomBreadcrumbProps) {
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 640px)')
  
  // On mobile, show only first and last items if there are more than 3 items
  // Use isMobile check only after mount to avoid hydration mismatch
  const displayPaths = (isMobile && paths.length > 3)
    ? [paths[0], { name: '...', href: '#' }, paths[paths.length - 1]]
    : paths;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center bg-muted/80', className)}>
      <ol className="flex items-center overflow-x-auto w-full sm:gap-1 max-w-7xl mx-auto scrollbar-hide">

        {displayPaths?.map((path, idx) => {
          const isLast = idx === displayPaths.length - 1
          const isEllipsis = path.name === '...'

          return (
            <React.Fragment key={idx}>

              <li className="flex items-center">
                {isLast ? (
                  <span className="text-xs sm:text-sm font-medium text-primary px-1">
                    {path.name}
                  </span>
                ) : isEllipsis ? (
                  <span className="text-xs sm:text-sm font-medium text-zinc-600 px-1">
                    {path.name}
                  </span>
                ) : (
                  <TransitionLink
                    href={path.href}
                    className="text-xs sm:text-sm font-medium text-zinc-600 hover:text-primary px-1 rounded-md hover:bg-zinc-50 transition-all duration-200 truncate max-w-[100px] sm:max-w-none"
                  >
                    {path.name}
                  </TransitionLink>
                )}
              </li>
              {!isLast && (
                <li className="flex items-center text-zinc-400 flex-shrink-0" aria-hidden="true">
                  <Icon icon="solar:alt-arrow-right-linear" width="16" height="16" />
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>

      {pathname == "/products" && (
        <li className='list-none lg:hidden'>{/* Mobile Filter Toggle Button */}
          <button
            onClick={onClick}
            className="lg:hidden text-primary transition-colors"
            aria-label="Toggle filters"
          >
            <Icon icon="lets-icons:filter" className="size-5" />
          </button></li>
      )}
    </nav>
  )
}
