# Private PDF Studio

Aplikasi web untuk menandatangani, memberi stempel, dan menyematkan QR Code ke dokumen PDF — **100% diproses di perangkatmu sendiri** (client-side). Tidak ada file yang dikirim ke server, tidak ada akun, tidak ada riwayat.

## Fitur

- **Drag & drop upload PDF** — validasi tipe, ukuran, dan kerusakan file
- **Tanda tangan** dengan 3 cara:
  - Gambar manual (kanvas sentuh/mouse)
  - Ketik nama dengan 4 pilihan font kursif (Caveat, Dancing Script, Great Vibes, Pacifico)
  - Upload gambar tanda tangan (PNG/JPG)
- **Stempel / foto** — upload gambar, atur ukuran, tempel ke dokumen
- **QR Code** — payload data (misal nama, verifikator, tautan) dengan opsi sertakan **hash SHA-256** dokumen sebagai pengaman integritas
- **Drag, resize, hapus** — elemen bisa diposisikan bebas di halaman mana pun, multi-elemen lintas halaman
- **Simpan tanda tangan** secara opsional di localStorage browser untuk dipakai lagi — hanya gambar tanda tangan yang disimpan, dokumen tidak pernah
- **Export PDF** asli (bukan screenshot) via `pdf-lib`, siap dibuka di viewer PDF mana pun

## Cara Pakai

1. Buka halaman utama, lalu **drag & drop** (atau klik untuk memilih) file PDF.
2. Di editor: pilih panel **Tanda Tangan**, **Stempel**, atau **QR Code**.
3. Buat/unggah elemen, lalu klik **Gunakan** — elemen muncul di halaman dan bisa **diseret/diubah ukurannya**.
4. Klik **Unduh PDF** di pojok kanan atas. Hasilnya PDF asli yang sudah ditempeli elemen-elemenmu.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **pdfjs-dist** — render preview PDF di browser
- **pdf-lib** — pembuatan/export PDF hasil akhir
- **react-signature-canvas** — tanda tangan manual
- **react-rnd** — drag & resize elemen
- **qrcode** / **qrcode.react** — generate QR Code (browser, saat export & preview)
- **Web Crypto API** — hash SHA-256 dokumen

## Privacy & Legalitas

- Semua pemrosesan berjalan **lokal di browser**. File PDF kamu tidak pernah diunggah ke server mana pun.
- Hash SHA-256 dihitung dari data file yang sedang kamu buka. Disklaimer ini tampil jelas di UI panel QR Code.
- Fitur "simpan tanda tangan" bersifat **opt-in** dan hanya menyimpan gambar tanda tangan di localStorage perangkat. Data bisa dihapus kapan saja dari panel.

## Development

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
```

## Link Demo

[*(isikan link Vercel setelah deploy)*](https://pdf-sign-xi.vercel.app/)
