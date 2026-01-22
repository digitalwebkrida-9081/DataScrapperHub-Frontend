'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import B2bDatasetDetail from '@/components/b2b/B2bDatasetDetail';

function DatasetDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) return <div>Invalid Dataset ID</div>;

  return <B2bDatasetDetail id={id} />;
}

export default function DatasetDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DatasetDetailContent />
    </Suspense>
  );
}
