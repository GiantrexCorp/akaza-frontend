import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | AKAZA Travel',
  description: 'Sign in to your AKAZA Travel account to manage bookings and access your dashboard.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
