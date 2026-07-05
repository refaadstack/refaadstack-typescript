import { PortfolioEditor } from '@/components/admin/portfolio-editor';

export default function EditPortfolioPage({ params }: { params: { id: string } }) {
  return <PortfolioEditor id={params.id} />;
}
