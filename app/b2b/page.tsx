import type { Metadata } from 'next';
import B2bdatabase from '@/components/b2b/B2bdatabase';

export const metadata: Metadata = {
  title: 'List Of Businesses By Country - Leads Directory',
  description: 'Access millions of B2B leads, verified company data, and market insights globally.',
};

export default function B2bPage() {
  return <B2bdatabase />;
}
