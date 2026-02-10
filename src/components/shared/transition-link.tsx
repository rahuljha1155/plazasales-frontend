"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, MouseEvent, Suspense } from "react";
import { useTransitionContext } from "./page-transition";

interface TransitionLinkProps extends Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'> {
  href: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

function TransitionLinkContent({
  href,
  children,
  target,
  className,
  onClick,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startTransition, isTransitioning } = useTransitionContext();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // For external links, let them open normally
    if (target === "_blank") {
      return;
    }

    e.preventDefault();
    
    // Build current full URL with search params
    const currentUrl = searchParams.toString() 
      ? `${pathname}?${searchParams.toString()}` 
      : pathname;
    
    // If clicking the exact same URL (including query params), just call onClick (close dropdown)
    if (currentUrl === href) {
      // Call custom onClick if provided (like closing dropdown)
      if (onClick) {
        onClick(e);
      }
      return;
    }
    
    // Call custom onClick if provided (like closing dropdown)
    if (onClick) {
      onClick(e);
    }
    
    // If already transitioning, prevent multiple clicks
    if (isTransitioning) {
      return;
    }
    
    // Navigate to different URL with transition
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link href={href} onClick={handleClick} className={className} target={target} {...props}>
      {children}
    </Link>
  );
}

export default function TransitionLink(props: TransitionLinkProps) {
  return (
    <Suspense fallback={
      <Link href={props.href} className={props.className} target={props.target}>
        {props.children}
      </Link>
    }>
      <TransitionLinkContent {...props} />
    </Suspense>
  );
}
