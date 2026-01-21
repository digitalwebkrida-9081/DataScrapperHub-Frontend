import B2bCountryDetail from '@/components/b2b/B2bCountryDetail';

export default async function B2bCountryPage({ params }) {
  const { country } = await params;
  return <B2bCountryDetail countrySlug={country} />;
}
