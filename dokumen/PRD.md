# PRD — Digital Signature & Document Marking Web App

## 1. Ringkasan Produk
Web app client-side (tanpa backend) yang memungkinkan pengguna menempelkan tanda tangan digital, foto/stempel, dan kode verifikasi (QR code/barcode) ke dokumen PDF, lalu mengunduh hasilnya. Seluruh proses berjalan di browser pengguna — dokumen tidak pernah dikirim ke server manapun.

## 2. Problem Statement
Banyak orang butuh menandatangani dokumen PDF secara cepat (kontrak, form, surat) tanpa harus print-scan manual, tanpa perlu daftar akun, dan tanpa khawatir dokumen sensitif diunggah ke server pihak ketiga.

## 3. Target Pengguna
- Individu yang perlu tanda tangan dokumen sesekali (freelancer, mahasiswa, karyawan)
- Tidak butuh fitur enterprise (multi-signer workflow, audit trail server-side, sertifikasi hukum) — fokus MVP adalah tools personal yang cepat dan gratis

## 4. Fitur Inti (MVP)

### 4.1 Upload & Preview Dokumen
- Upload file PDF (drag & drop / file picker)
- Render preview tiap halaman
- Navigasi antar halaman (jika multi-halaman)

### 4.2 Elemen Penanda — 3 Jenis
1. **Tanda Tangan (Signature)**
   - Gambar manual di kanvas (mouse/touch)
   - Ketik nama dengan font kursif (signature-style font)
   - Upload gambar tanda tangan (hasil scan/foto, background otomatis di-transparent-kan jika memungkinkan)
2. **Foto / Stempel**
   - Upload gambar (foto profil, stempel perusahaan, cap basah yang di-scan)
   - Digunakan sebagai elemen visual tambahan di dokumen, terpisah dari tanda tangan
3. **Kode Verifikasi (QR Code / Barcode)**
   - Generate otomatis dari data yang diisi user: nama penanda, tanggal/waktu, dan hash dokumen (checksum sederhana dari isi file)
   - Berfungsi sebagai penanda "elektronik" yang bisa di-scan untuk menunjukkan info dasar penandatanganan
   - **Catatan penting**: ini BUKAN sertifikasi digital signature yang legal secara hukum (bukan PKI/certificate-based) — murni sebagai elemen visual verifikasi informal. Harus dikomunikasikan jelas di UI.

### 4.3 Manipulasi Elemen di Dokumen
- Drag untuk memposisikan tiap elemen (signature/foto/QR) di halaman manapun
- Resize elemen
- Hapus / undo elemen yang sudah ditempel
- Multi-elemen dalam satu dokumen (misal: tanda tangan + QR code sekaligus)

### 4.4 Export
- Generate PDF baru dengan semua elemen ter-embed di posisi final
- Download langsung ke device pengguna

## 5. Fitur Tambahan (Nice-to-have, jika waktu cukup)
- Simpan signature/stempel terakhir di local storage browser (tidak perlu gambar ulang)
- Pilih halaman spesifik untuk tiap elemen pada dokumen multi-halaman
- Preset ukuran QR code standar

## 6. Non-Goals (Di Luar Scope MVP)
- Tidak ada backend/server — tidak ada penyimpanan dokumen di cloud
- Tidak ada sistem akun/login
- Tidak ada multi-party signing workflow (kirim ke orang lain untuk tanda tangan bergiliran)
- Tidak menyediakan sertifikasi tanda tangan digital yang legal secara hukum (bukan pengganti e-meterai/PSrE resmi)

## 7. Batasan Teknis
- 100% gratis — semua library open-source, hosting free-tier
- Seluruh pemrosesan file terjadi di client-side (privasi terjamin karena file tidak pernah diupload ke server)

## 8. Metrik Keberhasilan (untuk portofolio, bukan produk komersial)
- Fitur MVP berfungsi penuh end-to-end (upload → tempel → export)
- Deploy publik yang bisa dicoba orang lain tanpa instalasi
- Dokumentasi (README) jelas untuk recruiter/reviewer
