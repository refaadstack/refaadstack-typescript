'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/crud';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ProductData {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  features: string[] | null;
  price: number | null;
  is_active: boolean;
}

const FALLBACK_PRODUCTS = [
  {
    id: 'refaadpos',
    name: 'RefaadPOS',
    tagline: 'Sistem kasir modern untuk UMKM dan bisnis retail Indonesia',
    description: 'Sistem kasir digital yang ringan, cepat, dan mendukung multi-outlet.',
    features: ['Multi-outlet & multi-user', 'Laporan real-time & export Excel', 'Integrasi printer thermal', 'Manajemen stok & kategori'],
    price: null,
    is_active: true,
    color: 'cyan'
  },
  {
    id: 'refainvite',
    name: 'RefaadInvite',
    tagline: 'Undangan digital premium dengan RSVP, ucapan, dan galeri foto',
    description: 'Undangan digital premium dengan desain elegant dan RSVP interaktif.',
    features: ['Desain premium & customizable', 'RSVP & ucapan digital interaktif', 'Galeri foto & countdown wedding', 'Share via link & QR code'],
    price: 199000,
    is_active: true,
    color: 'violet'
  }
];

export function Products() {
  const [products, setProducts] = useState<(ProductData & { color?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      // Add color based on index
      const formatted = data.filter((p: ProductData) => p.is_active).map((p: ProductData, index: number) => ({
        ...p,
        color: index === 0 ? 'cyan' : 'violet'
      }));
      setProducts(formatted);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback ke static data kalo gagal
      setProducts(FALLBACK_PRODUCTS as any);
    } finally {
      setLoading(false);
    }
  };

  const displayProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;

  return (
    <section id="products" className="py-20 md:py-32 relative">
      {/* Glow */}
      <div
        className="glow-blob hidden lg:block"
        style={{
          width: '500px',
          height: '500px',
          right: '-100px',
          top: '30%',
          background: 'radial-gradient(circle, hsl(var(--cyan) / 0.1), transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Featured Products
            </span>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Produk Unggulan <span className="text-primary">Kami</span>
          </h2>
          <p className="text-muted-foreground">
            Solusi siap pakai yang dibangun di atas keahlian kami dan telah digunakan
            oleh pelanggan nyata.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-96 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {displayProducts.map((product, index) => (
              <Card
                key={product.id}
                className="group overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="p-6 lg:p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                          product.color === 'cyan'
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-violet-500/10 border border-violet-500/20'
                        }`}
                      >
                        {product.id === 'refaadpos' ? '🧾' : '💌'}
                      </div>
                      <Badge
                        variant={product.color === 'cyan' ? 'cyan' : 'violet'}
                      >
                        {index === 0 ? 'Active Product' : 'New Product'}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-6">{product.tagline}</p>

                  {/* Mini Dashboard Mockup */}
                  <div className="mb-6 p-4 rounded-xl bg-background border border-border">
                    {product.id === 'refaadpos' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'Penjualan Hari Ini', value: 'Rp 2.4M', extra: '↑ 14%' },
                            { label: 'Transaksi', value: '148', extra: '' },
                            { label: 'vs Kemarin', value: '↑ 14%', extra: '', green: true },
                          ].map((stat) => (
                            <div key={stat.label}>
                              <div className="text-xs text-muted-foreground mb-1">
                                {stat.label}
                              </div>
                              <div
                                className={`text-lg font-bold ${
                                  stat.green ? 'text-green-500' : ''
                                }`}
                              >
                                {stat.value}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-end gap-1 h-9">
                          {[40, 60, 50, 80, 65, 90, 75, 95, 85, 100].map(
                            (height, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/60 to-cyan-400 opacity-60"
                                style={{ height: `${height}%` }}
                              />
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'Tamu Diundang', value: '1,240' },
                            { label: 'RSVP Masuk', value: '892' },
                            { label: 'Hadir', value: '72%', green: true },
                          ].map((stat) => (
                            <div key={stat.label}>
                              <div className="text-xs text-muted-foreground mb-1">
                                {stat.label}
                              </div>
                              <div
                                className={`text-lg font-bold ${
                                  stat.green ? 'text-violet-400' : ''
                                }`}
                              >
                                {stat.value}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-end gap-1 h-9">
                          {[50, 70, 55, 85, 72, 95, 60, 80, 68, 90].map(
                            (height, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-600 to-violet-400 opacity-60"
                                style={{ height: `${height}%` }}
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {(product.features || []).map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span
                          className={
                            product.color === 'cyan' ? 'text-primary' : 'text-violet-400'
                          }
                        >
                          ✓
                        </span>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Button
                      asChild
                      className={
                        product.color === 'violet'
                          ? 'bg-violet-600 hover:bg-violet-700'
                          : ''
                      }
                    >
                      <a href="#cta">
                        {index === 0 ? 'Coba Sekarang' : 'Lihat Demo'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {product.price ? `Mulai dari Rp ${product.price.toLocaleString('id-ID')}` : 'Hubungi untuk harga'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
