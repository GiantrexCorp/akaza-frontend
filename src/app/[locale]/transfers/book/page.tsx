'use client';

import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransferBookingForm from '@/components/TransferBookingForm';
import { Spinner } from '@/components/ui';
import { ProtectedRoute } from '@/lib/auth';

export default function TransferBookPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <Suspense fallback={<div className="pt-36 pb-32"><Spinner size="lg" /></div>}>
        <TransferBookingForm />
      </Suspense>
      <Footer />
    </ProtectedRoute>
  );
}
