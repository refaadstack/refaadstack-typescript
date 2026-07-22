'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, ShareNetwork } from '@phosphor-icons/react';
import { AdminField, AdminFormActions, AdminNotice, AdminToggleRow } from '@/components/admin/admin-form';
import { AdminLoading, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import { getSiteSettings, updateSiteSettings } from '@/lib/crud';
import { DEFAULT_SITE_SETTINGS, type SiteSettingsInput } from '@/lib/site-settings';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    ...DEFAULT_SITE_SETTINGS,
    site_keywords: DEFAULT_SITE_SETTINGS.site_keywords.join(', '),
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

        const settings = await getSiteSettings();
        if (!mounted) return;

        setUser(sessionUser);
        setFormData({
          ...settings,
          site_keywords: settings.site_keywords.join(', '),
        });
      } catch (caught) {
        console.error('Settings load error:', caught);
        if (mounted) setError('Gagal memuat settings.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleHeroUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('File harus berupa gambar.'); return; }
    setUploading(true); setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', 'hero');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-api-key': 'rs_blog_UZWhN_zlbD1UFBlpJAtEPG__' },
        body,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, hero_image_url: data.url }));
        setSuccess('Hero image berhasil diupload. Jangan lupa simpan settings.');
      } else {
        setError(data.error || 'Upload gagal');
      }
    } catch {
      setError('Upload gagal.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload: SiteSettingsInput = {
        site_title: formData.site_title.trim(),
        site_description: formData.site_description.trim(),
        site_keywords: formData.site_keywords
          .split(',')
          .map((keyword) => keyword.trim())
          .filter(Boolean),
        hero_image_url: formData.hero_image_url.trim(),
        og_image_url: formData.og_image_url.trim() || '/og-image.png',
        canonical_url: formData.canonical_url.trim() || 'https://www.refaadstack.com',
        author_name: formData.author_name.trim() || 'RefaadStack',
        published_time:
          formData.published_time.trim() || DEFAULT_SITE_SETTINGS.published_time,
        robots_index: formData.robots_index,
        robots_follow: formData.robots_follow,
      };

      await updateSiteSettings(payload);
      setSuccess('Settings SEO berhasil disimpan.');
    } catch (caught) {
      console.error('Settings save error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal menyimpan settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow="SEO settings"
        title="Satu sumber SEO untuk halaman publik."
        description="Settings ini tetap aman untuk indexing: metadata dasar static di layout, sementara field ini jadi kontrol copy utama dan social preview."
        actions={
          <>
            <AdminStatusPill tone={formData.robots_index ? 'active' : 'muted'}>
              {formData.robots_index ? 'Index aktif' : 'Noindex'}
            </AdminStatusPill>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/sitemap.xml" target="_blank">
                <ShareNetwork className="mr-2 size-4" />
                Sitemap
              </Link>
            </Button>
          </>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <AdminPanel
            title="Metadata utama"
            description="Dipakai untuk title browser, hasil pencarian, dan preview social media."
          >
            <div className="space-y-5">
              <AdminField label="Site title" htmlFor="site_title">
                <Input
                  id="site_title"
                  name="site_title"
                  value={formData.site_title}
                  onChange={handleChange}
                  className="mt-2 rounded-md bg-surface"
                  required
                />
              </AdminField>

              <AdminField label="Description" htmlFor="site_description">
                <Textarea
                  id="site_description"
                  name="site_description"
                  value={formData.site_description}
                  onChange={handleChange}
                  className="mt-2 rounded-md bg-surface"
                  rows={4}
                  required
                />
              </AdminField>

              <AdminField
                label="Keywords"
                htmlFor="site_keywords"
                hint="Pisahkan keyword dengan koma."
              >
                <Input
                  id="site_keywords"
                  name="site_keywords"
                  value={formData.site_keywords}
                  onChange={handleChange}
                  placeholder="software house, website, POS"
                  className="mt-2 rounded-md bg-surface"
                />
              </AdminField>

              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Author" htmlFor="author_name">
                  <Input
                    id="author_name"
                    name="author_name"
                    value={formData.author_name}
                    onChange={handleChange}
                    placeholder="RefaadStack"
                    className="mt-2 rounded-md bg-surface"
                  />
                </AdminField>

                <AdminField label="Publish date" htmlFor="published_time">
                  <Input
                    id="published_time"
                    name="published_time"
                    type="datetime-local"
                    value={formData.published_time.slice(0, 16)}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        published_time: event.target.value
                          ? new Date(event.target.value).toISOString()
                          : '',
                      }))
                    }
                    className="mt-2 rounded-md bg-surface"
                  />
                </AdminField>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel
            title="Indexing"
            description="Kontrol crawl untuk halaman utama."
            action={<MagnifyingGlass className="size-5 text-primary" />}
          >
            <div className="space-y-3">
              <AdminToggleRow
                name="robots_index"
                checked={formData.robots_index}
                onChange={handleChange}
                title="Index page"
                description="Izinkan halaman muncul di Google."
              />
              <AdminToggleRow
                name="robots_follow"
                checked={formData.robots_follow}
                onChange={handleChange}
                title="Follow links"
                description="Izinkan crawler mengikuti link internal."
              />
            </div>
          </AdminPanel>
        </div>

        <AdminPanel
          title="Hero & social preview"
          description="Hero image untuk homepage. Kalau kosong, pakai screenshot dari /public/images/hero/main.png. OG image dipakai saat link dibagikan."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <AdminField label="Hero image URL" htmlFor="hero_image_url" hint="URL gambar untuk hero section homepage. Upload ke Supabase Storage atau pakai link eksternal.">
              <div className="flex gap-2">
                <Input
                  id="hero_image_url"
                  name="hero_image_url"
                  value={formData.hero_image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hero_image_url: e.target.value }))}
                  placeholder="/images/hero/main.png"
                  className="mt-2 rounded-md bg-surface flex-1"
                />
                <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                <button
                  type="button"
                  onClick={() => heroFileRef.current?.click()}
                  disabled={uploading}
                  className="mt-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground transition hover:bg-primary hover:text-black disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </AdminField>
            <AdminField label="OG image URL" htmlFor="og_image_url">
              <Input
                id="og_image_url"
                name="og_image_url"
                value={formData.og_image_url}
                onChange={handleChange}
                placeholder="/og-image.png"
                className="mt-2 rounded-md bg-surface"
              />
            </AdminField>

            <AdminField label="Canonical URL" htmlFor="canonical_url">
              <Input
                id="canonical_url"
                name="canonical_url"
                value={formData.canonical_url}
                onChange={handleChange}
                placeholder="https://www.refaadstack.com"
                className="mt-2 rounded-md bg-surface"
              />
            </AdminField>
          </div>
        </AdminPanel>

        {error && (
          <AdminNotice tone="error">{error}</AdminNotice>
        )}
        {success && (
          <AdminNotice tone="success">{success}</AdminNotice>
        )}

        <AdminFormActions
          saving={saving}
          submitLabel="Simpan settings"
          cancelHref="/admin/dashboard"
        />
      </form>
    </AdminShell>
  );
}
