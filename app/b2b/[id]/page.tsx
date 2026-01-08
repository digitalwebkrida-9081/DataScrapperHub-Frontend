import B2bDatasetDetail from '@/components/b2b/B2bDatasetDetail';

interface Props {
  params: Promise<{ id: string }>
}

export default async function B2bDetailPage({ params }: Props) {
    // Next.js 15+ Params are async
    const { id } = await params;
    
    return <B2bDatasetDetail id={id} />;
}
