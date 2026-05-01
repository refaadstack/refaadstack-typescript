'use client';

import { motion } from 'framer-motion';
import { WHY_US } from '@/data/portfolio';

export function WhyUs() {
  return (
    <section id="why" className="py-20 md:py-32 bg-background-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Why RefaadStack
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Kenapa Pilih <span className="text-primary">Kami?</span>
            </h2>
            <p className="text-muted-foreground mb-10">
              Kami bukan hanya vendor — kami adalah mitra teknologi yang peduli
              terhadap pertumbuhan bisnis Anda jangka panjang.
            </p>

            {/* Reasons Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {WHY_US.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Visual - Code Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden font-mono text-sm">
              {/* Code Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                <div className="h-3 w-3 rounded-full bg-destructive/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-auto text-xs text-muted-foreground">
                  refaadstack.config.ts
                </span>
              </div>

              {/* Code Content */}
              <div className="p-5 leading-relaxed">
                <div className="text-muted-foreground/50">// RefaadStack – Production Config</div>
                <div>&nbsp;</div>
                <div>
                  <span className="text-primary">export const</span>{' '}
                  <span className="text-cyan-400">config</span> = {'{'}
                </div>
                <div className="pl-4">
                  <span className="text-primary">"stack"</span>: [
                </div>
                <div className="pl-8">
                  <span className="text-yellow-300">"Next.js 14"</span>,
                </div>
                <div className="pl-8">
                  <span className="text-yellow-300">"TypeScript"</span>,
                </div>
                <div className="pl-8">
                  <span className="text-yellow-300">"Tailwind CSS"</span>,
                </div>
                <div className="pl-8">
                  <span className="text-yellow-300">"PostgreSQL"</span>,
                </div>
                <div className="pl-8">
                  <span className="text-yellow-300">"Supabase"</span>
                </div>
                <div className="pl-4">],</div>
                <div className="pl-4">
                  <span className="text-primary">"quality"</span>: {'{'}
                </div>
                <div className="pl-8">
                  <span className="text-cyan-400">coverage</span>:{' '}
                  <span className="text-green-400">95</span>,
                </div>
                <div className="pl-8">
                  <span className="text-cyan-400">lighthouse</span>:{' '}
                  <span className="text-green-400">98</span>,
                </div>
                <div className="pl-8">
                  <span className="text-cyan-400">uptime</span>:{' '}
                  <span className="text-yellow-300">"99.9%"</span>,
                </div>
                <div className="pl-8">
                  <span className="text-cyan-400">mobile</span>:{' '}
                  <span className="text-green-400">true</span>
                </div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}<span className="animate-pulse">|</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
