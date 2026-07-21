import { requireAdmin } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('x-next-pathname') || '';

  if (pathname === '/admin/login') return <>{children}</>;

  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
