'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, MouseEvent } from 'react';

interface SmoothLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function SmoothLink({ href, children, className, onClick }: SmoothLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Only apply smooth transition for internal links
    if (href.startsWith('/')) {
      e.preventDefault();
      
      if (onClick) {
        onClick();
      }

      // Scroll to top smoothly before navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Navigate after a short delay
      setTimeout(() => {
        router.push(href);
      }, 300);
    } else {
      // For external links, just call onClick if provided
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
