'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSession, logoutAdmin, AdminUser } from '@/lib/auth';
import { createPortfolio, PortfolioInput, uploadPortfolioImage } from '@/lib/crud';
import {
  createPendingImages,
  fileToUploadData,
  PendingImage,
  revokePendingImages,
  validateImageFile,
} from '@/lib/image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  LayoutDashboard, 
  Image, 
  Settings, 
  ShoppingCart, 
  MessageSquare, 
  LogOut,
  ArrowLeft,
  ImagePlus,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function NewPortfolioPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  const [formData, setFormData] = useState<PortfolioInput>({
    title: '',
    slug: '',
    category: '',
    short_description: '',
    full_description: '',
    problem: '',
    solution: '',
    impact_result: '',
    tech_stack: [],
    featured: false
  });

  useEffect(() => {
    checkSession();

    return () => {
      revokePendingImages(pendingImages);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkSession = async () => {
    try {
      const sessionUser = await getAdminSession();
      if (!sessionUser) {
        router.push('/admin/login');
        return;
      }
      setUser(sessionUser);
    } catch (error) {
      console.error('Session error:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const techStack = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tech_stack: techStack }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validImages: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        return;
      }
      validImages.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join(' '));
    }

    setPendingImages((prev) => [...prev, ...createPendingImages(validImages)]);
    e.target.value = '';
  };

  const removePendingImage = (imageId: string) => {
    setPendingImages((prev) => {
      const image = prev.find((item) => item.id === imageId);
      if (image) URL.revokeObjectURL(image.previewUrl);
      return prev.filter((item) => item.id !== imageId);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Generate slug from title if empty
      if (!formData.slug && formData.title) {
        formData.slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }

      const createdPortfolio = await createPortfolio(formData);

      if (pendingImages.length > 0) {
        for (const image of pendingImages) {
          const fileData = await fileToUploadData(image.file);
          await uploadPortfolioImage(createdPortfolio.id, fileData);
        }
      }

      revokePendingImages(pendingImages);
      router.push('/admin/portfolio');
    } catch (err: unknown) {
      console.error('Error creating portfolio:', err);
      setError(err instanceof Error ? err.message : 'Failed to create portfolio');
    } finally {
      setSaving(false);
    }
  };

const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { title: 'Portfolios', icon: Image, href: '/admin/portfolio', active: true },
    { title: 'Products', icon: ShoppingCart, href: '/admin/products' },
    { title: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials' },
    { title: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/50 border-r border-slate-800 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="text-white font-bold">RefaadStack</h1>
            <p className="text-slate-500 text-xs">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                item.active 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full mt-auto absolute bottom-4 left-4 right-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/portfolio">
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">New Portfolio</h1>
            <p className="text-slate-400">Create a new portfolio project</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-slate-300">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Project Title"
                    required
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-slate-300">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="project-slug"
                    required
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-slate-300">Category *</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Web Development"
                    required
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tech_stack" className="text-slate-300">Tech Stack</Label>
                  <Input
                    id="tech_stack"
                    name="tech_stack"
                    onChange={handleTechStackChange}
                    placeholder="Next.js, React, Tailwind (comma separated)"
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
                  />
                  <Label htmlFor="featured" className="text-slate-300 cursor-pointer">Featured</Label>
                </div>
              </CardContent>
            </Card>

            {/* Descriptions */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Descriptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="short_description" className="text-slate-300">Short Description</Label>
                  <Textarea
                    id="short_description"
                    name="short_description"
                    value={formData.short_description || ''}
                    onChange={handleChange}
                    placeholder="Brief description for cards"
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="full_description" className="text-slate-300">Full Description</Label>
                  <Textarea
                    id="full_description"
                    name="full_description"
                    value={formData.full_description || ''}
                    onChange={handleChange}
                    placeholder="Detailed project description"
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="problem" className="text-slate-300">Problem</Label>
                  <Textarea
                    id="problem"
                    name="problem"
                    value={formData.problem || ''}
                    onChange={handleChange}
                    placeholder="What problem does this project solve?"
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="solution" className="text-slate-300">Solution</Label>
                  <Textarea
                    id="solution"
                    name="solution"
                    value={formData.solution || ''}
                    onChange={handleChange}
                    placeholder="How was the problem solved?"
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="impact_result" className="text-slate-300">Impact/Results</Label>
                  <Textarea
                    id="impact_result"
                    name="impact_result"
                    value={formData.impact_result || ''}
                    onChange={handleChange}
                    placeholder="What results were achieved?"
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Images */}
          <Card className="bg-slate-900/50 border-slate-800 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Project Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="portfolio-images" className="text-slate-300">
                  Upload Images
                </Label>
                <Input
                  id="portfolio-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
                <p className="text-slate-500 text-xs mt-1">
                  Kamu bisa pilih beberapa gambar sekaligus. Maksimal 5MB per gambar.
                </p>
              </div>

              {pendingImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pendingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.previewUrl}
                        alt={image.file.name}
                        className="w-full h-32 object-cover rounded-lg border border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => removePendingImage(image.id)}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        aria-label={`Remove ${image.file.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center">
                  <ImagePlus className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">
                    Belum ada gambar. Upload sekarang supaya tidak perlu masuk edit lagi.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              {saving ? 'Creating...' : 'Create Portfolio'}
            </Button>
            <Link href="/admin/portfolio">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
