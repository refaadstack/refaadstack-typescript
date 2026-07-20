'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Pencil, Plus, Trash } from '@phosphor-icons/react';
import { AdminEmptyState, AdminLoading, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import { deleteBlogPost, getBlogPosts } from '@/lib/crud';
import { formatDate } from '@/lib/utils';

export default function AdminBlogPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function fetchPosts() {
    const data = await getBlogPosts();
    setPosts(data || []);
  }

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const sessionUser = await getAdminSession();
        if (!sessionUser) {
          router.push('/admin/login');
          return;
        }

        if (!mounted) return;
        setUser(sessionUser);
        await fetchPosts();
      } catch (caught) {
        console.error('Blog admin error:', caught);
        if (mounted) setError('Belum bisa membaca tabel blog_posts. Push schema terbaru dulu.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus artikel ini dari database?')) return;

    setDeleting(id);
    try {
      await deleteBlogPost(id);
      await fetchPosts();
    } catch (caught) {
      console.error('Delete blog error:', caught);
      alert('Artikel gagal dihapus');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Blog"
        title="Artikel public yang benar-benar dari database."
        description="Semua item published mengisi `/blog`, halaman detail artikel, metadata article, dan sitemap."
        actions={
          <Link href="/admin/blog/new">
            <Button className="rounded-full">
              <Plus className="mr-2 size-4" weight="bold" />
              Tulis artikel
            </Button>
          </Link>
        }
      />

      {error && (
        <div className="mb-6 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
          {error}
        </div>
      )}

      <AdminPanel title="Blog database" description={`${posts.length} artikel tersimpan`}>
        {posts.length === 0 ? (
          <AdminEmptyState label="Belum ada artikel di database." />
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="grid gap-4 rounded-md border border-border bg-surface p-4 lg:grid-cols-[1fr_auto]"
              >
                <div className="flex gap-4">
                  <div className="hidden size-14 place-items-center rounded-md bg-background text-primary sm:grid">
                    <BookOpen className="size-6" weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-2xl font-bold tracking-[-0.045em] text-foreground">
                        {post.title}
                      </h2>
                      <AdminStatusPill tone={post.is_published ? 'active' : 'muted'}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </AdminStatusPill>
                      {post.featured && <AdminStatusPill>Featured</AdminStatusPill>}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {post.excerpt || 'Belum ada excerpt.'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{post.category || 'Tanpa kategori'}</span>
                      <span>|</span>
                      <span>/{post.slug}</span>
                      <span>|</span>
                      <span>{post.published_at ? formatDate(post.published_at) : 'Belum publish'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/blog/${post.id}`}>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Pencil className="mr-2 size-4" weight="bold" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={deleting === post.id}
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash className="size-4" weight="bold" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
