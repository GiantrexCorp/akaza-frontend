import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | AKAZA Travel',
  description: 'Manage your bookings, profile, and notifications in your AKAZA Travel dashboard.',
};

export default function DashboardMetaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
