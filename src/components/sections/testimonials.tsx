'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { getTestimonials } from '@/lib/crud';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TestimonialData {
  id: string;
  client_name: string;
  company_name: string | null;
  testimonial: string;
  avatar_url: string | null;
  rating: number;
  is_active: boolean;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials();
      // Filter only active testimonials
      setTestimonials(data.filter((t: TestimonialData) => t.is_active));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-slate-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Testimonials
            </span>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Apa yang <span className="text-primary">Klien Kami</span> Katakan
          </h2>
          <p className="text-muted-foreground">
            Kepuasan klien adalah prioritas utama kami. Berikut beberapa testimonial dari klien yang telah bekerja sama dengan kami.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No testimonials yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 bg-slate-800/50 border-slate-700">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.testimonial}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    {testimonial.avatar_url ? (
                      <img
                        src={testimonial.avatar_url}
                        alt={testimonial.client_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <Avatar className="w-12 h-12 bg-primary/20">
                        <AvatarFallback className="text-primary">
                          {getInitials(testimonial.client_name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <h4 className="font-semibold text-white">
                        {testimonial.client_name}
                      </h4>
                      {testimonial.company_name && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.company_name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < testimonial.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-600'
                        )}
                      />
                    ))}
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
