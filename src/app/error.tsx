'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-[var(--surface-page)] px-6">
        <div className="text-center max-w-xl">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] font-sans mb-4">
            Something Went Wrong
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-[var(--text-primary)] mb-6">Error</h1>
          <p className="text-[var(--text-secondary)] text-lg font-sans mb-10">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center border border-primary text-primary hover:bg-primary hover:text-white px-10 py-4 uppercase tracking-widest text-xs font-bold font-sans transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
