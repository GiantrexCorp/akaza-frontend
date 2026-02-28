'use client';

import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HotelBookingForm from '@/components/HotelBookingForm';
import { Spinner } from '@/components/ui';
import { ProtectedRoute } from '@/lib/auth';

export default function HotelBookPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <Suspense fallback={<div className="pt-36 pb-32"><Spinner size="lg" /></div>}>
        <HotelBookingForm />
      </Suspense>
      <Footer />
    </ProtectedRoute>
  );
}
