import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hotels | AKAZA Travel',
  description: 'Search and book luxury hotels across Egypt. Handpicked stays with the finest amenities and service.',
};

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
