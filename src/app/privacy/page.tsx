import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide directly to us, including your name, email address, phone number, and payment information when you create an account, make a booking, or contact us. We also collect information automatically when you use our services, such as your IP address, browser type, and device information.',
  },
  {
    title: 'How We Use Your Information',
    content: 'We use the information we collect to process your bookings, communicate with you about your reservations, send you promotional offers (with your consent), improve our services, and comply with legal obligations. We never sell your personal information to third parties.',
  },
  {
    title: 'Information Sharing',
    content: 'We share your information only with service providers necessary to fulfill your bookings (hotels, tour operators, transport companies), payment processors, and as required by law. All our partners are bound by strict data protection agreements.',
  },
  {
    title: 'Data Security',
    content: 'We implement industry-standard security measures to protect your personal information, including encryption of data in transit and at rest, secure server infrastructure, and regular security audits. However, no method of transmission over the internet is 100% secure.',
  },
  {
    title: 'Cookies',
    content: 'We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze how our services are used. You can manage your cookie preferences through your browser settings.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to access, correct, or delete your personal information. You can update your profile information through your account settings or contact us directly. You may also opt out of marketing communications at any time.',
  },
  {
    title: 'Data Retention',
    content: 'We retain your personal information for as long as your account is active or as needed to provide you services. We will also retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "last updated" date. We encourage you to review this policy periodically.',
  },
  {
    title: 'Contact Us',
    content: 'If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@akazatravel.com or through our Contact page.',
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <section className="pt-32 pb-32 bg-[var(--surface-page)]">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] leading-none mb-4">
            Privacy Policy
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
