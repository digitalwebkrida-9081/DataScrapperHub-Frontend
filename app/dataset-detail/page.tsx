
import React, { Suspense } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import B2bDatasetDetail from '@/components/b2b/B2bDatasetDetail';

// Define Props for Next.js Page (Server Component)
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Helper to title case strings
const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

// Generate Metadata Function
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await searchParams;
  const id = params.id as string | undefined;
  const country = params.country as string | undefined;
  const category = params.category as string | undefined;
  const label = params.label as string | undefined;

  // Merged data: use country + category for metadata
  if (country && category) {
    const titleCategory = toTitleCase(category.replace(/_/g, ' '));
    const titleLocation = label ? decodeURIComponent(label as string) : country.toUpperCase();
    const infoTitle = `List of ${titleCategory} in ${titleLocation}`;
    const infoDesc = `List of ${titleCategory} in ${titleLocation}. Get instant access to verified ${titleCategory} leads. Download email list, phone numbers, and key decision maker contacts.`;

    return {
      title: infoTitle,
      description: infoDesc,
      openGraph: { title: infoTitle, description: infoDesc },
    };
  }
  
  // Old data: fetch by ID
  if (id) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; 
    try {
       const res = await fetch(`${API_URL}/api/scraper/dataset/${id}`, { next: { revalidate: 60 } });
       const result = await res.json();
       if (result.success && result.data) {
          const titleCategory = toTitleCase(result.data.category);
          const titleLocation = toTitleCase(result.data.location);
          const recordCount = result.data.totalRecords ? result.data.totalRecords.toLocaleString() : 'thousands of';
          const infoTitle = `List of ${titleCategory} in ${titleLocation}`;
          const infoDesc = `List of ${titleCategory} in ${titleLocation}. Get instant access to ${recordCount} verified ${titleCategory} leads in ${titleLocation}. Download email list, phone numbers, and key decision maker contacts.`;
          return {
             title: infoTitle,
             description: infoDesc,
             openGraph: { title: infoTitle, description: infoDesc },
             alternates: {
               canonical: `/dataset-detail?id=${id}&label=${encodeURIComponent(`${titleCategory} in ${titleLocation}`)}` 
             }
          };
       }
    } catch (error) {
        console.error("Error generating metadata:", error);
    }
  }
 
  return {
    title: 'Dataset Detail | Data Scraper Hub',
    description: 'View detailed business data and lead lists.'
  };
}


export default async function DatasetDetailPage({ searchParams }: Props) {
  const params = await searchParams;
  const id = params.id as string | undefined;
  const country = params.country as string | undefined;
  const category = params.category as string | undefined;

  // Allow either old id-based or new country+category-based access
  if (!id && (!country || !category)) {
      return <div className="min-h-screen flex items-center justify-center text-slate-500">Invalid Dataset — missing parameters</div>;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading details...</div>}>
       {/* @ts-ignore - JSX component accepts country/category props */}
       <B2bDatasetDetail id={id || ''} country={country} category={category} />
    </Suspense>
  );
}
