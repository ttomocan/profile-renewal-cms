'use client';

import { useEffect, useState } from 'react';

export default function PageTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOnFooter, setIsOnFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollThreshold = 300;
      setIsVisible(scrollTop > scrollThreshold);

      const blog = document.querySelector('.blog-area');
      if (blog) {
        const blogPosition = blog.getBoundingClientRect().top + window.scrollY;
        const scrollPosition = window.scrollY + window.innerHeight;
        setIsOnFooter(scrollPosition >= blogPosition);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const className = `c-pagetop${isVisible ? ' show' : ''}${isOnFooter ? ' on-footer' : ''}`;

  // スムーススクロールでトップへ
  const handlePageTop = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={className}>
      <div className="c-pagetop__icon"></div>
      <a href="#" className="c-pagetop__link" onClick={handlePageTop}>
        PAGE TOP
      </a>
    </div>
  );
}
