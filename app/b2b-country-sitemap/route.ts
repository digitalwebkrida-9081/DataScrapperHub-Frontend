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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');

  if (!country) {
      // Return empty urlset if no country specified
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
         <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, 
        {headers: {'Content-Type': 'application/xml'}}
      );
  }

  let datasetUrls: any[] = [];
  
  try {
       // Fetch datasets for this specific country
       // Using limit=1000 or higher to get all records
       const res = await fetch(`${apiUrl}/api/scraper/dataset/search?country=${encodeURIComponent(country)}&limit=2000`, { next: { revalidate: 3600 } });
       
       if (res.ok) {
           const result = await res.json();
           const datasets = result.datasets || [];

           datasetUrls = datasets.map((ds: any) => {
                const locationPart = ds.location ? ds.location.split(',').pop().trim() : 'global';
                const label = `${ds.category}-in-${locationPart}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                
                return {
                   url: `${baseUrl}/dataset-detail?id=${ds.id}&label=${label}`,
                   lastModified: ds.lastUpdate ? new Date(ds.lastUpdate).toISOString() : new Date().toISOString(),
                   changeFrequency: 'weekly',
                   priority: '0.6',
                };
           });
       }
  } catch (error) {
    console.error(`Sitemap: Error fetching datasets for ${country}`, error);
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
