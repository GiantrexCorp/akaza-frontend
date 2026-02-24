import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | AKAZA Travel',
  description: 'AKAZA Travel terms of service — the terms and conditions governing your use of our platform.',
};

const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing and using the AKAZA Travel website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.',
  },
  {
    title: 'Booking & Reservations',
    content: 'All bookings made through AKAZA Travel are subject to availability and confirmation. Prices quoted are per person unless otherwise stated and may be subject to change until the booking is confirmed. A booking is considered confirmed only when you receive a confirmation email with a valid booking reference.',
  },
  {
    title: 'Payment',
    content: 'Full payment is required at the time of booking unless otherwise specified. We accept major credit cards and bank transfers. All prices are displayed in the currency indicated and include applicable taxes unless otherwise noted.',
  },
  {
    title: 'Cancellation Policy',
    content: 'Cancellation policies vary depending on the service booked (hotel, tour, or transfer). Specific cancellation terms will be displayed before you confirm your booking. Refunds, if applicable, will be processed to the original payment method within 7-14 business days.',
  },
  {
    title: 'Travel Documents',
    content: 'It is the traveler\'s responsibility to ensure they have valid travel documents including passports, visas, and any required health certificates. AKAZA Travel is not responsible for denied entry due to insufficient documentation.',
  },
  {
    title: 'Limitation of Liability',
    content: 'AKAZA Travel acts as an intermediary between travelers and service providers. While we carefully select our partners, we cannot be held liable for the acts, omissions, or defaults of third-party service providers including hotels, tour operators, and transport companies.',
  },
  {
    title: 'Privacy',
    content: 'Your personal information is collected, stored, and processed in accordance with our Privacy Policy. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.',
  },
  {
    title: 'Changes to Terms',
    content: 'AKAZA Travel reserves the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the service after changes constitutes acceptance of the new terms.',
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <section className="pt-32 pb-32 bg-[var(--surface-page)]">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] leading-none mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mb-2">Last updated: February 2026</p>
          <div className="mt-6 mb-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-serif text-[var(--text-primary)] mb-3">{i + 1}. {section.title}</h2>
                <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
