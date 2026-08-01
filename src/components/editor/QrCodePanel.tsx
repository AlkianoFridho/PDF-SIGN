"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { QRCodeSVG } from "qrcode.react";
import { useEditor } from "@/lib/editor-context";
import type { QrPayload } from "@/types/element";

const QR_NOTE =
  "Informal e-signature marker - not a certified digital signature";

export default function QrCodePanel() {
  const { pageSize, currentPage, addElement, getDocumentHash } = useEditor();
  const [name, setName] = useState("");
  const [includeHash, setIncludeHash] = useState(true);
  const [timestamp, setTimestamp] = useState(() =>
    new Date().toISOString()
  );
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(
      () => setTimestamp(new Date().toISOString()),
      1000
    );
    return () => window.clearInterval(id);
  }, []);

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 1800);
  }, []);

  const payload = useMemo<QrPayload>(
    () => ({
      signerName: name.trim() || undefined,
      timestamp,
      documentHash: includeHash ? "…" : undefined,
      note: QR_NOTE,
    }),
    [name, timestamp, includeHash]
  );

  const payloadString = useMemo(() => JSON.stringify(payload), [payload]);

  const handleAdd = useCallback(async () => {
    if (!pageSize) {
      setError("Halaman belum siap. Tunggu sebentar lalu coba lagi.");
      return;
    }
    setError(null);

    const finalPayload: QrPayload = {
      signerName: name.trim() || undefined,
      timestamp: new Date().toISOString(),
      note: QR_NOTE,
    };
    if (includeHash) {
      try {
        finalPayload.documentHash = await getDocumentHash();
      } catch {
        finalPayload.documentHash = "hash-tidak-tersedia";
      }
    }

    const side = Math.min(pageSize.width * 0.22, pageSize.height * 0.22, 200);
    const x = Math.max(8, pageSize.width - side - 16);
    const y = Math.max(8, pageSize.height - side - 16);

    addElement({
      id: uuidv4(),
      type: "qrcode",
      page: currentPage - 1,
      x,
      y,
      width: side,
      height: side,
      data: JSON.stringify(finalPayload),
      meta: { createdAt: finalPayload.timestamp },
    });
    showFeedback(
      `QR ditambahkan ke halaman ${currentPage}. Seret untuk memosisikan.`
    );
  }, [name, includeHash, pageSize, currentPage, addElement, getDocumentHash, showFeedback]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-relaxed text-zinc-500">
        QR code berisi data penandaan dokumen sebagai penanda informal, bukan
        sertifikasi digital resmi.
      </p>

      <div>
        <label
          htmlFor="qr-name"
          className="mb-1.5 block text-xs font-medium text-zinc-600"
        >
          Nama penanda <span className="text-zinc-400">(opsional)</span>
        </label>
        <input
          id="qr-name"
          type="text"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          placeholder="cth: Andini Putri"
          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-600">
          Waktu penandaan
        </label>
        <input
          type="text"
          value={new Date(timestamp).toLocaleString("id-ID")}
          readOnly
          className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-600"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-3 py-2.5">
        <input
          type="checkbox"
          checked={includeHash}
          onChange={(e) => setIncludeHash(e.target.checked)}
          className="h-4 w-4 accent-indigo-600"
        />
        <span className="text-xs font-medium text-zinc-700">
          Sertakan hash dokumen (SHA-256)
        </span>
      </label>

      <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 bg-white p-4">
        <QRCodeSVG value={payloadString} size={132} level="M" />
        <p className="text-[11px] text-zinc-400">
          Pratinjau QR — berubah otomatis sesuai data di atas
        </p>
      </div>

      <button
        type="button"
        onClick={() => void handleAdd()}
        className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Tambahkan ke halaman {currentPage}
      </button>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
        <p className="text-[11px] leading-relaxed text-amber-800">
          <span className="font-semibold">Disclaimer:</span> QR code ini hanya
          penanda informasi informal. Ini <span className="font-semibold">bukan</span>{" "}
          sertifikasi tanda tangan digital resmi yang legal secara hukum (bukan
          pengganti e-meterai / PSrE resmi).
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
      {feedback && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          ✓ {feedback}
        </p>
      )}
    </div>
  );
}
