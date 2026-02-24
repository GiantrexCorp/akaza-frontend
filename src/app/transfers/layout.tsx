import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transfers | AKAZA Travel',
  description: 'Premium transfer services across Egypt. Executive vehicles, airport pickups, and private chauffeurs.',
};

export default function TransfersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
