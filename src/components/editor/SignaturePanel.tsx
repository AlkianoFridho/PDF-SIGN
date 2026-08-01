"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import SignatureCanvas from "react-signature-canvas";
import { v4 as uuidv4 } from "uuid";
import { useEditor } from "@/lib/editor-context";
import type {
  DocumentElement,
  ElementType,
  SavedSignature,
} from "@/types/element";
import {
  fileToDataUrl,
  getImageSizeFromDataUrl,
  resizeImageToDataUrl,
} from "@/lib/imageUtils";
import { getResolvedFontFamily, textToPngDataUrl } from "@/lib/fonts";
import { computeDefaultPlacement } from "@/lib/placement";
import {
  getSavedSignatures,
  removeSignature,
  saveSignature,
  subscribeToSavedSignatures,
} from "@/lib/storage";

type SubTab = "draw" | "type" | "upload";

type SignatureElementType = Extract<
  ElementType,
  "signature-draw" | "signature-type" | "signature-image" | "stamp"
>;

const FONT_OPTIONS = [
  { label: "Caveat", className: "font-caveat" },
  { label: "Dancing Script", className: "font-dancing-script" },
  { label: "Great Vibes", className: "font-great-vibes" },
  { label: "Pacifico", className: "font-pacifico" },
];

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: "draw", label: "Gambar" },
  { key: "type", label: "Ketik" },
  { key: "upload", label: "Upload" },
];

export default function SignaturePanel() {
  const { pageSize, currentPage, addElement } = useEditor();
  const sigRef = useRef<SignatureCanvas>(null);
  const [subTab, setSubTab] = useState<SubTab>("draw");
  const [name, setName] = useState("");
  const [fontClass, setFontClass] = useState(FONT_OPTIONS[0].className);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const savedList = useSyncExternalStore(
    subscribeToSavedSignatures,
    getSavedSignatures,
    getSavedSignatures
  );
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 1800);
  }, []);

  const addImageElement = useCallback(
    async (
      type: SignatureElementType,
      dataUrl: string,
      meta?: DocumentElement["meta"],
      label?: string
    ) => {
      if (!pageSize) {
        setError("Halaman belum siap. Tunggu sebentar lalu coba lagi.");
        return;
      }
      const { width: nw, height: nh } = await getImageSizeFromDataUrl(dataUrl);
      const placement = computeDefaultPlacement({
        pageSize,
        aspectRatio: nw / nh,
      });
      addElement({
        id: uuidv4(),
        type,
        page: currentPage - 1,
        ...placement,
        data: dataUrl,
        meta: { createdAt: new Date().toISOString(), ...meta },
      });

      if (remember && label) {
        const saved: SavedSignature = {
          id: uuidv4(),
          type,
          data: dataUrl,
          label,
        };
        saveSignature(saved);
      }

      showFeedback(
        `Ditambahkan ke halaman ${currentPage}. Seret untuk memosisikan.`
      );
    },
    [pageSize, currentPage, addElement, remember, showFeedback]
  );

  const handleAddDraw = useCallback(async () => {
    const sig = sigRef.current;
    if (!sig || sig.isEmpty()) {
      setError("Gambar tanda tangan kamu dulu di kotak di atas.");
      return;
    }
    setError(null);
    const dataUrl = sig.toDataURL("image/png");
    await addImageElement("signature-draw", dataUrl, undefined, "Tanda tangan gambar");
    sig.clear();
  }, [addImageElement]);

  const handleAddType = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Ketik nama kamu terlebih dahulu.");
      return;
    }
    setError(null);
    const family = getResolvedFontFamily(fontClass);
    const dataUrl = await textToPngDataUrl(trimmed, family);
    await addImageElement(
      "signature-type",
      dataUrl,
      { fontFamily: fontClass },
      `Tanda tangan "${trimmed}"`
    );
  }, [name, fontClass, addImageElement]);

  const handleUpload = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return;
      const isImage =
        /^image\/(png|jpe?g)$/.test(file.type) ||
        /\.(png|jpe?g)$/i.test(file.name);
      if (!isImage) {
        setError("Hanya file gambar (.png / .jpg) yang diterima.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Ukuran gambar maksimal 10 MB.");
        return;
      }
      setError(null);
      const dataUrl = await resizeImageToDataUrl(
        await fileToDataUrl(file),
        1200
      );
      setUploaded(dataUrl);
    },
    []
  );

  const handleAddUpload = useCallback(async () => {
    if (!uploaded) {
      setError("Pilih gambar tanda tangan terlebih dahulu.");
      return;
    }
    setError(null);
    await addImageElement(
      "signature-image",
      uploaded,
      undefined,
      "Tanda tangan upload"
    );
  }, [uploaded, addImageElement]);

  const handleUseSaved = useCallback(
    async (saved: SavedSignature) => {
      setError(null);
      await addImageElement(
        saved.type as SignatureElementType,
        saved.data,
        undefined,
        saved.label
      );
    },
    [addImageElement]
  );

  const handleRemoveSaved = useCallback((id: string) => {
    removeSignature(id);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-relaxed text-zinc-500">
        Tanda tangan akan ditempel ke{" "}
        <span className="font-medium text-zinc-700">
          halaman {currentPage}
        </span>
        . Kamu bisa seret &amp; ubah ukurannya setelah ditambahkan.
      </p>

      <div
        className="grid grid-cols-3 gap-1 rounded-lg bg-zinc-100 p-1"
        role="tablist"
        aria-label="Metode tanda tangan"
      >
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={subTab === t.key}
            onClick={() => setSubTab(t.key)}
            className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
              subTab === t.key
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "draw" && (
        <div className="space-y-3">
          <div className="h-36 w-full overflow-hidden rounded-lg border border-zinc-300 bg-white">
            <SignatureCanvas
              ref={sigRef}
              penColor="#18181b"
              canvasProps={{
                className: "h-full w-full",
                "aria-label": "Kanvas gambar tanda tangan",
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setError(null);
                sigRef.current?.clear();
              }}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Bersihkan
            </button>
            <button
              type="button"
              onClick={() => void handleAddDraw()}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Gunakan
            </button>
          </div>
        </div>
      )}

      {subTab === "type" && (
        <div className="space-y-3">
          <div>
            <label
              htmlFor="sig-name"
              className="mb-1.5 block text-xs font-medium text-zinc-600"
            >
              Nama kamu
            </label>
            <input
              id="sig-name"
              type="text"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth: Andini Putri"
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-600">
              Pilih gaya font
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.className}
                  type="button"
                  onClick={() => setFontClass(f.className)}
                  className={`h-12 rounded-lg border px-2 text-lg transition-colors ${
                    fontClass === f.className
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                  style={{
                    fontFamily: `var(--font-${f.className.replace("font-", "")})`,
                  }}
                >
                  <span className={f.className}>{name || f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-600">
              Pratinjau
            </p>
            <div className="flex h-20 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white px-3">
              {name ? (
                <span
                  className={`${fontClass} text-3xl text-zinc-900`}
                  style={{ lineHeight: 1.2 }}
                >
                  {name}
                </span>
              ) : (
                <span className="text-sm text-zinc-300">
                  Ketik nama di atas untuk melihat pratinjau
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleAddType()}
            disabled={!name.trim()}
            className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Gunakan
          </button>
        </div>
      )}

      {subTab === "upload" && (
        <div className="space-y-3">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-white px-4 py-6 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-zinc-400"
            >
              <path d="M12 16V4" />
              <path d="m6 10 6-6 6 6" />
              <path d="M4 20h16" />
            </svg>
            <span className="text-sm font-medium text-zinc-600">
              Pilih gambar tanda tangan
            </span>
            <span className="text-xs text-zinc-400">
              PNG / JPG, maks 10 MB
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                void handleUpload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>

          {uploaded && (
            <div className="space-y-3">
              <div className="flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-3">
                <img
                  src={uploaded}
                  alt="Pratinjau tanda tangan"
                  className="max-h-32 object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => void handleAddUpload()}
                className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Gunakan
              </button>
            </div>
          )}
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 py-2.5">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-indigo-600"
        />
        <span className="text-[11px] leading-relaxed text-zinc-500">
          Simpan tanda tangan ini di browser ini agar bisa dipakai lagi.
          Hanya gambar tanda tangan yang disimpan — dokumen PDF tidak pernah
          disimpan.
        </span>
      </label>

      {savedList.length > 0 && (
        <div className="border-t border-zinc-200 pt-3">
          <p className="mb-2 text-xs font-semibold text-zinc-700">
            Terakhir dipakai
          </p>
          <div className="space-y-2">
            {savedList.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2"
              >
                <button
                  type="button"
                  onClick={() => void handleUseSaved(s)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <img
                    src={s.data}
                    alt=""
                    className="h-8 w-14 rounded border border-zinc-100 object-contain"
                  />
                  <span className="truncate text-xs text-zinc-600">
                    {s.label}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`Hapus ${s.label}`}
                  onClick={() => handleRemoveSaved(s.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
