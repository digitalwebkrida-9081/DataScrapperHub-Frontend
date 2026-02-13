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
  let sitemaps: any[] = [];
  
  try {
    // Fetch all available countries
    const res = await fetch(`${apiUrl}/api/country/get-countries`, { next: { revalidate: 3600 } });
    if (res.ok) {
        const data = await res.json();
        const countries = data.data || [];

        sitemaps = countries.map((country: any) => {
            const countryName = country.country_name || country.name;
            if (!countryName) return null;
            // Use country name as query param
            return {
                url: `${baseUrl}/b2b-country-sitemap?country=${encodeURIComponent(countryName)}`,
                lastModified: new Date().toISOString()
            };
        }).filter(Boolean);
    }
  } catch (error) {
    console.error('Sitemap: Error fetching countries', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map((item) => `
  <sitemap>
    <loc>${escapeXml(item.url)}</loc>
    <lastmod>${item.lastModified}</lastmod>
  </sitemap>
  `).join('')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
