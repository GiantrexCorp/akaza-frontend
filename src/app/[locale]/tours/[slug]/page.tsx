'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourDetailContent from '@/components/TourDetailContent';
import { Spinner, PageError } from '@/components/ui';
import { useTourDetail, useTourAvailabilities } from '@/hooks/useTours';
import { ApiError } from '@/lib/api/client';
import type { TourAvailability } from '@/types/tour';

export default function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = useTranslations('tours');
  const { slug } = use(params);
  const { data: tour, isLoading, error, refetch } = useTourDetail(slug);

  const hasInlineAvailabilities = !!tour?.availabilities?.length;
  const { data: fetchedAvailabilities } = useTourAvailabilities(
    tour?.id ?? '',
  );

  const availabilities: TourAvailability[] = hasInlineAvailabilities
    ? tour!.availabilities
    : fetchedAvailabilities ?? [];

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-36 pb-32"><Spinner size="lg" /></div>
        <Footer />
      </>
    );
  }

  if (error || !tour) {
    const apiError = error instanceof ApiError ? error : null;
    return (
      <>
        <Navbar />
        <div className="pt-36 pb-32 max-w-7xl mx-auto px-6">
          <PageError
            status={apiError?.status ?? 404}
            title={apiError?.status === 404 ? t('tourNotFound') : undefined}
            onRetry={() => refetch()}
            backHref="/tours"
            backLabel={t('browseTours')}
          />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <TourDetailContent tour={tour} availabilities={availabilities} />
      <Footer />
    </>
  );
}
