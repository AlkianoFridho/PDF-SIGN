"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setPendingFile } from "@/lib/pendingFile";

const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function UploadDropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return;
      setError(null);

      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setError("Format tidak didukung. Pilih file PDF (.pdf).");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(
          `File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal ${MAX_SIZE_MB} MB.`
        );
        return;
      }

      setLoading(true);
      try {
        const buffer = await file.arrayBuffer();
        setPendingFile({ name: file.name, buffer });
        router.push("/editor");
      } catch {
        setError("Gagal membaca file. Coba lagi dengan file lain.");
        setLoading(false);
      }
    },
    [router]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      void handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile]
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        aria-label="Unggah file PDF"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed bg-white px-8 py-16 text-center shadow-sm transition-all sm:py-20 ${
          dragging
            ? "border-indigo-500 bg-indigo-50 shadow-md"
            : "border-zinc-300 hover:border-indigo-400 hover:bg-zinc-50"
        }`}
      >
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${
            dragging ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <path d="M12 16V4" />
            <path d="m6 10 6-6 6 6" />
            <path d="M4 20h16" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-base font-medium text-zinc-900 sm:text-lg">
            {loading ? (
              "Membaca file…"
            ) : (
              <>
                Seret &amp; letakkan PDF di sini{" "}
                <span className="text-zinc-400">atau</span>
              </>
            )}
          </p>
          <p className="text-sm text-zinc-500">
            {loading ? "File sedang diproses lokal." : "klik untuk memilih file"}
          </p>
        </div>
        {!loading && (
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            Maks {MAX_SIZE_MB} MB
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
