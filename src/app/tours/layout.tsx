import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tours | AKAZA Travel',
  description: 'Browse curated luxury tours across Egypt. Private excursions, cultural experiences, and guided adventures.',
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
