# ARCHITECTURE — Technical Design

## 1. Prinsip Utama
- **100% client-side** — tidak ada backend, tidak ada database, tidak ada API call ke server sendiri
- **Privacy by design** — file PDF dan gambar tidak pernah meninggalkan browser pengguna
- **Zero-cost hosting** — static site, deploy ke Vercel/Netlify/GitHub Pages (free tier)

## 2. Tech Stack

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js (App Router) | Familiar dengan stack yang sudah dikuasai, static export mudah |
| Styling | Tailwind CSS | Cepat untuk styling konsisten |
| PDF render | `pdfjs-dist` | Render halaman PDF ke `<canvas>` untuk preview |
| PDF generate | `pdf-lib` | Embed gambar (signature/foto/QR) ke PDF asli, generate file baru |
| Signature canvas | `react-signature-canvas` | Kanvas gambar tanda tangan manual |
| Font kursif | Google Fonts (misal `Caveat`, `Dancing Script`) | Untuk opsi "ketik tanda tangan" |
| QR Code | `qrcode.react` atau `qrcode` (npm) | Generate QR code dari data teks |
| Barcode (opsional) | `jsbarcode` | Alternatif QR jika ingin format barcode linear |
| Drag & resize | `react-rnd` atau custom pointer events | Memindahkan & mengubah ukuran elemen di atas canvas PDF |
| State management | React state/context bawaan (tidak perlu Redux, scope masih kecil) | Kesederhanaan |
| Local persistence (opsional) | `localStorage` | Simpan signature/stempel terakhir agar tidak perlu diulang |

## 3. Alur Data (Data Flow)

```
File PDF (input user)
   → dibaca via FileReader API (ArrayBuffer)
   → di-render preview via pdfjs-dist (canvas per halaman)

Elemen (signature/foto/QR)
   → disimpan sementara di React state sebagai base64/ImageData + posisi (x, y, width, height, page)

Saat "Export":
   → ArrayBuffer PDF asli + daftar elemen → diproses oleh pdf-lib
   → pdf-lib embed tiap elemen sebagai image di koordinat yang sesuai per halaman
   → hasil akhir di-generate sebagai Blob → trigger download via <a download>
```

Tidak ada data yang dikirim ke server manapun di titik manapun dalam alur ini.

## 4. Struktur Folder (usulan)

```
/app
  /page.tsx                → Landing page
  /editor/page.tsx         → Editor utama
/components
  /PdfViewer.tsx            → Render & navigasi halaman PDF
  /SignaturePanel.tsx        → Tab gambar/ketik/upload tanda tangan
  /StampPanel.tsx             → Upload foto/stempel
  /QrCodePanel.tsx             → Form + generate QR code
  /DraggableElement.tsx         → Wrapper drag+resize generik untuk semua jenis elemen
  /ExportButton.tsx             → Logika trigger export via pdf-lib
/lib
  /pdfExport.ts               → Fungsi inti embed elemen ke PDF pakai pdf-lib
  /hashDocument.ts             → Fungsi hash sederhana (misal SHA-256 via Web Crypto API) untuk QR code
/types
  /element.ts                  → Definisi tipe data elemen (lihat SCHEMA.md)
```

## 5. Batasan Teknis yang Perlu Diperhatikan
- File PDF besar (>20MB) bisa memperlambat rendering di browser lemah — perlu batasan ukuran file + pesan error yang jelas
- `pdf-lib` tidak mendukung semua fitur PDF kompleks (misal PDF dengan enkripsi/proteksi) — perlu error handling untuk kasus ini
- Web Crypto API (`crypto.subtle`) untuk hashing hanya berjalan di konteks HTTPS — pastikan deployment selalu HTTPS (default di Vercel/Netlify)
