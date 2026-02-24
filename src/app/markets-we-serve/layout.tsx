import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markets We Serve | AKAZA Travel',
  description: 'Serving luxury travelers across Europe, the Middle East, and beyond with bespoke Egypt travel programs.',
};

export default function MarketsWeServeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
