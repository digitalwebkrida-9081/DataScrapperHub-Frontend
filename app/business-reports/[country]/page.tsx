import React, { Suspense } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import B2bCountryDetail from '@/components/b2b/B2bCountryDetail';

type Props = {
  params: Promise<{ country: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const countrySlug = resolvedParams.country;
  
  if (!countrySlug || typeof countrySlug !== 'string') {
      return {
          title: 'Business Reports | Data Scraper Hub',
          description: 'Explore global business data and leads.'
      };
  }

  // Simple decoding for instant SEO response
  const countryName = decodeURIComponent(countrySlug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
      title: `${countryName} Business Database | B2B Leads & Company Records`,
      description: `Access comprehensive B2B leads, verified company data, and market insights for ${countryName}. Drill down by state or explore top industry categories to fuel your growth.`,
      openGraph: {
          title: `${countryName} Business Data Reports`,
          description: `Get verified B2B leads in ${countryName}.`,
      },
      alternates: {
        canonical: `/business-reports/${encodeURIComponent(countrySlug)}`
      }
  };
}

export default async function BusinessReportPage({ params }: Props) {
  const resolvedParams = await params;
  const countrySlug = resolvedParams.country;

  if (!countrySlug || typeof countrySlug !== 'string') {
      return <div>Invalid Country Parameter</div>;
  }

  // Define API and Helper function
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://service.datasellerhub.com';
  const countryFormatted = decodeURIComponent(countrySlug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const getCountryCode = (name: string) => {
    const map: Record<string, string> = {
        'united states': 'US', 'united kingdom': 'UK', 'canada': 'CA',
        'australia': 'AU', 'india': 'IN', 'germany': 'DE',
        'france': 'FR', 'japan': 'JP', 'brazil': 'BR', 'mexico': 'MX',
        'bangladesh': 'BD', 'south africa': 'ZA', 'indonesia': 'ID',
        'italy': 'IT', 'spain': 'ES', 'turkey': 'TR', 'pakistan': 'PK',
        'nigeria': 'NG', 'egypt': 'EG', 'thailand': 'TH',
        'philippines': 'PH', 'malaysia': 'MY', 'saudi arabia': 'SA',
        'uae': 'AE', 'united arab emirates': 'AE', 'south korea': 'KR',
        'nepal': 'NP', 'sri lanka': 'LK', 'singapore': 'SG',
        'new zealand': 'NZ', 'netherlands': 'NL', 'sweden': 'SE',
        'switzerland': 'CH', 'poland': 'PL', 'argentina': 'AR',
        'colombia': 'CO', 'chile': 'CL', 'kenya': 'KE'
    };
    const lower = (name || '').toLowerCase().trim();
    if (lower.length <= 3 && !lower.includes(' ')) return name.toUpperCase();
    return map[lower] || name;
  };

  const countryCodeToUse = getCountryCode(countryFormatted);
  let initialStates = [];
  let initialCategories = [];

  try {
     // Fetch categories and API states in PARALLEL server-side
     const [catRes, statesRes] = await Promise.all([
         fetch(`${API_URL}/api/merged/categories?country=${countryCodeToUse}&limit=200`, { next: { revalidate: 60 } }),
         fetch(`${API_URL}/api/location/states?country=${encodeURIComponent(countryFormatted)}`, { next: { revalidate: 60 } })
     ]);

     const catResult = await catRes.json();
     if (catResult.success && catResult.data) {
         if (catResult.data.categories) {
             initialCategories = catResult.data.categories;
         } else if (Array.isArray(catResult.data)) {
             initialCategories = catResult.data;
         }
     }

     const statesResult = await statesRes.json();
     if (statesResult.success && statesResult.data?.length > 0) {
         initialStates = statesResult.data;
     }
  } catch (error) {
     console.error("Error fetching business report initial data:", error);
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading report...</div>}>
       {/* @ts-ignore */}
       <B2bCountryDetail countrySlug={countrySlug} initialStates={initialStates} initialCategories={initialCategories} />
    </Suspense>
  );
}
