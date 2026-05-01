'use client';

import { motion } from 'framer-motion';
import { PROCESS_STEPS } from '@/lib/constants';

export function Process() {
  return (
    <section id="process" className="py-20 md:py-32 bg-background-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Our Process
            </span>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Cara Kami <span className="text-primary">Bekerja</span>
          </h2>
          <p className="text-muted-foreground">
            Proses transparan dan terstruktur, dari brief pertama hingga produk
            live di server.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent -translate-x-1/2 hidden md:block" />

          <div className="space-y-8 md:space-y-0">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative md:grid md:grid-cols-2 md:gap-8 items-center ${
                  index % 2 === 0 ? '' : 'md:direction-rtl'
                }`}
              >
                {/* Content */}
                <div
                  className={`p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors ${
                    index % 2 === 0
                      ? 'md:text-right md:direction-ltr'
                      : 'md:col-start-2 md:text-left'
                  }`}
                >
                  <div className="text-3xl mb-2">{step.title.split(' ')[0]}</div>
                  <h3 className="font-bold mb-2">{step.title.split(' ').slice(1).join(' ')}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                {/* Number */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center font-bold text-primary shadow-lg shadow-primary/20 z-10">
                    {step.number}
                  </div>
                </div>

                {/* Empty for grid */}
                <div className={index % 2 === 0 ? 'md:col-start-2' : ''} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
