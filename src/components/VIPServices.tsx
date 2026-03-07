import { ClipboardCheck, Car, Headphones } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ServiceCard from "./ServiceCard";

export default async function VIPServices() {
  const t = await getTranslations('home');

  const services = [
    {
      icon: ClipboardCheck,
      title: t('vipPlanning'),
      description: t('vipPlanningDesc'),
    },
    {
      icon: Car,
      title: t('vipTransfers'),
      description: t('vipTransfersDesc'),
    },
    {
      icon: Headphones,
      title: t('vipConcierge'),
      description: t('vipConciergeDesc'),
    },
  ];
  return (
    <section id="vip" className="py-32 bg-[var(--surface-section)] relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-6 font-sans">
            {t('vipSuperTitle')}
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-7xl font-serif text-[var(--text-primary)] mb-8 tracking-tight">
            {t('vipTitle')}
          </h3>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10" />
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg font-light leading-relaxed font-sans">
            {t('vipSubtitle')}
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-white px-12 py-5 font-bold uppercase tracking-widest text-xs transition-all duration-300">
            {t('vipCta')}
          </button>
        </div>
      </div>
    </section>
  );
}
