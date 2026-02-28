'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { PhoneInput, type E164Number } from '@/components/ui';
import { validatePhone } from '@/lib/validation/phone';
import { useFormValidation } from '@/hooks/useFormValidation';
import { contactSchema } from '@/lib/validation/schemas/contact';

const destinations = [
  'Cairo & Giza',
  'Red Sea & Hurghada',
  'Luxor & Aswan',
  'Marsa Alam',
  'Sharm El Sheikh',
  'Multi-Destination Journey',
];

export default function ContactForm() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<E164Number | undefined>(undefined);
  const [destination, setDestination] = useState('');
  const [vision, setVision] = useState('');
  const [sending, setSending] = useState(false);
  const { errors, validate, clearError } = useFormValidation(contactSchema);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate({ name, email, destination, vision })) return;
    const phoneErr = validatePhone(phone);
    if (phoneErr) { toast('error', phoneErr); return; }

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setSending(false);
    toast('success', "Inquiry submitted. We'll contact you shortly.");
    setName('');
    setEmail('');
    setPhone(undefined);
    setDestination('');
    setVision('');
  };

  return (
    <div
      data-reveal
      className="reveal-item border border-[var(--line-soft)] bg-[var(--contact-form-surface)] p-7 shadow-[var(--contact-form-shadow)] md:p-8"
    >
      <h2 className="text-4xl font-serif md:text-5xl">Inquiry Form</h2>
      <div className="mt-4 h-px w-20 bg-gradient-to-r from-primary to-primary-gradient-end" />

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
          <Field
            label="Full Name"
            placeholder="Jonathan Doe"
            value={name}
            onChange={(v) => { setName(v); clearError('name'); }}
            error={errors.name}
          />
          <Field
            label="Email Address"
            type="email"
            placeholder="concierge@example.com"
            value={email}
            onChange={(v) => { setEmail(v); clearError('email'); }}
            error={errors.email}
          />
          <PhoneInput
            label="Phone Number"
            value={phone}
            onChange={setPhone}
          />

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--contact-form-label)]">
              Destination Of Interest
            </label>
            <div className="relative mt-2">
              <select
                value={destination}
                onChange={(e) => { setDestination(e.target.value); clearError('destination'); }}
                className={`contact-select h-12 w-full appearance-none border-b border-[var(--contact-form-line)] bg-transparent pr-8 text-base ${
                  destination ? 'text-[var(--contact-form-text)]' : 'text-[var(--contact-form-placeholder)]'
                } outline-none transition-colors focus:border-primary`}
              >
                <option value="" disabled>
                  Select a destination
                </option>
                {destinations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[var(--contact-form-label)]"
              />
            </div>
            {errors.destination && (
              <p className="mt-1 text-xs text-red-400">{errors.destination}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--contact-form-label)]">
            Your Vision
          </label>
          <textarea
            rows={4}
            value={vision}
            onChange={(e) => { setVision(e.target.value); clearError('vision'); }}
            placeholder="How can we design your unforgettable journey?"
            className="mt-2 w-full resize-none border-b border-[var(--contact-form-line)] bg-transparent py-2 text-base text-[var(--contact-form-text)] placeholder-[var(--contact-form-placeholder)] outline-none transition-colors focus:border-primary"
          />
          {errors.vision && (
            <p className="mt-1 text-xs text-red-400">{errors.vision}</p>
          )}
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex h-12 items-center gap-2 border border-primary/65 bg-primary px-7 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 hover:bg-primary-gradient-end disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? 'Submitting...' : 'Submit Inquiry'}
            <ArrowRight size={13} />
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  type?: 'text' | 'email';
  error?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--contact-form-label)]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full border-b border-[var(--contact-form-line)] bg-transparent text-base text-[var(--contact-form-text)] placeholder-[var(--contact-form-placeholder)] outline-none transition-colors focus:border-primary"
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
