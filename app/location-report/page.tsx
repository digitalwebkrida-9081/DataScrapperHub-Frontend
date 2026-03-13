
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
    title: 'Location Data Reports & Store Location Intelligence | DataSellerHub',
    description: 'Get detailed location reports including store details, contact information, pickup options, and amenities. Use accurate location intelligence to improve retail research and market analysis.',
  };
}

export default async function LocationReportPage({ searchParams }: Props) {
  const params = await searchParams;
  const country = params.country as string | undefined;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://service.datasellerhub.com';
  let initialCountries = [];
  let initialDatasets = [];
  // Use user-provided country, or default to United States
  const targetCountry = country ? decodeURIComponent(country).replace(/-/g, ' ') : 'United States';

  try {
      // 1. Fetch available countries
      const countryRes = await fetch(`${API_URL}/api/country/get-countries`, { next: { revalidate: 3600 } });
      const countryResult = await countryRes.json();
      
      if (countryResult.success) {
          initialCountries = countryResult.data || [];
      }

      // 2. Fetch datasets for the initial country
      const query = `?country=${encodeURIComponent(targetCountry)}`;
      const datasetRes = await fetch(`${API_URL}/api/scraper/dataset/search${query}`, { next: { revalidate: 3600 } });
      const datasetResult = await datasetRes.json();

      if (datasetResult.success) {
          initialDatasets = datasetResult.datasets || datasetResult.data || [];
      }
  } catch (error) {
      console.error("Error fetching initial location report data:", error);
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading location report...</div>}>
       {/* @ts-ignore */}
       <Locationreport 
            initialCountrySlug={country as any} 
            initialCountries={initialCountries} 
            initialDatasets={initialDatasets} 
       />
    </Suspense>
  );
}
