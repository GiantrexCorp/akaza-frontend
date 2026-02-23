'use client';

import { useState, type FormEvent } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

const contactInfo = [
  { icon: MapPin, label: 'Address', value: 'Cairo, Egypt' },
  { icon: Phone, label: 'Phone', value: '+20 123 456 789' },
  { icon: Mail, label: 'Email', value: 'info@akazatravel.com' },
  { icon: Clock, label: 'Hours', value: 'Sun — Thu, 9AM — 6PM' },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast('error', 'Please fill in all required fields');
      return;
    }
    setSending(true);
    // Simulate send — in production, call an API endpoint
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    toast('success', 'Message sent! We\'ll get back to you soon.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <>
      <Navbar />

      <section className="pt-32 pb-32 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans mb-3">Contact</p>
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)] leading-none mb-4">
              Get in <span className="italic">Touch</span>
            </h1>
            <p className="text-lg text-[var(--text-muted)] font-sans font-light max-w-2xl">
              Have a question or ready to plan your Egyptian adventure? We&apos;d love to hear from you.
            </p>
            <div className="mt-6 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                  <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Send a Message</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Input label="Your Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={18} />} />
                    <div className="md:col-span-2">
                      <Input label="Subject (optional)" placeholder="How can we help?" value={subject} onChange={(e) => setSubject(e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">Message</p>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your travel plans or ask us anything..."
                      rows={5}
                      className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif text-lg outline-none transition-colors resize-none"
                    />
                  </div>
                  <Button type="submit" variant="gradient" loading={sending} icon={<Send size={14} />}>
                    Send Message
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-5 flex items-start gap-4">
                    <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">{item.label}</p>
                      <p className="text-sm font-serif text-[var(--text-primary)]">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
