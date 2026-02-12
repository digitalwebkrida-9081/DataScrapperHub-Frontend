
import React, { Suspense } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import B2bDatasetDetail from '@/components/b2b/B2bDatasetDetail';

// Define Props for Next.js Page (Server Component)
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate Metadata Function
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await searchParams;
  const id = params.id;
  
  if (!id || typeof id !== 'string') {
      return {
          title: 'Dataset Detail | Data Scraper Hub',
          description: 'View dataset details and download leads.'
      };
  }

  // Fetch data for metadata
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; 
  
  try {
     const res = await fetch(`${API_URL}/api/scraper/dataset/${id}`, { next: { revalidate: 60 } });
     const result = await res.json();

     if (result.success && result.data) {
        const { category, location, totalRecords } = result.data;
        
        // Helper to title case strings
        const toTitleCase = (str: string) => {
            if (!str) return '';
            return str.replace(
                /\w\S*/g,
                (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        };

        const titleCategory = toTitleCase(category);
        const titleLocation = toTitleCase(location);
        const recordCount = totalRecords ? totalRecords.toLocaleString() : 'thousands of';
        
        const infoTitle = `List of ${titleCategory} in ${titleLocation}`;
        const infoDesc = `List of ${titleCategory} in ${titleLocation}. Get instant access to ${recordCount} verified ${titleCategory} leads in ${titleLocation}. Download email list, phone numbers, and key decision maker contacts.`;

        return {
           title: infoTitle,
           description: infoDesc,
           openGraph: {
              title: infoTitle,
              description: infoDesc,
           },
           alternates: {
             canonical: `/dataset-detail?id=${id}&label=${encodeURIComponent(`${titleCategory} in ${titleLocation}`)}` 
           }
        };
     }
  } catch (error) {
      console.error("Error generating metadata:", error);
  }
 
  return {
    title: 'Dataset Detail | Data Scraper Hub',
    description: 'View detailed business data and lead lists.'
  };
}


export default async function DatasetDetailPage({ searchParams }: Props) {
  const params = await searchParams;
  const id = params.id;

  if (!id || typeof id !== 'string') {
      return <div>Invalid Dataset ID</div>;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading details...</div>}>
       {/* Pass ID as prop to Client Component */}
       <B2bDatasetDetail id={id} />
    </Suspense>
  );
}
