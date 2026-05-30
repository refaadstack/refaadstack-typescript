'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Image,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Save,
  Search,
  Settings,
  ShoppingCart,
} from 'lucide-react';
import { getAdminSession, logoutAdmin, AdminUser } from '@/lib/auth';
import { getSiteSettings, updateSiteSettings } from '@/lib/crud';
import { DEFAULT_SITE_SETTINGS, SiteSettingsInput } from '@/lib/site-settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    ...DEFAULT_SITE_SETTINGS,
    site_keywords: DEFAULT_SITE_SETTINGS.site_keywords.join(', '),
  });

  useEffect(() => {
    checkSession();
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
      const settings = await getSiteSettings();
      setFormData({
        ...settings,
        site_keywords: settings.site_keywords.join(', '),
      });
    } catch (err) {
      console.error('Settings load error:', err);
      setError('Gagal memuat settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        og_image_url: formData.og_image_url.trim() || '/og-image.png',
        canonical_url: formData.canonical_url.trim() || 'https://refaadstack.dev',
        robots_index: formData.robots_index,
        robots_follow: formData.robots_follow,
      };

      await updateSiteSettings(payload);
      setSuccess('Settings SEO berhasil disimpan.');
    } catch (err) {
      console.error('Settings save error:', err);
      setError(err instanceof Error ? err.message : 'Gagal menyimpan settings.');
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
      </div>
    );
  }

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { title: 'Portfolios', icon: Image, href: '/admin/portfolio' },
    { title: 'Products', icon: ShoppingCart, href: '/admin/products' },
    { title: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials' },
    { title: 'Settings', icon: Settings, href: '/admin/settings', active: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/50 border-r border-slate-800 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
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
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full mt-auto absolute bottom-4 left-4 right-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </aside>

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-slate-400">
              Atur SEO utama yang dipakai halaman publik RefaadStack.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Search className="w-4 h-4" />
            SEO Settings
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Metadata Utama</CardTitle>
                <CardDescription className="text-slate-400">
                  Dipakai untuk title browser, hasil pencarian, dan preview social media.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site_title" className="text-slate-300">
                    Site Title
                  </Label>
                  <Input
                    id="site_title"
                    name="site_title"
                    value={formData.site_title}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="site_description" className="text-slate-300">
                    Description
                  </Label>
                  <Textarea
                    id="site_description"
                    name="site_description"
                    value={formData.site_description}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="site_keywords" className="text-slate-300">
                    Keywords
                  </Label>
                  <Input
                    id="site_keywords"
                    name="site_keywords"
                    value={formData.site_keywords}
                    onChange={handleChange}
                    placeholder="software house, website, POS"
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                  />
                  <p className="text-slate-500 text-xs mt-1">Pisahkan keyword dengan koma.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Indexing</CardTitle>
                <CardDescription className="text-slate-400">
                  Kontrol apakah search engine boleh mengindeks website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <span>
                    <span className="block text-sm font-medium text-white">Index Page</span>
                    <span className="text-xs text-slate-500">Izinkan muncul di Google.</span>
                  </span>
                  <input
                    type="checkbox"
                    name="robots_index"
                    checked={formData.robots_index}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <span>
                    <span className="block text-sm font-medium text-white">Follow Links</span>
                    <span className="text-xs text-slate-500">Izinkan crawler mengikuti link.</span>
                  </span>
                  <input
                    type="checkbox"
                    name="robots_follow"
                    checked={formData.robots_follow}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
                  />
                </label>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Social Preview</CardTitle>
              <CardDescription className="text-slate-400">
                Dipakai saat link website dibagikan ke WhatsApp, LinkedIn, X, dan platform lain.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="og_image_url" className="text-slate-300">
                  OG Image URL
                </Label>
                <Input
                  id="og_image_url"
                  name="og_image_url"
                  value={formData.og_image_url}
                  onChange={handleChange}
                  placeholder="/og-image.png"
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="canonical_url" className="text-slate-300">
                  Canonical URL
                </Label>
                <Input
                  id="canonical_url"
                  name="canonical_url"
                  value={formData.canonical_url}
                  onChange={handleChange}
                  placeholder="https://refaadstack.dev"
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              {success}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving} className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
