import { useEffect } from 'react';

export function useScrollReveal(options?: { threshold?: number; rootMargin?: string }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: options?.threshold ?? 0.18, rootMargin: options?.rootMargin ?? '0px 0px -10% 0px' }
    );
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}
