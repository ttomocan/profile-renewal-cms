'use client';

import { usePathname } from 'next/navigation';

export default function DynamicBodyClass() {
  const pathname = usePathname();

  const bodyClassName = pathname === '/' ? 'top' : pathname === '/about/' ? 'about' : pathname === '/skill/' ? 'skill' : pathname === '/contact/' ? 'contact' : pathname === '/blog/' ? 'blog' : '';

  // クラス名をbodyに設定
  if (typeof window !== 'undefined') {
    document.body.className = bodyClassName;
  }

  return null;
}
