import { NextResponse } from 'next/server';

export const revalidate = 3600;

const baseUrl = 'https://datasellerhub.com';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stagservice.datasellerhub.com';

// Map country codes to full names for URL slugs
const countryCodeToName: Record<string, string> = {
  'US': 'united-states',
  'GB': 'united-kingdom',
  'UK': 'united-kingdom',
  'CA': 'canada',
  'AU': 'australia',
  'IN': 'india',
  'DE': 'germany',
  'FR': 'france',
  'NL': 'netherlands',
  'AE': 'uae',
};

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
  const countryCode = searchParams.get('country');

  if (!countryCode) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { 'Content-Type': 'application/xml' } }
    );
  }

  let datasetUrls: any[] = [];

  try {
    // First, get the country name from the merged countries API
    let countrySlug = countryCodeToName[countryCode.toUpperCase()] || countryCode.toLowerCase();

    // Try to get actual country name from API if not in our map
    try {
      const countriesRes = await fetch(`${apiUrl}/api/merged/countries`, { next: { revalidate: 3600 } });
      if (countriesRes.ok) {
        const countriesResult = await countriesRes.json();
        const countries = countriesResult.data?.countries || [];
        const match = countries.find((c: any) => c.code?.toUpperCase() === countryCode.toUpperCase());
        if (match?.name) {
          countrySlug = match.name.toLowerCase().replace(/\s+/g, '-');
        }
      }
    } catch (e) {
      // Use fallback from map
    }

    // Fetch ALL categories for this country using the merged data API
    const res = await fetch(
      `${apiUrl}/api/merged/categories?country=${encodeURIComponent(countryCode)}&limit=10000`,
      { next: { revalidate: 3600 } }
    );

    if (res.ok) {
      const result = await res.json();
      const categories = result.data?.categories || [];

      datasetUrls = categories.map((cat: any) => {
        const categorySlug = cat.name; // Already slugified (e.g., "schools", "restaurants")

        return {
          url: `${baseUrl}/business-report-details/list-of-${categorySlug}-in-${countrySlug}`,
          lastModified: cat.lastModified ? new Date(cat.lastModified).toISOString() : new Date().toISOString(),
          changeFrequency: 'weekly',
          priority: '0.6',
        };
      });
    }
  } catch (error) {
    console.error(`Sitemap: Error fetching categories for ${countryCode}`, error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${datasetUrls.map((item) => `
  <url>
    <loc>${escapeXml(item.url)}</loc>
    <lastmod>${item.lastModified}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
