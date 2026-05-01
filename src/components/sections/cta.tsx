'use client';

import { MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COMPANY } from '@/lib/constants';

export function CTA() {
  return (
    <section id="cta" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div
        className="glow-blob"
        style={{
          width: '700px',
          height: '700px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, hsl(var(--primary) / 0.08), transparent 65%)',
        }}
      />
      <div className="grid-bg opacity-40" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <Badge variant="cyan" className="gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Mulai Sekarang – Konsultasi Gratis
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4"
          >
            Ready to Build Your{' '}
            <span className="gradient-text-primary">Digital Product?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mb-8"
          >
            Ceritakan kebutuhan Anda dan kami akan bantu menentukan solusi terbaik.
            Tanpa biaya konsultasi, tanpa tekanan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="glow-primary"
            >
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=Halo RefaadStack, saya ingin konsultasi project`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Project
              </a>
            </Button>
            <Button asChild variant="ghostPrimary" size="lg">
              <a href={`mailto:${COMPANY.email}`}>
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Need to add motion import
import { motion } from 'framer-motion';
