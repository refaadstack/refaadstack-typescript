'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getServices } from '@/lib/crud';
import { Card } from '@/components/ui/card';

interface ServiceData {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export function Services() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data.filter((s: ServiceData) => s.is_active));
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback ke data statis kalo gagal
      const { SERVICES } = await import('@/data/portfolio');
      setServices(SERVICES.map((s: any) => ({
        ...s,
        is_active: true,
        sort_order: parseInt(s.id)
      })));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" className="py-20 md:py-32 relative">
      {/* Glow Effect */}
      <div
        className="glow-blob hidden lg:block"
        style={{
          width: '400px',
          height: '400px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.08), transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Our Services
            </span>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Solusi Digital yang{' '}
            <span className="text-primary">Kami Bangun</span>
          </h2>
          <p className="text-muted-foreground">
            Dari landing page sederhana hingga platform SaaS kompleks — kami
            punya keahlian dan teknologi yang tepat untuk mewujudkan visi digital
            Anda.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full group hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                  <div className="text-4xl mb-4">{service.icon || '💻'}</div>
                  <h3 className="text-lg font-bold mb-3">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                    Pelajari lebih lanjut
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
