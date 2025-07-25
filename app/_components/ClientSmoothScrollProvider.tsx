'use client';

import { useSmoothScroll } from '@/app/_hooks/useSmoothScroll';

export default function ClientSmoothScrollProvider() {
  useSmoothScroll();
  return null;
}
