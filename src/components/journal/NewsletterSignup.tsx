export default function NewsletterSignup() {
  return (
    <section className="bg-[var(--surface-section)] px-6 pb-16">
      <div
        data-reveal
        className="reveal-item mx-auto max-w-5xl border border-[var(--line-soft)] bg-[linear-gradient(120deg,rgba(185,117,50,0.2),rgba(16,33,39,0.5),rgba(185,117,50,0.18))] p-8 md:p-10 text-center"
      >
        <h3 className="text-4xl md:text-5xl font-serif italic text-[var(--text-primary)]">The Akaza Ledger</h3>
        <p className="mt-3 max-w-2xl mx-auto text-[var(--text-secondary)]">
          Subscribe for rare insights, destination previews, and early access to private journals.
        </p>
        <form className="mt-7 mx-auto flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email Address"
            className="h-12 flex-1 border border-[var(--line-strong)] bg-[var(--surface-card)]/65 px-4 text-sm text-[var(--field-text)] placeholder-[var(--field-placeholder)] outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="h-12 border border-primary/65 bg-primary px-7 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-primary-gradient-end"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
