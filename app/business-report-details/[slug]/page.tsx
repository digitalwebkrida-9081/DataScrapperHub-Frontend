import React, { Suspense } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import B2bDatasetDetail from '@/components/b2b/B2bDatasetDetail';

// Define Props for Next.js Page (Server Component)
type Props = {
  params: Promise<{ slug: string }>
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
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as string;

  if (!slug) {
    return {
      title: 'Dataset Detail | Data Scraper Hub',
      description: 'View detailed business data and lead lists.'
    };
  }

  // Expecting format: list-of-{category}-in-{country}
  // OR just the old id for backward compatibility/simplicity if needed, but the prompt asks for the format:
  // "http://localhost:3000/business-report-details/list-of-remodelers-in-united-states"
  
  // Let's parse the slug
  // Example slug: list-of-remodelers-in-united-states
  // Or list-of-3d-printing-services-in-united-states
  
  let categoryStr = '';
  let countryStr = '';
  
  const match = slug.match(/^list-of-(.+)-in-(.+)$/);
  
  if (match) {
      categoryStr = match[1];
      countryStr = match[2];
  } else {
      // Fallback if the URL structure isn't exactly matching (e.g. just the ID was passed as slug)
      // Usually would do an API call here if it's an ID
      return {
          title: 'Business Data Report | Data Scraper Hub',
          description: 'View detailed business data and lead lists.'
      };
  }

  const titleCategory = toTitleCase(categoryStr.replace(/-/g, ' '));
  const titleLocation = toTitleCase(countryStr.replace(/-/g, ' '));
  
  const infoTitle = `Buy ${titleCategory} B2B Leads - ${titleLocation} Business Data | DataSellerHub`;
  const infoDesc = `Download updated ${titleCategory} B2B leads data in ${titleLocation} with verified emails, direct phone numbers, company details, and geo-targeted data for high-converting outreach.`;

  return {
    title: infoTitle,
    description: infoDesc,
    openGraph: { title: infoTitle, description: infoDesc },
    alternates: {
      canonical: `/business-report-details/${slug}`
    }
  };
}

export default async function DatasetDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as string;

  if (!slug) {
      return <div className="min-h-screen flex items-center justify-center text-slate-500">Invalid Dataset — missing parameters</div>;
  }

  let categoryRaw = '';
  let countryRaw = '';
  
  const match = slug.match(/^list-of-(.+)-in-(.+)$/);
  
  if (match) {
      categoryRaw = match[1];
      countryRaw = match[2];
  } else {
      // If it doesn't match the new pattern, perhaps it's an old ID
      // but let's assume the new pattern for the new route
      return <div className="min-h-screen flex items-center justify-center text-slate-500">Invalid url format</div>;
  }
  
  // Reconstruct category slug as expected by backend (some use hyphens, others rely on exact match. We might need to pass it as it was constructed)
  // The original category was passed like: category=3d-printing-services
  // The original country was passed like: country=united-states or country=US (we will need to handle decoding if it was "united-states")
  
  // Our new format: list-of-category-slug-in-country-name-slug
  // We'll pass the extracted strings to the component and let it handle mapping if needed
  // Note: the component B2bDatasetDetail expects `country` and `category` strings.
  // It uses country internally to fetch `countryCode` by exact matching the country name, so we should convert countryRaw to Title Case spaces.
  
  const countryFormatted = countryRaw.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const categoryFormatted = categoryRaw; // Keep hyphens for the slug, or format if the backend expects something else

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading details...</div>}>
       {/* @ts-ignore - JSX component accepts country/category props */}
       <B2bDatasetDetail id={''} country={countryFormatted} category={categoryFormatted} />
    </Suspense>
  );
}
