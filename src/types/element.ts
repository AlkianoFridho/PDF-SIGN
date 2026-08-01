// Type definitions for LegalVault Document Elements
// Based on SCHEMA.md specification

export type ElementType = 'signature-draw' | 'signature-type' | 'signature-image' | 'stamp' | 'qrcode';

export interface DocumentElement {
  id: string;
  type: ElementType;
  page: number;       // halaman PDF tempat elemen ditempel (index dari 0)
  x: number;          // posisi horizontal (relatif terhadap halaman, dalam px)
  y: number;          // posisi vertikal
  width: number;
  height: number;
  data: string;       // base64 image data (untuk signature/stamp) ATAU teks encoded (untuk qrcode)
  meta?: {
    fontFamily?: string;    // khusus signature-type
    createdAt?: string;     // ISO timestamp saat elemen dibuat
  };
}

export interface QrPayload {
  signerName?: string;
  timestamp: string;
  documentHash?: string;
  note: string;        // fixed string disclaimer
}

export interface DocumentState {
  fileName: string;
  fileBuffer: ArrayBuffer;
  totalPages: number;
  elements: DocumentElement[];
}

export interface SavedSignature {
  id: string;
  type: ElementType;
  data: string;
  label: string;
}
