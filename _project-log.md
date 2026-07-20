
### 2026-07-05 16:26 — Jelly: Researching (Copywriting + Redesign Phase)
- **Selesai:** Penelitian awal selesai. Logs logo verified (hitam + pink #FF69B4). Funny to see...
- **Request:** Copywriting new brand voice, non-teknis, conversion funnel: Google → WA/meeting
- **Langkah:**
  1. Mercury — research pain points, brand voice, keywords, tagline options
  2. Luna — copy draft (hero, services, CTA, Why Us), dependency Mercury
  3. Athena — creative styling voice parallel, logo palette locked
- **Blocker:** none yet

### 2026-07-20 — OpenCode: Redesign Fase 1 (Homepage — Bold Editorial Agency)
- **Selesai:** Full homepage redesign, arah "bold editorial agency" (variance 8 / motion 6 / density 4).
- **Foundation:**
  - Hapus `tailwind.config.ts` (dead v3 config, konflik dengan Tailwind v4 CSS-first)
  - Token baru `--primary-strong` (#c2188b light / #ff7ecd dark) untuk teks pink AA-safe
  - Shape lock: button = pill, sisanya sharp corners; noise overlay dihapus
  - `editorial-shadow` kini hard offset pink block (bukan glow)
  - Komponen baru: `ScreenshotFrame` (browser chrome + placeholder "Screenshot segera hadir"), `Marquee`, `lib/assets.ts` (resolve DB image → /public/images slot → placeholder)
- **Sections:** Hero (headline raksasa + frame), Marquee keyword strip, Stats angka asli (count DB), Services numbered list (icon modulo bug dihapus), WhyUs manifesto "mitra teknologi", Work (merge Projects+Portfolio), Products (frame + price anchor), Process angka 01–05 tampil, Testimonials (avatar + rating + multi card), Blog preview + thumbnail, CTA full-bleed pink + email, Footer logo asli
- **Verified:** `npm run lint` clean, Playwright hero.spec 3/3 pass, light+dark mode OK
- **Catatan:** dev server WSL tidak bisa reach Supabase (fetch failed) — review dengan data asli via `npm run dev` di Windows
- **Asset slots (drop file ke sini):** `public/images/hero/main.png`, `public/images/products/<slug>.png`, `public/images/work/<slug>.png`, `public/images/blog/<slug>.png`
- **Next:** Fase 2 — inner pages (portfolio/products/projects/blog index + detail)

### 2026-07-20 — OpenCode: Redesign Fase 2 (Inner Pages)
- **Selesai:** Semua inner pages (portfolio/products/projects/blog index + detail) dengan design language yang konsisten.
- **Changes:**
  - `ContentCard` — pakai ScreenshotFrame, sharp corners, label primary-strong, line-clamp
  - `CollectionHero` — diselaraskan dengan editorial language homepage, add layout variant
  - `DetailHero` + `DetailSections` — sharp frames, fake fallback paragraphs dihapus ("Tidak ada data — sedang diperbarui")
  - Blog detail — author card + badge inisial, CTA di akhir artikel (sebelumnya dead-end), layout left-aligned editorial
  - Empty states — "di database" → "sedang dipersiapkan" / "segera hadir"
  - Semua gambar via `resolveImageSrc()` — abstract still → placeholder rapi
  - Files: 11 page files + 4 component files di-update
- **Verified:** Lint clean, semua public pages 200
- **Next:** Fase 3 — admin side

### 2026-07-20 — OpenCode: Redesign Fase 3 (Admin Side)
- **Selesai:** Admin panel redesain dengan brand language + icon family unification.
- **Changes:**
  - `AdminShell` — sidebar, header, metric card, panel, empty state: semua sharp corners, icon lucide diganti phosphor (Sparkle, Gauge, Folder, dll.)
  - `AdminForm` — sharp corners, icon lucide Save → phosphor FloppyDisk
  - Login page — brand style, phosphor icons (Sparkle, Envelope, Lock, ArrowLeft)
  - Dashboard — sharp corners, phosphor icons, quick actions, recent lists
  - 7 listing pages (blog, portfolio, products, projects, services, testimonials) — lucide → phosphor, rounded-3xl/2xl → rounded-md
  - Settings page — lucide → phosphor, sharp corners
- **Catatan:** belasan icon di listing pages belum di-set `weight="bold"` (cosmetic, tetap jalan). Editor component (blog-editor, portfolio-editor, dll.) masih pakai lucide di dalam — perlu refactor terpisah untuk icon toolbar WYSIWYG.
- **Verified:** Lint clean (hanya pre-existing admin img warnings)
