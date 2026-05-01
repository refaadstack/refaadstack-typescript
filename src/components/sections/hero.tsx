'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Zap, BarChart3, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COMPANY } from '@/lib/constants';

const SOCIAL_PROOF_BADGES = [
  { icon: Zap, label: 'Fast Development' },
  { icon: BarChart3, label: 'Scalable System' },
  { icon: Globe, label: 'Modern Technology' },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg" />
      <div
        className="glow-blob hidden lg:block"
        style={{
          width: '600px',
          height: '600px',
          left: '-200px',
          top: '-100px',
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)',
        }}
      />
      <div
        className="glow-blob hidden lg:block"
        style={{
          width: '500px',
          height: '500px',
          right: '-150px',
          top: '200px',
          background: 'radial-gradient(circle, hsl(var(--cyan) / 0.1), transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <Badge variant="cyan" className="gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Software House & Digital Solutions
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
            >
              Wujudkan{' '}
              <span className="gradient-text-primary">Bisnis Lebih Cepat</span>
              {' '}dengan Teknologi Digital
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg"
            >
              Kami merancang dan mengembangkan website, aplikasi web, sistem POS, dan
              SaaS yang membantu bisnis Anda bertransformasi digital dengan efisien
              dan scalable.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Button asChild size="lg">
                <a
                  href={`https://wa.me/${COMPANY.whatsapp}?text=Halo RefaadStack, saya ingin konsultasi`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Konsultasi Gratis
                </a>
              </Button>
              <Button asChild variant="ghostPrimary" size="lg">
                <a href="#services">
                  Lihat Layanan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </motion.div>

            {/* Social Proof Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {SOCIAL_PROOF_BADGES.map((badge, index) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm text-sm text-muted-foreground"
                >
                  <badge.icon className="h-4 w-4 text-primary" />
                  {badge.label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl animate-float">
              {/* Mockup Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                <div className="h-3 w-3 rounded-full bg-destructive/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                  dashboard.refaadstack.dev
                </span>
              </div>

              {/* Mockup Content */}
              <div className="p-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Total Revenue', value: 'Rp 48.2M', change: '+12.4%' },
                    { label: 'Active Users', value: '1,284', change: '+8.2%' },
                    { label: 'Transactions', value: '3,940', change: '+5.1%' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-xl bg-background/50 border border-border/50"
                    >
                      <div className="text-xs text-muted-foreground mb-1">
                        {stat.label}
                      </div>
                      <div className="text-xl font-bold font-heading">
                        {stat.value}
                      </div>
                      <div className="text-xs text-green-500">{stat.change}</div>
                    </div>
                  ))}
                </div>

                {/* Chart Row */}
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3 p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-xs text-muted-foreground mb-3">
                      Monthly Performance
                    </div>
                    <div className="flex items-end gap-1 h-16">
                      {[35, 55, 45, 70, 60, 85, 75, 95, 80, 100].map(
                        (height, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/60 to-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
                            style={{ height: `${height}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-xs text-muted-foreground mb-3">
                      Live Activity
                    </div>
                    <div className="space-y-2">
                      {[
                        { text: 'New order #2841', color: 'bg-green-500' },
                        { text: 'User signed up', color: 'bg-cyan-400' },
                        { text: 'Invoice sent', color: 'bg-yellow-500' },
                        { text: 'Payment done', color: 'bg-green-500' },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${item.color}`}
                          />
                          <span className="text-muted-foreground truncate">
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -top-4 -right-4 px-4 py-2 rounded-xl border border-primary/20 bg-card/80 backdrop-blur-md shadow-lg flex items-center gap-2 text-sm font-medium"
            >
              <span className="text-green-500">●</span>
              System Online
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl border border-green-500/20 bg-card/80 backdrop-blur-md shadow-lg flex items-center gap-2 text-sm font-medium"
            >
              <span className="text-green-500">●</span>
              100% Uptime
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
