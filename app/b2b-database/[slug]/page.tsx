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

  // Expecting format: leads-list-of-{category}-in-{country}
  // New format requested by user: b2b-database/leads-list-of-Abbeys-in-united-states
  
  let categoryStr = '';
  let countryStr = '';
  
  const match = slug.match(/^leads-list-of-(.+)-in-(.+)$/);
  
  if (match) {
      categoryStr = match[1];
      countryStr = match[2];
  } else {
      // Fallback if the URL structure isn't exactly matching
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
      canonical: `/b2b-database/${slug}`
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
  
  const match = slug.match(/^leads-list-of-(.+)-in-(.+)$/);
  
  if (match) {
      categoryRaw = match[1];
      countryRaw = match[2];
  } else {
      return <div className="min-h-screen flex items-center justify-center text-slate-500">Invalid url format</div>;
  }
  
  // Reconstruct country name and category
  const countryFormatted = countryRaw.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const categoryFormatted = categoryRaw;

  // Function to map country to code
  const countryNameToCode = (name: string) => {
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://service.datasellerhub.com';
  const countryApiCode = countryNameToCode(countryFormatted);
  let initialDataset = null;

  try {
    // Fetch data just like the component does
    const [dataRes, catRes] = await Promise.all([
        fetch(`${API_URL}/api/merged/data?country=${countryApiCode}&category=${categoryFormatted}&page=1&limit=10`, { next: { revalidate: 3600 } }),
        fetch(`${API_URL}/api/merged/categories?country=${countryApiCode}&limit=1000`, { next: { revalidate: 3600 } })
    ]);
    
    const dataResult = await dataRes.json();
    const catResult = await catRes.json();

    const catInfo = catResult.success && catResult.data?.categories
        ? catResult.data.categories.find((c: any) => c.name === categoryFormatted)
        : null;

    const dataTotal = dataResult.data?.pagination?.total || 0;
    const totalRecords = catInfo?.records || dataTotal || 0;
    const rows = dataResult.success ? (dataResult.data?.data || dataResult.data?.rows || []) : [];
    const locationName = countryFormatted.toUpperCase();
    const categoryDisplayName = catInfo?.displayName || categoryFormatted.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const firstRow = rows[0] || {};
    const columns = Object.keys(firstRow);
    const hasEmail = catInfo?.hasEmail || columns.some(c => c.toLowerCase().includes('email'));
    const hasPhone = catInfo?.hasPhone || columns.some(c => c.toLowerCase().includes('phone'));
    const hasWebsite = catInfo?.hasWebsite || columns.some(c => c.toLowerCase().includes('website') || c.toLowerCase().includes('url'));
    const hasLinkedin = catInfo?.hasLinkedin || columns.some(c => c.toLowerCase().includes('linkedin'));
    const hasFacebook = catInfo?.hasFacebook || columns.some(c => c.toLowerCase().includes('facebook'));
    const hasInstagram = catInfo?.hasInstagram || columns.some(c => c.toLowerCase().includes('instagram'));
    const hasTwitter = catInfo?.hasTwitter || columns.some(c => c.toLowerCase().includes('twitter'));
    const hasTiktok = catInfo?.hasTiktok || columns.some(c => c.toLowerCase().includes('tiktok'));
    const hasYoutube = catInfo?.hasYoutube || columns.some(c => c.toLowerCase().includes('youtube'));

    const sampleList = rows.slice(0, 10).map((row: any, idx: number) => {
        const nameCol = columns.find(c => /^(name|business|company|title)/i.test(c)) || columns[0];
        const cityCol = columns.find(c => /^city/i.test(c));
        const stateCol = columns.find(c => /^(state|province|region)/i.test(c));
        const countryCol = columns.find(c => /^country/i.test(c));
        const websiteCol = columns.find(c => /^(website|url)/i.test(c));
        const ratingCol = columns.find(c => /^(rating|stars)/i.test(c));
        const reviewCol = columns.find(c => /^(review|total.?review)/i.test(c));
        
        return {
            name: row[nameCol] || `${categoryDisplayName} ${idx + 1}`,
            city: cityCol ? row[cityCol] : '',
            state: stateCol ? row[stateCol] : '',
            country: countryCol ? row[countryCol] : locationName,
            website: websiteCol ? row[websiteCol] : '',
            rating: ratingCol ? row[ratingCol] : (4 + Math.random()).toFixed(1),
            reviews: reviewCol ? row[reviewCol] : Math.floor(Math.random() * 500)
        };
    });

    initialDataset = {
        id: `merged-${countryFormatted}-${categoryFormatted}`,
        category: categoryDisplayName,
        location: locationName,
        totalRecords: totalRecords,
        emailCount: hasEmail ? totalRecords : 0,
        totalEmails: hasEmail ? totalRecords : 0,
        phones: hasPhone ? totalRecords : 0,
        totalPhones: hasPhone ? totalRecords : 0,
        websiteCount: hasWebsite ? Math.floor(totalRecords * 0.7) : 0,
        totalWebsites: hasWebsite ? Math.floor(totalRecords * 0.7) : 0,
        linkedinCount: hasLinkedin ? Math.floor(totalRecords * 0.6) : 0, totalLinkedin: hasLinkedin ? Math.floor(totalRecords * 0.6) : 0,
        facebookCount: hasFacebook ? Math.floor(totalRecords * 0.65) : 0, totalFacebook: hasFacebook ? Math.floor(totalRecords * 0.65) : 0,
        instagramCount: hasInstagram ? Math.floor(totalRecords * 0.5) : 0, totalInstagram: hasInstagram ? Math.floor(totalRecords * 0.5) : 0,
        twitterCount: hasTwitter ? Math.floor(totalRecords * 0.3) : 0, totalTwitter: hasTwitter ? Math.floor(totalRecords * 0.3) : 0,
        tiktokCount: hasTiktok ? Math.floor(totalRecords * 0.2) : 0, totalTiktok: hasTiktok ? Math.floor(totalRecords * 0.2) : 0,
        youtubeCount: hasYoutube ? Math.floor(totalRecords * 0.25) : 0, totalYoutube: hasYoutube ? Math.floor(totalRecords * 0.25) : 0,
        price: catInfo?.price ? parseFloat(String(catInfo.price).replace(/[^0-9.]/g, '')) : 199,
        previousPrice: catInfo?.previousPrice ? parseFloat(String(catInfo.previousPrice).replace(/[^0-9.]/g, '')) : 398,
        lastUpdate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        sampleList: sampleList,
        countryCode: countryFormatted.toUpperCase(),
        mergedData: true
    };
  } catch (e) {
      console.warn("Server-side merged data fetch failed:", e);
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading details...</div>}>
       {/* @ts-ignore - JSX component accepts country/category props */}
       <B2bDatasetDetail id={''} country={countryFormatted} category={categoryFormatted} initialDataset={initialDataset} />
    </Suspense>
  );
}
