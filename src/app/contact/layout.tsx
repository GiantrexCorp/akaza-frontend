import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | AKAZA Travel',
  description: 'Get in touch with AKAZA Travel. Speak to a travel advisor and start planning your luxury Egypt journey.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
