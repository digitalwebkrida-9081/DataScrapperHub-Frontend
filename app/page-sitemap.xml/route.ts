import { NextResponse } from 'next/server';

export const revalidate = 3600;

const baseUrl = 'https://stag.datasellerhub.com';

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
  const staticRoutes = [
    '',
    '/b2b',
    '/business-report-view',
    '/location-report',
    '/maps-scraper',
    '/contact',
    '/privacy-policy',
    '/gdpr',
    '/faq',
    '/service/ecom-scraping',
    '/service/news-monitoring-data-scraping',
    '/service/real-estate-data-scraping',
    '/service/recruitment-scraping',
    '/service/research-data-scraping',
    '/service/retail-data-scraping',
    '/service/sales-leads-data',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? '1.0' : '0.8',
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes.map((item) => `
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
