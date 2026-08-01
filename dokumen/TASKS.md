# TASKS — Breakdown Pengerjaan (target: 1-2 minggu)

## Fase 1 — Setup & PDF Viewer (Hari 1-2)
- [x] Setup project Next.js + Tailwind CSS
- [x] Buat landing page sederhana (headline + drag & drop area)
- [x] Implementasi upload PDF (FileReader → ArrayBuffer)
- [x] Integrasi `pdfjs-dist` untuk render preview halaman PDF ke canvas
- [x] Navigasi antar halaman (untuk dokumen multi-halaman)

## Fase 2 — Panel Tanda Tangan (Hari 3-4)
- [x] Integrasi `react-signature-canvas` (mode gambar manual)
- [x] Mode ketik nama dengan pilihan font kursif (Google Fonts)
- [x] Mode upload gambar tanda tangan
- [x] Simpan hasil signature sebagai base64 image di state

## Fase 3 — Panel Foto/Stempel (Hari 5, digabung ringan dengan fase 4)
- [x] Upload gambar (foto/stempel)
- [x] Validasi tipe file & ukuran
- [x] Preview thumbnail sebelum ditempel ke dokumen

## Fase 4 — Panel QR Code (Hari 5-6)
- [x] Form input data (nama opsional, checkbox sertakan hash dokumen)
- [x] Implementasi hashing dokumen (SHA-256 via Web Crypto API)
- [x] Generate QR code dari payload (pakai `qrcode.react` atau `qrcode`)
- [x] Tambahkan disclaimer text di UI

## Fase 5 — Drag, Resize, Multi-elemen (Hari 7-8)
- [x] Komponen `DraggableElement` generik (bisa dipakai untuk signature/stamp/QR)
- [x] Implementasi drag (pointer events atau `react-rnd`)
- [x] Implementasi resize (handle di sudut elemen)
- [x] Simpan posisi & ukuran tiap elemen ke state (`DocumentElement[]`)
- [x] Fitur hapus elemen yang salah tempel

## Fase 6 — Export PDF (Hari 9-10)
- [x] Fungsi `pdfExport.ts` — embed tiap elemen ke posisi yang sesuai pakai `pdf-lib`
- [x] Handle konversi koordinat (canvas preview → koordinat asli PDF)
- [x] Generate Blob hasil akhir & trigger download
- [x] Testing: buka hasil export di PDF viewer lain untuk verifikasi validitas

## Fase 7 — Polish & Fitur Tambahan (Hari 11-12)
- [x] Error handling (file bukan PDF, file corrupt, ukuran terlalu besar)
- [x] Responsive check (minimal desktop + tablet)
- [x] (Opsional) Simpan signature/stempel terakhir di localStorage
- [ ] (Opsional) Barcode linear sebagai alternatif QR code

## Fase 8 — Deploy & Dokumentasi (Hari 13-14)
- [ ] Deploy ke Vercel (free tier) — manual, perlu akun user
- [x] Tulis README.md — deskripsi proyek, cara pakai, tech stack, link demo
- [ ] Screenshot/GIF demo untuk portofolio — manual
- [x] Review akhir seluruh disclaimer privasi & legalitas QR code sudah tampil jelas
