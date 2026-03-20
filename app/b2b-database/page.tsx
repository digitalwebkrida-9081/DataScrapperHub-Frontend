import type { Metadata } from 'next';
import B2bdatabase from '@/components/b2b/B2bdatabase';

export const metadata: Metadata = {
  title: 'B2B Database & Business Leads Provider | DataSellerHub',
  description: 'Access targeted B2B databases including company details, emails, and phone numbers for lead generation, marketing, and sales. Get accurate business data with DataSellerHub.',
};

export default async function B2bPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stagservice.datasellerhub.com';
  
  // We'll fetch the initial fast data for the default country (United States)
  // so Google sees the first page fully loaded without JS.
  const countryCode = 'US';
  const countryName = 'United States';
  const ITEMS_PER_PAGE = 20;

  let initialCountries = [];
  let initialDatasets = [];
  let initialTotalPages = 1;
  let initialTotalCategories = 0;

  try {
    // Fetch countries and initial categories
    const [countriesRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/api/merged/countries`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/merged/categories?country=${countryCode}&page=1&limit=${ITEMS_PER_PAGE}`, { next: { revalidate: 60 } })
    ]);

    const countriesData = await countriesRes.json();
    const categoriesData = await categoriesRes.json();

    if (countriesData.success && countriesData.data?.countries) {
      initialCountries = countriesData.data.countries.map((c: any) => ({
        country_name: c.name,
        name: c.name,
        code: c.code,
        totalCategories: c.totalCategories
      }));
    }

    if (categoriesData.success && categoriesData.data?.categories) {
      const cats = categoriesData.data.categories;
      if (categoriesData.data.pagination) {
        initialTotalPages = categoriesData.data.pagination.totalPages;
        initialTotalCategories = categoriesData.data.pagination.totalCategories;
      } else {
        initialTotalCategories = cats.length;
      }

      initialDatasets = cats.map((cat: any, idx: number) => {
        const records = cat.records || 0;
        return {
            id: `merged-${countryCode}-${cat.name}-${idx}`,
            name: `List Of ${cat.displayName} in ${countryName}`,
            records: records > 0 ? records.toLocaleString() : '—',
            emails: cat.hasEmail ? records.toLocaleString() : '0',
            phones: cat.hasPhone ? records.toLocaleString() : '0',
            full_address: `Last Updated: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
            price: cat.price ? `$${cat.price}` : '$199',
            isDataset: true,
            displayLoc: countryName,
            category: cat.displayName,
            categorySlug: cat.name,
            countryCode: countryCode,
            countryName: countryName,
            stateName: '',
            cityName: ''
        };
      });
    }
  } catch (error) {
    console.error("Error fetching initial B2B page data:", error);
  }

  return <B2bdatabase 
    initialDatasets={initialDatasets}
    initialCountries={initialCountries}
    initialTotalPages={initialTotalPages}
    initialTotalCategories={initialTotalCategories}
  />;
}
