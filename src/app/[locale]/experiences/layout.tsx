import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiences | AKAZA Travel',
  description: 'Discover curated luxury experiences across Egypt. Cultural immersion, desert adventures, and coastal retreats.',
};

export default function ExperiencesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
