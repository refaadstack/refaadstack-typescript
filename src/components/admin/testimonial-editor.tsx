'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, Star } from 'lucide-react';
import { AdminField, AdminFormActions, AdminNotice, AdminToggleRow } from '@/components/admin/admin-form';
import { AdminLoading, AdminPageHeader, AdminPanel, AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import {
  createTestimonial,
  getTestimonialById,
  type TestimonialInput,
  updateTestimonial,
} from '@/lib/crud';

interface TestimonialRecord {
  id: string;
  client_name: string;
  company_name: string | null;
  testimonial: string;
  avatar_url: string | null;
  rating: number;
  is_active: boolean;
}

export function TestimonialEditor({ id }: { id?: string }) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    testimonial: '',
    avatar_url: '',
    is_active: true,
  });

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const sessionUser = await getAdminSession();
        if (!sessionUser) {
          router.push('/admin/login');
          return;
        }

        if (id) {
          const data = (await getTestimonialById(id)) as TestimonialRecord;
          if (!mounted) return;

          setRating(data.rating || 5);
          setFormData({
            client_name: data.client_name || '',
            company_name: data.company_name || '',
            testimonial: data.testimonial || '',
            avatar_url: data.avatar_url || '',
            is_active: data.is_active,
          });
        }

        if (mounted) setUser(sessionUser);
      } catch (caught) {
        console.error('Testimonial editor load error:', caught);
        if (mounted) setError(isEditing ? 'Testimonial tidak ditemukan.' : 'Gagal membuka form testimonial.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [id, isEditing, router]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const input: TestimonialInput = {
        client_name: formData.client_name.trim(),
        company_name: formData.company_name.trim() || null,
        testimonial: formData.testimonial.trim(),
        avatar_url: formData.avatar_url.trim() || null,
        rating,
        is_active: formData.is_active,
      };

      if (id) {
        await updateTestimonial(id, input);
      } else {
        await createTestimonial(input);
      }

      router.push('/admin/testimonials');
      router.refresh();
    } catch (caught) {
      console.error('Testimonial save error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal menyimpan testimonial.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="Testimonial editor"
        title={isEditing ? 'Edit testimonial.' : 'Tambah testimonial baru.'}
        description="Testimonial aktif akan tampil sebagai social proof di homepage."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/testimonials">
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <AdminPanel
            title="Client information"
            description="Nama client, perusahaan, avatar, rating, dan status tampil."
            action={<MessageSquare className="size-5 text-primary" />}
          >
            <div className="space-y-5">
              <AdminField label="Client name" htmlFor="client_name">
                <Input
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="Nama client"
                  required
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>

              <AdminField label="Company name" htmlFor="company_name">
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Nama perusahaan"
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>

              <AdminField label="Avatar URL" htmlFor="avatar_url">
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="mt-2 rounded-2xl bg-surface"
                />
              </AdminField>

              <AdminField label="Rating">
                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="rounded-full p-1 text-muted-foreground transition hover:bg-surface-strong hover:text-primary"
                      aria-label={`Set rating ${star}`}
                    >
                      <Star
                        className={`size-6 ${
                          star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/35'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </AdminField>

              <AdminToggleRow
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                title="Active testimonial"
                description="Testimonial aktif tampil di homepage."
              />
            </div>
          </AdminPanel>

          <AdminPanel
            title="Testimonial copy"
            description="Tulis testimoni yang spesifik dan tidak terlalu panjang."
          >
            <AdminField label="Testimonial text" htmlFor="testimonial">
              <Textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                placeholder="Apa kata client?"
                required
                className="mt-2 min-h-[240px] rounded-2xl bg-surface"
              />
            </AdminField>
          </AdminPanel>
        </div>

        {error && <AdminNotice tone="error">{error}</AdminNotice>}

        <AdminFormActions
          saving={saving}
          submitLabel={isEditing ? 'Update testimonial' : 'Create testimonial'}
          savingLabel={isEditing ? 'Updating...' : 'Creating...'}
          cancelHref="/admin/testimonials"
        />
      </form>
    </AdminShell>
  );
}
