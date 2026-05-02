export const COMPANY = {
  name: 'RefaadStack',
  tagline: 'Build Better Digital Solutions',
  description:
    'Software house modern yang membantu bisnis Anda tumbuh melalui solusi digital yang scalable, cepat, dan elegan.',
  email: 'refaad16@gmail.com',
  phone: '+62 823 7433 8273',
  location: 'Jambi, Indonesia',
  whatsapp: '6282374338273',
  workingHours: 'Every day, 09.00 - 17.00',
} as const;

export const NAV_LINKS = [
  { href: '#services', label: 'Layanan' },
  { href: '#why', label: 'Tentang' },
  { href: '#products', label: 'Produk' },
  { href: '#portfolio', label: 'Portfolio' },
] as const;

export const STATS = [
  { value: '10+', label: 'Projects Delivered' },
  { value: 'Fast', label: 'Delivery Guarantee' },
  { value: 'Modern', label: 'Tech Stack Used' },
  { value: '100%', label: 'Mobile Responsive' },
] as const;

export const PRODUCTS = [
  {
    id: 'refaadpos',
    name: 'RefaadPOS',
    tagline: 'Sistem kasir modern untuk UMKM dan bisnis retail Indonesia',
    description:
      'Sistem kasir digital yang ringan, cepat, dan mendukung multi-outlet. Sangat cocok untuk UMKM dan bisnis retail di Indonesia.',
    features: [
      'Multi-outlet & multi-user',
      'Laporan real-time & export Excel',
      'Integrasi printer thermal',
      'Manajemen stok & kategori',
    ],
    price: 'Hubungi untuk harga',
    cta: 'Coba Sekarang',
    ctaLink: '#cta',
    trial: 'Free trial 14 hari',
    color: 'cyan',
  },
  {
    id: 'refainvite',
    name: 'RefaadInvite',
    tagline: 'Undangan digital premium dengan RSVP, ucapan, dan galeri foto',
    description:
      'Undangan digital premium dengan desain elegant, RSVP interaktif, ucapan digital, dan galeri foto. Membuat acara Anda lebih berkesan.',
    features: [
      'Desain premium & customizable',
      'RSVP & ucapan digital interaktif',
      'Galeri foto & countdown wedding',
      'Share via link & QR code',
    ],
    price: 'Mulai dari Rp 199K',
    cta: 'Lihat Demo',
    ctaLink: '#cta',
    trial: null,
    color: 'violet',
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Konsultasi',
    description:
      'Kita diskusi kebutuhan, tujuan, dan scope project. Gratis & tanpa komitmen.',
  },
  {
    number: '02',
    title: 'Planning & Design',
    description:
      'Wireframe, sitemap, desain UI/UX, dan timeline project yang realistis.',
  },
  {
    number: '03',
    title: 'Development',
    description:
      'Pengembangan dengan teknologi modern, update progres berkala, dan akses staging.',
  },
  {
    number: '04',
    title: 'Testing & QA',
    description:
      'Testing menyeluruh: fungsional, performance, cross-browser, dan mobile compatibility.',
  },
  {
    number: '05',
    title: 'Launching',
    description:
      'Deploy ke production, setup domain & SSL, dan training penggunaan sistem.',
  },
] as const;
