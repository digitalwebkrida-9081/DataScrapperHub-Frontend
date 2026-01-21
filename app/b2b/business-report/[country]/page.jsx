import B2bCountryDetail from '@/components/b2b/B2bCountryDetail';

export default function B2bCountryPage({ params }) {
  return <B2bCountryDetail countrySlug={params.country} />;
}
