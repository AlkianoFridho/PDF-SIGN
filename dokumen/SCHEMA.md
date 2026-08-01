# SCHEMA — Struktur Data (Client-side)

Tidak ada database — semua data berikut hidup di React state (in-memory) selama sesi, dan opsional disimpan sebagian ke `localStorage` untuk elemen yang ingin di-reuse (misal signature terakhir).

## 1. Tipe Elemen (`DocumentElement`)

```typescript
type ElementType = 'signature-draw' | 'signature-type' | 'signature-image' | 'stamp' | 'qrcode';

interface DocumentElement {
  id: string;              // UUID unik per elemen
  type: ElementType;
  page: number;             // halaman PDF tempat elemen ditempel (index dari 0)
  x: number;                // posisi horizontal (relatif terhadap halaman, dalam pt/px)
  y: number;                // posisi vertikal
  width: number;
  height: number;
  data: string;             // base64 image data (untuk signature/stamp) ATAU teks encoded (untuk qrcode)
  meta?: {
    fontFamily?: string;     // khusus signature-type
    createdAt?: string;      // ISO timestamp saat elemen dibuat
  };
}
```

## 2. Payload QR Code

Data yang di-encode ke dalam QR code (sebagai JSON string atau format sederhana):

```typescript
interface QrPayload {
  signerName?: string;       // opsional, diisi user
  timestamp: string;         // ISO 8601, otomatis saat elemen dibuat
  documentHash?: string;      // SHA-256 dari file PDF asli (opsional, via Web Crypto API)
  note: string;               // fixed string, misal: "Informal e-signature marker — not a certified digital signature"
}
```

## 3. State Dokumen Aktif

```typescript
interface DocumentState {
  fileName: string;
  fileBuffer: ArrayBuffer;     // buffer PDF asli, tidak dimodifikasi sampai export
  totalPages: number;
  elements: DocumentElement[];  // seluruh elemen yang sudah ditempel, lintas halaman
}
```

## 4. Local Storage (opsional, untuk reuse signature/stempel)

Key: `saved-signatures`
Value: array `{ id, type, data, label }[]` — hanya menyimpan data gambar/teks signature yang sering dipakai, TIDAK menyimpan dokumen PDF apapun.

> Catatan privasi: dokumen PDF pengguna tidak pernah disimpan di localStorage maupun dikirim kemana pun — hanya elemen signature/stempel yang eksplisit disimpan atas pilihan user.
