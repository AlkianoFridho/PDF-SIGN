# DESIGN — UX Flow & Visual Guidelines

## 1. Alur Pengguna (User Flow)

```
[Landing Page]
     ↓ (klik "Mulai" / drag file)
[Upload PDF]
     ↓
[Editor View]
  ├─ Panel kiri: Toolbar (pilih jenis elemen)
  │   ├─ Tab "Tanda Tangan" → gambar / ketik / upload
  │   ├─ Tab "Foto/Stempel" → upload gambar
  │   └─ Tab "QR Code" → isi data → generate otomatis
  ├─ Kanvas tengah: Preview PDF + elemen yang sudah ditempel (draggable/resizable)
  └─ Navigasi halaman (jika multi-halaman)
     ↓ (klik "Export")
[Preview Final] → [Download PDF]
```

## 2. Wireframe per Layar (deskripsi, bukan visual)

### Landing Page
- Headline singkat: fungsi tool dalam satu kalimat
- Area drag & drop besar di tengah + tombol "Pilih File"
- Badge kecil: "100% di browser kamu — dokumen tidak diupload ke server"

### Editor View
- **Toolbar kiri (fixed)**: 3 tab besar (Tanda Tangan / Foto & Stempel / QR Code), tiap tab expand jadi panel kecil sesuai jenis input
- **Canvas tengah**: render halaman PDF aktif, elemen yang ditempel muncul sebagai overlay dengan handle resize di sudut
- **Bottom bar**: thumbnail navigasi halaman (kalau dokumen multi-halaman)
- **Top bar**: nama file, tombol "Export PDF" (kanan atas, warna aksen)

### Modal Tanda Tangan (saat tab "Tanda Tangan" dibuka)
- 3 sub-tab: Gambar / Ketik / Upload
- "Gambar": kanvas kosong + tombol Clear + tombol "Gunakan"
- "Ketik": input teks + pilihan 3-4 font kursif, live preview
- "Upload": file picker gambar

### Modal QR Code
- Form kecil: Nama (opsional), otomatis isi tanggal/waktu saat ini, checkbox "sertakan hash dokumen"
- Preview QR code live update
- Disclaimer kecil: "QR code ini bersifat informal, bukan sertifikasi digital signature resmi"

## 3. Prinsip Visual
- **Clean & minimal** — fokus ke dokumen sebagai elemen utama, UI tidak boleh mengganggu
- **Feedback jelas** saat drag/resize (outline highlight saat elemen aktif/selected)
- **Warna aksen tunggal** untuk CTA utama (tombol Export, tombol Gunakan) — sisanya netral (abu-abu/putih)
- **Responsive**: prioritas desktop (editing PDF nyaman di layar besar), tapi tetap bisa diakses di tablet minimal

## 4. Aksesibilitas & Trust Signal
- Badge privasi ("diproses lokal di browser") ditampilkan konsisten di beberapa titik, karena ini nilai jual utama produk
- Disclaimer QR code/e-signature harus terlihat jelas, tidak disembunyikan — menghindari kesan menyesatkan soal legalitas
