# RULES — Panduan Konsistensi untuk AI Coding Agent

## 1. Prinsip Non-Negotiable
- **JANGAN** tambahkan backend/API route yang mengirim isi file PDF atau gambar user ke server manapun. Semua pemrosesan file wajib client-side.
- **JANGAN** tambahkan sistem autentikasi/login — di luar scope MVP.
- **JANGAN** menyimpan dokumen PDF pengguna ke localStorage atau penyimpanan persisten apapun — hanya elemen signature/stempel yang boleh disimpan (dan hanya jika user pilih untuk itu).
- **SELALU** tampilkan disclaimer bahwa QR code/barcode adalah penanda informal, bukan sertifikasi digital signature resmi, di setiap tempat fitur ini muncul.

## 2. Konvensi Kode
- Bahasa: TypeScript untuk seluruh kode (bukan plain JavaScript)
- Komponen: functional components + hooks, tidak pakai class component
- Penamaan file komponen: PascalCase (`PdfViewer.tsx`)
- Penamaan fungsi/variabel: camelCase
- Styling: Tailwind utility classes langsung di JSX, hindari CSS file terpisah kecuali untuk kasus kompleks

## 3. Error Handling
- Validasi tipe file saat upload (hanya terima `.pdf` untuk dokumen, `.png/.jpg` untuk gambar) — tampilkan pesan error yang jelas jika salah format
- Tangani kasus PDF yang gagal di-parse (corrupt/encrypted) dengan pesan error yang informatif, bukan crash diam-diam
- Batasi ukuran file upload (misal maksimal 20MB) dengan pesan peringatan

## 4. Performa
- Render halaman PDF secara lazy (hanya render halaman yang sedang aktif dilihat, bukan semua halaman sekaligus) untuk dokumen multi-halaman
- Kompres/resize gambar hasil upload (foto/stempel) sebelum di-embed ke PDF, agar ukuran file hasil export tidak membengkak

## 5. Struktur Commit / Progress
- Ikuti urutan task di `TASKS.md`
- Setiap fitur besar (signature panel, stamp panel, QR panel, export logic) dikerjakan sebagai unit terpisah yang bisa ditest sendiri sebelum diintegrasikan ke editor utama

## 6. Testing Manual Minimum Sebelum Dianggap Selesai
- Upload PDF 1 halaman dan multi-halaman
- Tempel ketiga jenis elemen (signature, stamp, QR) dalam satu dokumen
- Export dan buka hasil PDF di viewer lain (bukan hanya di app ini) untuk memastikan hasil valid
