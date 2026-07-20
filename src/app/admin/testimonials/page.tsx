'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChatCircle, CheckCircle, Pencil, Plus, Star, Trash, XCircle } from '@phosphor-icons/react';
import { AdminNotice } from '@/components/admin/admin-form';
import { AdminEmptyState, AdminLoading, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import { deleteTestimonial, getTestimonials } from '@/lib/crud';

interface Testimonial {
  id: string;
  client_name: string;
  company_name: string | null;
  testimonial: string;
  avatar_url: string | null;
  rating: number;
  is_active: boolean;
}

export default function TestimonialListPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
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

        const data = await getTestimonials();
        if (!mounted) return;

        setUser(sessionUser);
        setTestimonials((data || []) as Testimonial[]);
      } catch (caught) {
        console.error('Testimonials load error:', caught);
        if (mounted) setError('Gagal memuat testimonials dari database.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [router]);

  const refreshTestimonials = async () => {
    const data = await getTestimonials();
    setTestimonials((data || []) as Testimonial[]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus testimonial ini?')) return;

    setDeleting(id);
    setError('');
    try {
      await deleteTestimonial(id);
      await refreshTestimonials();
    } catch (caught) {
      console.error('Testimonial delete error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal menghapus testimonial.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Testimonials"
        title="Social proof yang tampil di homepage."
        description="Testimonial aktif dibaca dari database untuk section public. Kalau kosong, section akan tampil sebagai empty state."
        actions={
          <Button asChild className="rounded-full">
            <Link href="/admin/testimonials/new">
              <Plus className="mr-2 size-4" />
              Tambah testimonial
            </Link>
          </Button>
        }
      />

      {error && <AdminNotice tone="error" className="mb-6">{error}</AdminNotice>}

      <AdminPanel
        title="Testimonial database"
        description={`${testimonials.length} testimonial tersimpan di Supabase.`}
      >
        {testimonials.length === 0 ? (
          <AdminEmptyState label="Belum ada testimonial. Tambah testimonial pertama untuk mengisi social proof." />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="rounded-md border border-border bg-surface p-4 transition hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="grid size-11 place-items-center rounded-md bg-background text-sm font-bold text-primary">
                        {testimonial.avatar_url ? (
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.client_name}
                            className="size-11 rounded-md object-cover"
                          />
                        ) : (
                          testimonial.client_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h2 className="font-heading text-xl font-bold tracking-[-0.035em] text-foreground">
                          {testimonial.client_name}
                        </h2>
                        {testimonial.company_name && (
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {testimonial.company_name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`size-4 ${
                            star <= testimonial.rating
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground/35'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">
                      “{testimonial.testimonial}”
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <AdminStatusPill tone={testimonial.is_active ? 'active' : 'muted'}>
                        {testimonial.is_active ? 'aktif' : 'nonaktif'}
                      </AdminStatusPill>
                      {testimonial.is_active ? (
                        <CheckCircle className="size-4 text-primary" />
                      ) : (
                        <XCircle className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={`/admin/testimonials/${testimonial.id}`}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleDelete(testimonial.id)}
                      disabled={deleting === testimonial.id}
                      aria-label={`Hapus ${testimonial.client_name}`}
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
