# RefaadStack Blog API — Agent Reference

## Endpoint

```
POST https://www.refaadstack.com/api/blog
```

## Authentication

Header:
```
x-api-key: refaad_blog_2024
```

## Request Body (JSON)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | ✅ | — | Judul artikel. Digunakan sebagai H1 dan meta title. |
| `content` | string | ✅ | — | Isi artikel dalam HTML. Bisa pakai `<p>`, `<h2>`, `<h3>`, `<ul>`, `<img>`, `<blockquote>`. |
| `excerpt` | string | ❌ | 140 karakter pertama dari content | Ringkasan untuk meta description dan card preview. |
| `category` | string | ❌ | `Article` | Kategori. Contoh: `SEO`, `Web Development`, `Bisnis Digital`, `UMKM`. |
| `slug` | string | ❌ | Auto dari title | URL slug. Contoh: `jasa-pembuatan-website-jambi`. Duplikat akan diberi suffix. |
| `image_url` | string | ❌ | `/og-image.png` | URL gambar cover. |
| `author_name` | string | ❌ | `RefaadStack` | Nama penulis. |
| `reading_time` | string | ❌ | Auto dihitung (1 menit per 180 kata) | Estimasi waktu baca. |
| `is_published` | boolean | ❌ | `true` | `false` untuk draft. |
| `featured` | boolean | ❌ | `false` | `true` untuk tampil di landing page. |

## Response

### Success (201)
```json
{
  "success": true,
  "post": {
    "id": "uuid",
    "title": "Judul Artikel",
    "slug": "judul-artikel",
    "url": "https://www.refaadstack.com/blog/judul-artikel",
    "created_at": "2026-07-21T..."
  }
}
```

### Error
```json
{
  "success": false,
  "error": "Pesan error"
}
```

## Contoh

```bash
curl -X POST https://www.refaadstack.com/api/blog \
  -H "x-api-key: refaad_blog_2024" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cara Memilih Software House di Jambi yang Tepat",
    "content": "<p>Memilih software house yang tepat adalah langkah krusial...</p><h2>1. Cek Portfolio</h2><p>Pastikan software house memiliki portfolio yang relevan...</p>",
    "category": "Bisnis Digital",
    "is_published": true,
    "featured": true
  }'
```

## Target Keywords (SEO)

Buat artikel dengan judul dan slug yang menarget keyword ini:

| Keyword Target | Contoh Judul |
|---|---|
| `jasa pembuatan website jambi` | "Jasa Pembuatan Website Profesional di Jambi untuk UMKM" |
| `software house jambi` | "Cara Memilih Software House di Jambi yang Tepat" |
| `pembuatan aplikasi web jambi` | "Berapa Biaya Pembuatan Aplikasi Web di Jambi?" |
| `aplikasi web untuk umkm` | "Mengapa UMKM Jambi Butuh Aplikasi Web?" |
| `aplikasi pos jambi` | "Aplikasi POS: Solusi Kasir Digital untuk Toko Jambi" |
| `proses pembuatan aplikasi` | "Proses Pembuatan Aplikasi dari Konsultasi hingga Launching" |

## Aturan Konten

1. **Minimal 500 kata** per artikel.
2. **Judul maksimal 70 karakter.**
3. **Pakai heading** (`<h2>`, `<h3>`) dengan target keyword di dalamnya.
4. **Paragraf pembuka** harus mengandung target keyword dalam 100 kata pertama.
5. **Tautkan internal** ke halaman lain: `/services`, `/portfolio`, `/products`, `/`.
6. **Akhiri dengan CTA** — ajak pembaca konsultasi via WhatsApp.
7. **Setiap artikel minimal 1 target keyword**, jangan spam keyword yang sama.
