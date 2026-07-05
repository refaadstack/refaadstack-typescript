import { BlogEditor } from '@/components/admin/blog-editor';

export default function AdminEditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  return <BlogEditor postId={params.id} />;
}
