# Implementation Plan: Fix Data & Upload Image

## Task Overview
1. Landing Page masih pake data statis (harus dari database)
2. Admin Portfolio tidak ada form upload gambar

---

## Issue 1: Landing Page Data

### Files yang perlu diubah:

1. **`src/components/sections/services.tsx`**
   - Ubah dari `import { SERVICES } from '@/data/portfolio'` 
   - Menjadi ke database dengan `getServices()` dari `@/lib/crud`
   - Tambah useState/useEffect untuk fetch data

2. **`src/components/sections/products.tsx`**
   - Ubah dari `import { COMPANY, PRODUCTS } from '@/lib/constants'`
   - Menjadi ke database dengan `getProducts()` dari `@/lib/crud`
   - Tambah useState/useEffect untuk fetch data

### Data yang harusnya dari database:
| Section | Table di Supabase |
|---------|------------------|
| Services | `services` |
| Products | `products` |
| Portfolio | `portfolios` |

---

## Issue 2: Admin Portfolio Image Upload

### Files yang perlu diubah:

1. **`src/app/admin/portfolio/new/page.tsx`**
   - Tambah form input untuk gambar (URL atau upload)
   - Setelah create portfolio, bisa langsung add images

2. **`src/app/admin/portfolio/[id]/page.tsx`**
   - Tambah fitur upload/delete gambar
   - Tampilin gallery gambar yang sudah ada

###、需要 TAMBAHIN di CRUD:
- Function untuk handle image upload ke Supabase Storage
- Function untuk delete image dari Storage

---

## Dependencies
- Supabase Storage bucket sudah ada (`portfolio-images`)
- Schema sudah punya tabel `portfolio_images`

---

## Follow-up Steps
1. Update landing page sections (services, products)
2. Tambah image upload UI di admin portfolio
3. Test semua perubahan
4. Build untuk verify tidak ada error
