import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concierge Services | AKAZA Travel',
  description: 'Premium concierge services — private tours, VIP transfers, restaurant reservations, and bespoke itineraries.',
};

export default function ConciergeServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
