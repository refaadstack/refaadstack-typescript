'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSession, logoutAdmin, AdminUser } from '@/lib/auth';
import { getProducts, deleteProduct, ProductInput } from '@/lib/crud';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Image, 
  Settings, 
  ShoppingCart, 
  MessageSquare, 
  LogOut,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  features: string[] | null;
  price: string | null;
  is_active: boolean;
  created_at: string;
}

export default function ProductListPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

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
      await fetchProducts();
    } catch (error) {
      console.error('Session error:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setDeleting(id);
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  const formatPrice = (price: string | null) => {
    if (!price) return 'Free';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseInt(price));
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
    { title: 'Products', icon: ShoppingCart, href: '/admin/products', active: true },
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-slate-400">Manage your products</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Product List */}
        <div className="grid gap-4">
          {products.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-8 text-center">
                <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No products yet. Create your first product!</p>
              </CardContent>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                      {product.is_active ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-slate-700 text-slate-300 hover:bg-red-500/10 hover:text-red-400"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-cyan-400 font-medium">{formatPrice(product.price)}</span>
                    {product.tagline && (
                      <>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{product.tagline}</span>
                      </>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-slate-400 mt-2 text-sm line-clamp-2">{product.description}</p>
                  )}
                  {product.features && product.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {product.features.length > 3 && (
                        <span className="text-slate-500 text-xs">+{product.features.length - 3} more</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
