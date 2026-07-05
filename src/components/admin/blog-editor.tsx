'use client';

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import { AdminField, AdminFormActions, AdminImagePlaceholder, AdminNotice, AdminToggleRow } from '@/components/admin/admin-form';
import { AdminLoading, AdminPageHeader, AdminPanel, AdminShell, AdminStatusPill } from '@/components/admin/admin-shell';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getAdminSession, type AdminUser } from '@/lib/auth';
import {
  createBlogPost,
  getBlogPostById,
  updateBlogPost,
  uploadContentMedia,
  type BlogPostInput,
} from '@/lib/crud';
import { fileToUploadData, validateImageFile } from '@/lib/image-upload';
import { markdownLiteToRichHtml, richHtmlToExcerpt, sanitizeRichHtml } from '@/lib/rich-text';
import { slugify } from '@/lib/utils';

const DEFAULT_IMAGE = '/images/refaadstack-system-still.png';
const DEFAULT_CONTENT = '<h2>Bagian pertama</h2><p>Tulis paragraf artikel di sini.</p><h2>Bagian berikutnya</h2><p>Tulis lanjutan artikel di sini.</p>';

interface BlogEditorProps {
  postId?: string;
}

interface BlogFormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  reading_time: string;
  image_url: string;
  author_name: string;
  published_at: string;
  is_published: boolean;
  featured: boolean;
}

const DEFAULT_FORM: BlogFormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: DEFAULT_CONTENT,
  category: 'Web strategy',
  reading_time: '5 menit',
  image_url: DEFAULT_IMAGE,
  author_name: 'RefaadStack',
  published_at: new Date().toISOString().slice(0, 10),
  is_published: true,
  featured: false,
};

export function BlogEditor({ postId }: BlogEditorProps) {
  const router = useRouter();
  const isEdit = Boolean(postId);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<BlogFormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
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

        if (!mounted) return;
        setUser(sessionUser);

        if (postId) {
          const post = await getBlogPostById(postId);
          if (!mounted) return;
          setForm({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: markdownLiteToRichHtml(post.content || DEFAULT_CONTENT),
            category: post.category || '',
            reading_time: post.reading_time || '5 menit',
            image_url: post.image_url || DEFAULT_IMAGE,
            author_name: post.author_name || 'RefaadStack',
            published_at: post.published_at
              ? new Date(post.published_at).toISOString().slice(0, 10)
              : new Date().toISOString().slice(0, 10),
            is_published: Boolean(post.is_published),
            featured: Boolean(post.featured),
          });
        }
      } catch (caught) {
        console.error('Blog editor error:', caught);
        if (mounted) setError('Artikel tidak bisa dibuka. Pastikan tabel blog_posts sudah ada.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [postId, router]);

  const updateField = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = 'checked' in event.target ? event.target.checked : false;

    setForm((current) => {
      if (type === 'checkbox') {
        return { ...current, [name]: checked };
      }

      if (name === 'title' && !current.slug) {
        return { ...current, title: value, slug: slugify(value) };
      }

      return { ...current, [name]: value };
    });
  };

  const updateContent = (content: string) => {
    setForm((current) => ({ ...current, content }));
  };

  const handleHeroUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploadingHero(true);
    setError('');

    try {
      const fileData = await fileToUploadData(file);
      const slug = slugify(form.slug || form.title || 'blog-draft');
      const { url } = await uploadContentMedia(`blog-thumbnails/${slug}`, fileData);
      setForm((current) => ({ ...current, image_url: url }));
    } catch (caught) {
      console.error('Blog hero upload error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal upload gambar hero.');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    const cleanContent = sanitizeRichHtml(form.content);
    const excerpt = form.excerpt.trim() || richHtmlToExcerpt(cleanContent, 156);
    const payload: BlogPostInput = {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      excerpt: excerpt || null,
      content: cleanContent || null,
      category: form.category.trim() || null,
      reading_time: form.reading_time.trim() || null,
      image_url: form.image_url.trim() || DEFAULT_IMAGE,
      author_name: form.author_name.trim() || 'RefaadStack',
      published_at: form.published_at ? `${form.published_at}T00:00:00.000Z` : null,
      is_published: form.is_published,
      featured: form.featured,
    };

    try {
      if (postId) {
        await updateBlogPost(postId, payload);
      } else {
        await createBlogPost(payload);
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (caught) {
      console.error('Save blog error:', caught);
      setError(caught instanceof Error ? caught.message : 'Artikel gagal disimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  const uploadFolder = `blog-content/${slugify(form.slug || form.title || 'draft')}`;

  return (
    <AdminShell user={user}>
      <AdminPageHeader
        eyebrow={isEdit ? 'Edit blog' : 'New blog'}
        title={isEdit ? 'Perbaiki artikel.' : 'Tulis artikel baru.'}
        description="Body artikel sekarang WYSIWYG: bisa bold, heading, list, link, dan upload gambar langsung ke konten."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/blog">
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.72fr]">
          <AdminPanel
            title="Body artikel"
            description="Upload gambar dari toolbar editor kalau ingin gambar masuk di tengah artikel."
          >
            <RichTextEditor
              value={form.content}
              onChange={updateContent}
              uploadFolder={uploadFolder}
              placeholder="Tulis artikel dan sisipkan gambar di sini..."
            />
          </AdminPanel>

          <div className="space-y-6">
            <AdminPanel
              title="Metadata"
              description="Dipakai untuk listing, SEO, Open Graph, dan sitemap."
            >
              <div className="space-y-5">
                <AdminField label="Judul" htmlFor="title">
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    required
                    className="mt-2 rounded-2xl bg-surface"
                  />
                </AdminField>
                <AdminField label="Slug" htmlFor="slug">
                  <Input
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={updateField}
                    required
                    className="mt-2 rounded-2xl bg-surface"
                  />
                </AdminField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Kategori" htmlFor="category">
                    <Input
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={updateField}
                      className="mt-2 rounded-2xl bg-surface"
                    />
                  </AdminField>
                  <AdminField label="Reading time" htmlFor="reading_time">
                    <Input
                      id="reading_time"
                      name="reading_time"
                      value={form.reading_time}
                      onChange={updateField}
                      className="mt-2 rounded-2xl bg-surface"
                    />
                  </AdminField>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Author" htmlFor="author_name">
                    <Input
                      id="author_name"
                      name="author_name"
                      value={form.author_name}
                      onChange={updateField}
                      className="mt-2 rounded-2xl bg-surface"
                    />
                  </AdminField>
                  <AdminField label="Tanggal publish" htmlFor="published_at">
                    <Input
                      id="published_at"
                      type="date"
                      name="published_at"
                      value={form.published_at}
                      onChange={updateField}
                      className="mt-2 rounded-2xl bg-surface"
                    />
                  </AdminField>
                </div>
                <AdminField
                  label="Excerpt"
                  htmlFor="excerpt"
                  hint="Kalau kosong, excerpt dibuat otomatis dari body artikel."
                >
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={form.excerpt}
                    onChange={updateField}
                    rows={3}
                    className="mt-2 rounded-2xl bg-surface"
                  />
                </AdminField>
                <div className="grid gap-3">
                  <AdminToggleRow
                    name="is_published"
                    checked={form.is_published}
                    onChange={updateField}
                    title="Published"
                    description="Artikel published masuk public blog dan sitemap."
                  />
                  <AdminToggleRow
                    name="featured"
                    checked={form.featured}
                    onChange={updateField}
                    title="Featured"
                    description="Artikel featured bisa ditonjolkan di homepage."
                  />
                </div>
              </div>
            </AdminPanel>

            <AdminPanel
              title="Thumbnail / hero image"
              description="Gambar ini untuk card blog, hero detail, dan Open Graph."
              action={
                form.image_url && form.image_url !== DEFAULT_IMAGE ? (
                  <AdminStatusPill tone="active">uploaded</AdminStatusPill>
                ) : (
                  <AdminStatusPill tone="muted">default</AdminStatusPill>
                )
              }
            >
              <div className="space-y-4">
                <AdminField label="Upload thumbnail" htmlFor="blog-hero-image">
                  <Input
                    id="blog-hero-image"
                    type="file"
                    accept="image/*"
                    onChange={handleHeroUpload}
                    disabled={uploadingHero}
                    className="mt-2 rounded-2xl bg-surface file:text-foreground"
                  />
                </AdminField>
                <Input
                  name="image_url"
                  value={form.image_url}
                  onChange={updateField}
                  className="rounded-2xl bg-surface"
                  aria-label="Image URL"
                />
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt="Preview thumbnail blog"
                    className="aspect-video w-full rounded-3xl border border-border object-cover"
                  />
                ) : (
                  <AdminImagePlaceholder icon={<ImagePlus className="size-5" />}>
                    Upload thumbnail agar preview public tidak kosong.
                  </AdminImagePlaceholder>
                )}
                {uploadingHero && (
                  <p className="text-xs font-semibold text-primary">Uploading thumbnail...</p>
                )}
              </div>
            </AdminPanel>
          </div>
        </div>

        {error && <AdminNotice tone="error">{error}</AdminNotice>}

        <AdminFormActions
          saving={saving}
          submitLabel="Simpan artikel"
          savingLabel="Menyimpan..."
          cancelHref="/admin/blog"
        />
      </form>
    </AdminShell>
  );
}
