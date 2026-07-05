import { ProductEditor } from '@/components/admin/product-editor';

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductEditor id={params.id} />;
}
