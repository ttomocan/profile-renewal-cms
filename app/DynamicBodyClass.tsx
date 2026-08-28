'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DynamicBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    let bodyClassName = '';

    if (pathname === '/') {
      bodyClassName = 'top';
    } else if (pathname.includes('/about')) {
      bodyClassName = 'about';
    } else if (pathname.includes('/skill')) {
      bodyClassName = 'skill';
    } else if (pathname.includes('/contact')) {
      bodyClassName = 'contact';
    } else if (pathname.includes('/diary')) {
      bodyClassName = 'diary';
    }

    const body = document.body;
    const pageClasses = ['top', 'about', 'skill', 'contact', 'diary'];
    pageClasses.forEach((className) => body.classList.remove(className));

    if (bodyClassName) {
      body.classList.add(bodyClassName);
    }

    const removeUnwantedAttributes = () => {
      const unwantedAttributes = [
        'cz-shortcut-listen',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
      ];

      unwantedAttributes.forEach((attribute) => {
        if (body.hasAttribute(attribute)) {
          body.removeAttribute(attribute);
        }
      });
    };

    removeUnwantedAttributes();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          removeUnwantedAttributes();
        }
      });
    });

    observer.observe(body, { attributes: true });

    return () => {
      if (bodyClassName) {
        body.classList.remove(bodyClassName);
      }
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
