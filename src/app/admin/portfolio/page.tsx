'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { AdminNotice } from '@/components/admin/admin-form';
import { AdminEmptyState, AdminLoading, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import { deletePortfolio, getPortfolios } from '@/lib/crud';
import { formatDate } from '@/lib/utils';

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  featured: boolean;
  created_at: string;
  portfolio_images?: { image_url: string }[];
}

export default function PortfolioListPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const sessionUser = await getAdminSession();
        if (!sessionUser) {
          router.push('/admin/login');
          return;
        }

        const data = await getPortfolios();
        if (!mounted) return;

        setUser(sessionUser);
        setPortfolios((data || []) as Portfolio[]);
      } catch (caught) {
        console.error('Portfolio load error:', caught);
        if (mounted) setError('Gagal memuat portfolio dari database.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [router]);

  const refreshPortfolios = async () => {
    const data = await getPortfolios();
    setPortfolios((data || []) as Portfolio[]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus portfolio ini beserta gambarnya?')) return;

    setDeleting(id);
    setError('');
    try {
      await deletePortfolio(id);
      await refreshPortfolios();
    } catch (caught) {
      console.error('Portfolio delete error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal menghapus portfolio.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Portfolio"
        title="Case study yang tampil di public portfolio."
        description="Portfolio dibaca langsung dari database dan masuk ke sitemap detail berdasarkan slug."
        actions={
          <Button asChild className="rounded-full">
            <Link href="/admin/portfolio/new">
              <Plus className="mr-2 size-4" />
              Tambah portfolio
            </Link>
          </Button>
        }
      />

      {error && <AdminNotice tone="error" className="mb-6">{error}</AdminNotice>}

      <AdminPanel
        title="Portfolio database"
        description={`${portfolios.length} portfolio tersimpan di Supabase.`}
      >
        {portfolios.length === 0 ? (
          <AdminEmptyState label="Belum ada portfolio. Tambah portfolio pertama untuk mengisi public case study." />
        ) : (
          <div className="space-y-3">
            {portfolios.map((portfolio) => {
              const cover = portfolio.portfolio_images?.[0]?.image_url;

              return (
                <article
                  key={portfolio.id}
                  className="grid gap-4 rounded-3xl border border-border bg-surface p-4 transition hover:border-primary/40 md:grid-cols-[7rem_1fr_auto]"
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt={portfolio.title}
                      className="aspect-video w-28 rounded-2xl border border-border object-cover"
                    />
                  ) : (
                    <div className="grid aspect-video w-28 place-items-center rounded-2xl border border-dashed border-border bg-background text-primary">
                      <ImageIcon className="size-5" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-xl font-bold tracking-[-0.035em] text-foreground">
                        {portfolio.title}
                      </h2>
                      {portfolio.featured && (
                        <AdminStatusPill tone="active">
                          <Star className="mr-1 size-3 fill-current" />
                          featured
                        </AdminStatusPill>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-foreground">
                        {portfolio.category}
                      </span>
                      <span>{portfolio.slug}</span>
                      <span>{formatDate(portfolio.created_at)}</span>
                    </div>
                    {portfolio.short_description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {portfolio.short_description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-2 md:justify-end">
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={`/admin/portfolio/${portfolio.id}`}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleDelete(portfolio.id)}
                      disabled={deleting === portfolio.id}
                      aria-label={`Hapus ${portfolio.title}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
