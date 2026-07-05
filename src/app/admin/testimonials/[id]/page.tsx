import { TestimonialEditor } from '@/components/admin/testimonial-editor';

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  return <TestimonialEditor id={params.id} />;
}
