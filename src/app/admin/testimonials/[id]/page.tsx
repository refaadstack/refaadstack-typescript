'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAdminSession, logoutAdmin, AdminUser } from '@/lib/auth';
import { getTestimonialById, updateTestimonial } from '@/lib/crud'; // ✅ HAPUS TestimonialInput
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  LayoutDashboard, Image, Settings, ShoppingCart, 
  MessageSquare, LogOut, ArrowLeft, Star 
} from 'lucide-react';
import Link from 'next/link';

// ✅ Interface lokal untuk component ini aja
interface Testimonial {
  id: string;
  client_name: string;
  company_name: string | null;
  testimonial: string;
  avatar_url: string | null;
  rating: number;
  is_active: boolean;
  created_at: string;
}

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [rating, setRating] = useState(5);

  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    testimonial: '',
    avatar_url: '',
    is_active: true
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionUser = await getAdminSession();
      if (!sessionUser) {
        router.push('/admin/login');
        return;
      }
      setUser(sessionUser);
      await fetchTestimonial();
    } catch (error) {
      console.error('Session error:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonial = async () => {
    try {
      const id = params?.id as string;
      if (!id) throw new Error('ID tidak ditemukan');
      
      const data = await getTestimonialById(id);
      setTestimonial(data);
      setRating(data.rating || 5);
      setFormData({
        client_name: data.client_name || '',
        company_name: data.company_name || '',
        testimonial: data.testimonial || '',
        avatar_url: data.avatar_url || '',
        is_active: data.is_active ?? true
      });
    } catch (err) {
      console.error('Error fetching testimonial:', err);
      setError('Testimonial not found');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const id = params?.id as string;
      
      // ✅ Langsung pakai object, nggak perlu type import
      const input = {
        client_name: formData.client_name,
        company_name: formData.company_name || null,
        testimonial: formData.testimonial,
        avatar_url: formData.avatar_url || null,
        rating: rating,
        is_active: formData.is_active
      };

      await updateTestimonial(id, input);
      router.push('/admin/testimonials');
      router.refresh(); // ✅ Refresh list setelah update
    } catch (err: unknown) {
      console.error('Error updating testimonial:', err);
      setError(err instanceof Error ? err.message : 'Failed to update testimonial');
    } finally {
      setSaving(false);
    }
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
    { title: 'Portfolios', icon: Image, href: '/admin/portfolio' },
    { title: 'Products', icon: ShoppingCart, href: '/admin/products' },
    { title: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials', active: true },
    { title: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/50 border-r border-slate-800 p-4 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="text-white font-bold">RefaadStack</h1>
            <p className="text-slate-500 text-xs">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
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
          onClick={async () => {
            await logoutAdmin();
            router.push('/admin/login');
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Link href="/admin/testimonials">
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Edit Testimonial</h1>
            <p className="text-slate-400 text-sm">Update testimonial client</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="client_name" className="text-slate-300">Client Name *</Label>
                  <Input id="client_name" name="client_name" value={formData.client_name} onChange={handleChange} required className="bg-slate-800 border-slate-700 text-white mt-1" />
                </div>
                <div>
                  <Label htmlFor="company_name" className="text-slate-300">Company Name</Label>
                  <Input id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Inc." className="bg-slate-800 border-slate-700 text-white mt-1" />
                </div>
                <div>
                  <Label htmlFor="avatar_url" className="text-slate-300">Avatar URL</Label>
                  <Input id="avatar_url" name="avatar_url" value={formData.avatar_url} onChange={handleChange} placeholder="https://..." className="bg-slate-800 border-slate-700 text-white mt-1" />
                </div>
                <div>
                  <Label className="text-slate-300">Rating</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="p-1 hover:scale-110 transition-transform">
                        <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500" />
                  <Label htmlFor="is_active" className="text-slate-300 cursor-pointer">Active</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Testimonial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="testimonial" className="text-slate-300">Testimonial Text *</Label>
                  <Textarea id="testimonial" name="testimonial" value={formData.testimonial} onChange={handleChange} placeholder="What did the client say?" required rows={6} className="bg-slate-800 border-slate-700 text-white mt-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={saving} className="bg-cyan-500 hover:bg-cyan-600 text-white w-full sm:w-auto">
              {saving ? '💾 Saving...' : '✅ Update Testimonial'}
            </Button>
            <Link href="/admin/testimonials" className="w-full sm:w-auto">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white w-full">Cancel</Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}