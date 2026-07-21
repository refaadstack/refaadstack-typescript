# RefaadStack Blog API — Agent Brief

## Auth

```
x-api-key: rs_blog_UZWhN_zlbD1UFBlpJAtEPG__
```
Rate limit: max 20 request/menit per IP. Kena 429 → tunggu 60 detik.

## Endpoints

| Method | URL | Keterangan |
|--------|-----|------------|
| `GET` | `https://www.refaadstack.com/api/blog` | Baca spec lengkap |
| `POST` | `https://www.refaadstack.com/api/blog` | Buat artikel baru |
| `PUT` | `https://www.refaadstack.com/api/blog` | Update artikel (pakai `slug`) |
| `DELETE` | `https://www.refaadstack.com/api/blog?slug=xxx` | Hapus artikel |

## POST Body

```json
{
  "title": "Judul Artikel",
  "content": "<p>...</p>",
  "tags": ["SEO", "Jambi", "Website"],
  "category": "Web Development",
  "is_published": true,
  "featured": false
}
```

| Field | Wajib | Default | Tipe |
|-------|-------|---------|------|
| `title` | ✅ | — | string |
| `content` | ✅ | — | string (HTML) |
| `tags` | — | `[]` | string[] |
| `category` | — | `Article` | string |
| `excerpt` | — | auto | string |
| `slug` | — | auto title | string |
| `image_url` | — | `/og-image.png` | string |
| `author_name` | — | `RefaadStack` | string |
| `reading_time` | — | auto | string |
| `is_published` | — | `true` | boolean |
| `featured` | — | `false` | boolean |

## PUT Body

```json
{ "slug": "slug-artikel", "title": "Judul Baru", "tags": ["SEO"] }
```
Kirim hanya field yang mau diupdate. `content` diupdate → `excerpt` + `reading_time` dihitung ulang otomatis.

## Aturan Konten

1. Minimal 500 kata, content **wajib HTML**: `<p>`, `<h2>`, `<h3>`, `<ul>`, `<blockquote>`
2. Bahasa Indonesia informal — pakai "kamu", bukan "Anda"
3. Target keyword harus muncul di: **judul**, **H2 pertama**, **paragraf pembuka**
4. Internal link ke `https://www.refaadstack.com`, `/portfolio`, `/products`
5. Akhiri CTA: `<p>Tertarik? <a href="https://wa.me/6282374338273">Konsultasi gratis via WhatsApp</a>.</p>`
6. Tags: lowercase, 2–5 per artikel, relevan dengan isi

## Template Artikel

```html
<p>[Pembuka 2-3 kalimat, sebutkan target keyword]</p>

<h2>[Subtopik 1 — variasikan keyword]</h2>
<p>[2-3 paragraf]</p>

<h2>[Subtopik 2]</h2>
<p>[2-3 paragraf]</p>

<h2>Kenapa RefaadStack?</h2>
<p>RefaadStack adalah software house di Jambi yang membangun website dan aplikasi web untuk UMKM — dari desain, coding, sampai maintenance.</p>

<p>Tertarik? <a href="https://wa.me/6282374338273">Konsultasi via WhatsApp</a> — kami bantu kasih arahan yang tepat.</p>
```

## Konteks RefaadStack

- Software house berbasis **Jambi, Indonesia**
- Jam kerja: 09.00–17.00 WIB
- WA: 6282374338273 · Email: refaad16@gmail.com
- Sosmed: Instagram @refaadstack, LinkedIn Redho Fadillah Adha
- Layanan: pembuatan website, aplikasi web, POS, SaaS, dashboard, integrasi API
- Target: UMKM, startup, bisnis retail Jambi & Indonesia
- Konsultasi: gratis, kami bantu kasih arahan
- Website: https://www.refaadstack.com
