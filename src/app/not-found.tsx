import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-[var(--surface-page)] px-6">
        <div className="text-center max-w-xl">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] font-sans mb-4">
            Page Not Found
          </p>
          <h1 className="text-6xl md:text-8xl font-serif text-[var(--text-primary)] mb-6">404</h1>
          <p className="text-[var(--text-secondary)] text-lg font-sans mb-10">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-primary text-primary hover:bg-primary hover:text-white px-10 py-4 uppercase tracking-widest text-xs font-bold font-sans transition-all duration-300"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
