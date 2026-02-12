
import React, { Suspense } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import Locationreport from '@/components/location-report/Location-report';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await searchParams;
  const countrySlug = params.country;
  
  if (countrySlug && typeof countrySlug === 'string') {
       const countryName = decodeURIComponent(countrySlug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
       return {
           title: `${countryName} Web Scraping Services & Data Lists`,
           description: `Find top web scraping services and business data lists for ${countryName}.`,
           alternates: {
               canonical: `/location-report?country=${encodeURIComponent(countrySlug)}`
           }
       };
  }
 
  return {
    title: 'Location Reports | Data Scraper Hub',
    description: 'Find web scraping services by location.',
  };
}

export default async function LocationReportPage({ searchParams }: Props) {
  const params = await searchParams;
  const country = params.country as string | undefined;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading location report...</div>}>
       <Locationreport initialCountrySlug={country as any} />
    </Suspense>
  );
}
