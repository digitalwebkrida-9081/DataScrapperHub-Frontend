import Locationreport from '@/components/location-report/Location-report';

export default function CountryReportPage({ params }) {
  return <Locationreport initialCountrySlug={params.country} />;
}
