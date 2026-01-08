import B2bDomainLeads from '@/components/b2b/B2bDomainLeads';

export default async function B2bSeoPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  
  // Basic mapping: first part is country
  const country = slug[0] ? slug[0].charAt(0).toUpperCase() + slug[0].slice(1).replace(/-/g, ' ') : 'United States';
  
  return (
    <B2bDomainLeads 
      country={country} 
    />
  );
}
