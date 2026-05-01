# RefaadStack - Production Landing Page

Modern, premium, and conversion-focused landing page built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-3-3fdc)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- npm or yarn

### Installation

1. **Clone the project**
   ```bash
   cd refaadstack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Update .env.local with your Supabase credentials**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Set up Supabase database**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create a new project
   - Go to SQL Editor
   - Copy and run the contents of `schema.sql`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open http://localhost:3000**

## 🎨 Design System

### Colors (Dark Pink/Neon Pink)

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#ff2d92` | CTAs, highlights, hover states |
| Primary Light | `#ff5cab` | Gradients, glows |
| Cyan Accent | `#22d3ee` | Secondary highlights |
| Background | `#080b12` | Main background |
| Surface | `#111720` | Cards, modals |

### Typography

- **Headings**: Syne (bold, modern geometric)
- **Body**: DM Sans (clean, readable)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Main layout group
│   │   ├── page.tsx       # Landing page
│   │   └── layout.tsx     # Root layout
│   └── (admin)/          # Admin routes
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # Page sections
│   └── theme-provider.tsx
├── lib/
│   ├── constants.ts       # Site constants
│   ├── utils.ts         # Utility functions
│   └── supabase/        # Supabase clients
├── data/                 # Static data (seed)
└── types/               # TypeScript types
```

## 🔧 Features

### Landing Page Sections

- [x] **Navbar** - Fixed with blur backdrop, mobile menu
- [x] **Hero** - Conversion-focused with dashboard mockup
- [x] **Stats** - Trust indicators
- [x] **Services** - 6 service cards
- [x] **Why Us** - Reason cards + code visual
- [x] **Products** - Featured products with mini dashboards
- [x] **Process** - 5-step timeline
- [x] **Portfolio** - Grid with modal + gallery
- [x] **CTA** - WhatsApp + Email conversion
- [x] **Footer** - Links, contact, social

### Technical Features

- [x] Dark mode with glassmorphism
- [x] Framer Motion animations
- [x] Mobile responsive (mobile-first)
- [x] SEO optimized
- [x] TypeScript strict mode
- [x] shadcn/ui components

## 🛠 Admin Dashboard

Access at `/admin/login`

Features:
- JWT authentication
- Portfolio CRUD
- Services CRUD
- Products CRUD
- Testimonials CRUD

## 📄 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint
npm run lint

# Supabase CLI
npx supabase db push     # Push schema to Supabase
npx supabase gen types  # Generate TypeScript types
```

## 🔐 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP=6285xxxxxxxx
NEXT_PUBLIC_EMAIL=hello@refaadstack.dev
```

## 📱 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Supabase

Database is managed via `schema.sql`. Run it in Supabase SQL Editor.

## 🎯 Business Copywriting

The site focuses on business outcomes rather than technical terms:

- ✅ "Hemat waktu", "Pertumbuhan bisnis", "Scalable"
- ❌ Avoid: "Docker", "PostgreSQL", "CI/CD", "Lighthouse score"

## 📄 License

MIT License - See LICENSE file for details.

---

Built with ❤️ by RefaadStack
