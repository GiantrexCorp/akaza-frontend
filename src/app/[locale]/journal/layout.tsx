import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal | AKAZA Travel',
  description: 'The AKAZA Travel journal — editorial travel insights, destination guides, and luxury travel trends.',
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
