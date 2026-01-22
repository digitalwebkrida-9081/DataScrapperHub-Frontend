'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import B2bCountryDetail from '@/components/b2b/B2bCountryDetail';

function BusinessReportContent() {
  const searchParams = useSearchParams();
  const country = searchParams.get('country');

  if (!country) return <div>Invalid Country</div>;

  return <B2bCountryDetail countrySlug={country} />;
}

export default function BusinessReportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusinessReportContent />
    </Suspense>
  );
}
