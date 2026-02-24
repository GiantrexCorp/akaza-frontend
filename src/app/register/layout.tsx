import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | AKAZA Travel',
  description: 'Create your AKAZA Travel account to start booking luxury travel experiences in Egypt.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
