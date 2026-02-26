import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — AKAZA Travel',
  description: 'AKAZA Travel administration dashboard',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
