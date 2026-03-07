import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How We Work | AKAZA Travel',
  description: 'Our process — from initial consultation to a fully curated luxury travel experience in Egypt.',
};

export default function HowWeWorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
