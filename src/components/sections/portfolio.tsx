'use client';

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPortfolios } from '@/lib/crud';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const PORTFOLIO_GRADIENTS = [
  'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
  'linear-gradient(135deg, #0d1b2a, #1b2838, #2a3e54)',
  'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  'linear-gradient(135deg, #093028, #237a57)',
  'linear-gradient(135deg, #141e30, #243b55)',
];

interface PortfolioData {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  full_description: string | null;
  problem: string | null;
  solution: string | null;
  impact_result: string | null;
  tech_stack: string[] | null;
  featured: boolean;
  created_at: string;
  portfolio_images?: { id: string; image_url: string; sort_order: number }[];
}

export function Portfolio() {
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, slidesToScroll: 1 });

useEffect(() => {
    fetchPortfolios();
  }, []);

  // Reset image index when modal closes
  useEffect(() => {
    if (!selectedPortfolio) {
      setCurrentImageIndex(0);
    }
  }, [selectedPortfolio]);

  const fetchPortfolios = async () => {
    try {
      const data = await getPortfolios();
      // Sort by newest first and take latest 6
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setPortfolios(sorted.slice(0, 6));
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-slate-900/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Portfolio
            </span>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Project Terbaru{' '}
            <span className="text-primary">Kami</span>
          </h2>
          <p className="text-muted-foreground">
            Terbaru karya terbaik kami yang siap menginspirasi project berikutnya.
          </p>
        </div>

        {/* Portfolio Carousel */}
        {loading ? (
          <div className="flex gap-6 justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[400px] animate-pulse">
                <div className="h-80 bg-slate-800 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No portfolios yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {portfolios.map((portfolio, index) => (
                  <div
                    key={portfolio.id}
                    className="flex-shrink-0 w-full md:w-[450px] lg:w-[500px] px-2"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
<Card
                        className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/10 border-2 border-transparent bg-slate-900/80"
                        onClick={() => setSelectedPortfolio(portfolio)}
                      >
                        {/* Preview - Shows actual image or fallback */}
                        <div className="h-56 relative overflow-hidden">
                          {portfolio.portfolio_images && portfolio.portfolio_images.length > 0 ? (
                            <img
                              src={portfolio.portfolio_images[0].image_url}
                              alt={portfolio.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="h-full flex items-center justify-center"
                              style={{
                                background: PORTFOLIO_GRADIENTS[index % PORTFOLIO_GRADIENTS.length],
                              }}
                            >
                              <div className="text-7xl opacity-50">
                                {portfolio.category.includes('POS') && '🧾'}
                                {portfolio.category.includes('Web') && '📦'}
                                {portfolio.category.includes('Company') && '🏢'}
                                {portfolio.category.includes('SaaS') && '💌'}
                                {portfolio.category.includes('IoT') && '🌾'}
                                {portfolio.category.includes('Automation') && '🔧'}
                                {portfolio.category.includes('Ecommerce') && '🛒'}
                                {portfolio.category.includes('Mobile') && '📱'}
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <Badge className="bg-primary/20 text-primary border border-primary/30">
                              {portfolio.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Info - More spacious padding */}
                        <div className="p-6 space-y-3">
                          <h3 className="text-xl font-bold text-white line-clamp-1">
                            {portfolio.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {portfolio.short_description || portfolio.full_description}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {portfolio.tech_stack?.slice(0, 4).map((tech) => (
                              <Badge
                                key={tech}
                                variant="outline"
                                className="text-xs border-slate-600 text-slate-400"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            {portfolios.length > 1 && (
              <>
                <button
                  onClick={scrollPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-slate-800/80 hover:bg-slate-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-slate-800/80 hover:bg-slate-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        )}

{/* Portfolio Modal */}
        <Dialog
          open={!!selectedPortfolio}
          onOpenChange={() => setSelectedPortfolio(null)}
        >
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
            {selectedPortfolio && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Gallery - Carousel for all images */}
                <div className="space-y-4">
                  {selectedPortfolio.portfolio_images && selectedPortfolio.portfolio_images.length > 0 ? (
                    <>
                      {/* Image Carousel */}
                      <div className="relative">
                        <div className="overflow-hidden rounded-xl">
                          <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                            {selectedPortfolio.portfolio_images.map((img) => (
                              <div key={img.id} className="w-full flex-shrink-0">
                                <img
                                  src={img.image_url}
                                  alt={selectedPortfolio.title}
                                  className="w-full aspect-[4/3] object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Navigation */}
                        {selectedPortfolio.portfolio_images.length > 1 && (
                          <>
                            <button
                              onClick={() => setCurrentImageIndex(prev => prev === 0 ? selectedPortfolio.portfolio_images!.length - 1 : prev - 1)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setCurrentImageIndex(prev => prev === selectedPortfolio.portfolio_images!.length - 1 ? 0 : prev + 1)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            {/* Dots */}
                            <div className="flex justify-center gap-2 mt-3">
                              {selectedPortfolio.portfolio_images.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentImageIndex(idx)}
                                  className={`w-2 h-2 rounded-full transition-colors ${
                                    idx === currentImageIndex ? 'bg-primary' : 'bg-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Fallback - No Images */
                    <div
                      className="aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center"
                      style={{
                        background: PORTFOLIO_GRADIENTS[
                          portfolios.findIndex(
                            (p) => p.id === selectedPortfolio.id
                          ) % PORTFOLIO_GRADIENTS.length
                        ],
                      }}
                    >
                      <div className="h-full flex items-center justify-center text-9xl opacity-40">
                        {selectedPortfolio.category.includes('POS') && '🧾'}
                        {selectedPortfolio.category.includes('Web') && '📦'}
                        {selectedPortfolio.category.includes('Company') && '🏢'}
                        {selectedPortfolio.category.includes('SaaS') && '💌'}
                        {selectedPortfolio.category.includes('IoT') && '🌾'}
                        {selectedPortfolio.category.includes('Automation') && '🔧'}
                        {selectedPortfolio.category.includes('Ecommerce') && '🛒'}
                        {selectedPortfolio.category.includes('Mobile') && '📱'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-white">
                      {selectedPortfolio.title}
                    </DialogTitle>
                    <DialogDescription className="text-lg text-primary">
                      {selectedPortfolio.category}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 text-base">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Overview</h4>
                      <p className="text-slate-300 leading-relaxed">
                        {selectedPortfolio.full_description}
                      </p>
                    </div>

                    {selectedPortfolio.problem && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Problem</h4>
                        <p className="text-slate-300 leading-relaxed">
                          {selectedPortfolio.problem}
                        </p>
                      </div>
                    )}

                    {selectedPortfolio.solution && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Solution</h4>
                        <p className="text-slate-300 leading-relaxed">
                          {selectedPortfolio.solution}
                        </p>
                      </div>
                    )}

                    {selectedPortfolio.impact_result && (
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">
                          Impact Result
                        </h4>
                        <p className="text-slate-300 leading-relaxed">
                          {selectedPortfolio.impact_result}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-white mb-3">
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPortfolio.tech_stack?.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg"
                  >
                    <a href="#cta">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Discuss Project
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
