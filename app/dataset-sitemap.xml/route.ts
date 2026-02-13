import { NextResponse } from 'next/server';

export const revalidate = 3600;

const baseUrl = 'https://stag.datasellerhub.com';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stagservice.datasellerhub.com';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  let datasetUrls: any[] = [];
  
  try {
    // 1. Fetch all available countries
    const countryRes = await fetch(`${apiUrl}/api/country/get-countries`, { next: { revalidate: 3600 } });
    let countries: any[] = [];
    if (countryRes.ok) {
        const countryData = await countryRes.json();
        countries = countryData.data || [];
    }

    // 2. Fetch datasets for each country with batching to avoid server overload
    const BATCH_SIZE = 5;
    const allDatasets: any[] = [];
    
    for (let i = 0; i < countries.length; i += BATCH_SIZE) {
        const batch = countries.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(async (country: any) => {
            const countryName = country.country_name || country.name;
            if (!countryName) return [];

            try {
                // Fetch datasets for this country
                const res = await fetch(`${apiUrl}/api/scraper/dataset/search?country=${encodeURIComponent(countryName)}&limit=1000`, { next: { revalidate: 3600 } });
                if (!res.ok) return [];
                const result = await res.json();
                return result.datasets || [];
            } catch (e) {
                console.error(`Sitemap: Error fetching datasets for ${countryName}`, e);
                return [];
            }
        });

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(datasets => allDatasets.push(...datasets));
    }

      datasetUrls = allDatasets.map((ds: any) => {
           const locationPart = ds.location ? ds.location.split(',').pop().trim() : 'global';
           const label = `${ds.category}-in-${locationPart}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
           
           return {
              url: `${baseUrl}/dataset-detail?id=${ds.id}&label=${label}`,
              lastModified: ds.lastUpdate ? new Date(ds.lastUpdate).toISOString() : new Date().toISOString(),
              changeFrequency: 'weekly',
              priority: '0.6',
           };
      });

  } catch (error) {
    console.error('Sitemap: Error fetching datasets', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${datasetUrls.map((item) => `
  <url>
    <loc>${escapeXml(item.url)}</loc>
    <lastmod>${item.lastModified}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>
  `).join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
