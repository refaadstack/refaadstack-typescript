import { ServiceEditor } from '@/components/admin/service-editor';

export default function EditServicePage({ params }: { params: { id: string } }) {
  return <ServiceEditor id={params.id} />;
}
