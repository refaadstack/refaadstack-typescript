export const COMPANY = {
  name: 'RefaadStack',
  tagline: 'Bikin digital simpel, bisnis kamu jalan sendiri',
  description:
    'Software house dari Jambi yang bantu UMKM bikin website, aplikasi, dan sistem otomatis biar bisnis jadi lebih gampang. Gak perlu pusing urus teknis, kami yang handle dari nol sampai jadi.',
  email: 'refaad16@gmail.com',
  phone: '+62 823 7433 8273',
  location: 'Jambi, Indonesia',
  whatsapp: '6282374338273',
  workingHours: 'Every day, 09.00 - 17.00',
} as const;

export const NAV_LINKS = [
  { href: '/#services', label: 'Layanan' },
  { href: '/projects', label: 'Project' },
  { href: '/products', label: 'Produk' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
] as const;

export const STATS = [
  { value: 'Web dan SaaS', label: 'Produk yang kami bangun' },
  { value: 'SEO-ready', label: 'Fondasi pencarian organik' },
  { value: 'Mobile-first', label: 'Pengalaman lintas perangkat' },
  { value: 'Direct support', label: 'Komunikasi dengan tim pembuat' },
] as const;

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Konsultasi',
    description:
      'Kita diskusi kebutuhan, tujuan, dan scope project. Ngobrol santai dulu aja.',
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
