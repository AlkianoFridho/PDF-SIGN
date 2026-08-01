"use client";

import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEditor } from "@/lib/editor-context";
import {
  fileToDataUrl,
  getImageSizeFromDataUrl,
  resizeImageToDataUrl,
} from "@/lib/imageUtils";
import { computeDefaultPlacement } from "@/lib/placement";

export default function StampPanel() {
  const { pageSize, currentPage, addElement } = useEditor();
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 1800);
  }, []);

  const handleFile = useCallback(
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
        1600
      );
      setImage(dataUrl);
    },
    []
  );

  const handleAdd = useCallback(async () => {
    if (!image) {
      setError("Pilih gambar foto/stempel terlebih dahulu.");
      return;
    }
    if (!pageSize) {
      setError("Halaman belum siap. Tunggu sebentar lalu coba lagi.");
      return;
    }
    setError(null);
    const { width: nw, height: nh } = await getImageSizeFromDataUrl(image);
    const placement = computeDefaultPlacement({
      pageSize,
      aspectRatio: nw / nh,
    });
    addElement({
      id: uuidv4(),
      type: "stamp",
      page: currentPage - 1,
      ...placement,
      data: image,
      meta: { createdAt: new Date().toISOString() },
    });
    showFeedback(
      `Ditambahkan ke halaman ${currentPage}. Seret untuk memosisikan.`
    );
  }, [image, pageSize, currentPage, addElement, showFeedback]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-relaxed text-zinc-500">
        Tempel foto, stempel perusahaan, atau cap basah ke{" "}
        <span className="font-medium text-zinc-700">halaman {currentPage}</span>.
        Gunakan PNG dengan latar transparan untuk hasil terbaik.
      </p>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-white px-4 py-8 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-zinc-400"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 8h8v8H8z" />
          <path d="m8 8 4-4" />
          <path d="m16 8 4-4" />
        </svg>
        <span className="text-sm font-medium text-zinc-600">
          {image ? "Ganti gambar" : "Pilih foto / stempel"}
        </span>
        <span className="text-xs text-zinc-400">PNG / JPG, maks 10 MB</span>
        <input
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>

      {image && (
        <div className="space-y-3">
          <div className="flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-3">
            <img
              src={image}
              alt="Pratinjau foto/stempel"
              className="max-h-36 object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => void handleAdd()}
            className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Gunakan
          </button>
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
