import { NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate every hour

const baseUrl = 'https://stagservice.datasellerhub.com';
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
  // 1. Static Routes
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

  let urls = [...staticRoutes];

  // 2. Dynamic Routes: Countries
  try {
    const res = await fetch(`${apiUrl}/api/country/get-countries`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const countries = data.data || [];

      const countryUrls = countries.flatMap((country: any) => {
        const name = country.country_name || country.name;
        if (!name) return [];
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        
        return [
          {
            url: `${baseUrl}/business-report-view?country=${slug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: '0.7',
          },
          {
            url: `${baseUrl}/location-report?country=${slug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: '0.6',
          },
        ];
      });
      urls = [...urls, ...countryUrls];
    }
  } catch (error) {
    console.error('Sitemap: Error fetching countries', error);
  }

  // 3. Dynamic Routes: Datasets
  const priorityCountries = [
      'United States', 
      'United Kingdom', 
      'Canada', 
      'Australia', 
      'Germany', 
      'France', 
      'India',
      'United Arab Emirates'
  ];

  try {
      const datasetPromises = priorityCountries.map(async (country) => {
           try {
               const res = await fetch(`${apiUrl}/api/scraper/dataset/search?country=${encodeURIComponent(country)}&limit=100`, { next: { revalidate: 3600 } });
               if (!res.ok) return [];
               const result = await res.json();
               return result.datasets || [];
           } catch (e) {
               console.error(`Sitemap: Error fetching datasets for ${country}`, e);
               return [];
           }
      });

      const datasetsArrays = await Promise.all(datasetPromises);
      const allDatasets = datasetsArrays.flat();

      const datasetUrls = allDatasets.map((ds: any) => {
           const locationPart = ds.location ? ds.location.split(',').pop().trim() : 'global';
           // Strict alphanumeric for label to be safe, but we will escape the URL anyway
           const label = `${ds.category}-in-${locationPart}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
           
           return {
              url: `${baseUrl}/dataset-detail?id=${ds.id}&label=${label}`,
              lastModified: ds.lastUpdate ? new Date(ds.lastUpdate).toISOString() : new Date().toISOString(),
              changeFrequency: 'weekly',
              priority: '0.6',
           };
      });
      
      urls = [...urls, ...datasetUrls];

  } catch (error) {
    console.error('Sitemap: Error fetching datasets', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((item) => `
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
