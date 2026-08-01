"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { EditorProvider, useEditor } from "@/lib/editor-context";
import { clearPendingFile, getPendingFile } from "@/lib/pendingFile";
import { getPdfjs } from "@/lib/pdf";
import EditorHeader from "@/components/editor/EditorHeader";
import SidePanel from "@/components/editor/SidePanel";
import PdfCanvas from "@/components/editor/PdfCanvas";
import PageNav from "@/components/editor/PageNav";
import ElementLayer from "@/components/editor/ElementLayer";

function EditorView() {
  const {
    pdfDoc,
    totalPages,
    currentPage,
    setCurrentPage,
    setPageSizeForPage,
    setSelectedId,
  } = useEditor();

  return (
    <div id="editor-root" className="flex flex-1 flex-col overflow-hidden">
      <EditorHeader />

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <SidePanel />

        <main
          className="relative flex flex-1 flex-col items-center overflow-auto bg-zinc-100 p-4 sm:p-6"
          onMouseDown={() => setSelectedId(null)}
        >
          {pdfDoc && (
            <PdfCanvas
              pdfDoc={pdfDoc}
              pageNumber={currentPage}
              onPageSize={(size) => setPageSizeForPage(currentPage - 1, size)}
            >
              <ElementLayer />
            </PdfCanvas>
          )}
        </main>
      </div>

      {totalPages > 1 && (
        <footer className="flex h-14 shrink-0 items-center justify-center border-t border-zinc-200 bg-white">
          <PageNav
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={setCurrentPage}
          />
        </footer>
      )}
    </div>
  );
}

export default function EditorPage() {
  const [file] = useState<{ name: string; buffer: ArrayBuffer } | null>(() => {
    const pending = getPendingFile();
    clearPendingFile();
    return pending ?? null;
  });
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;

    getPdfjs()
      .then((pdfjsLib) =>
        pdfjsLib.getDocument({ data: file.buffer.slice(0) }).promise
      )
      .then((doc) => {
        if (cancelled) return;
        setPdfDoc(doc);
      })
      .catch(() => {
        if (cancelled) return;
        setError(
          "Gagal membaca PDF. File mungkin korup, tidak valid, atau terproteksi kata sandi."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      setPdfDoc(null);
    };
  }, [file]);

  if (!file) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <path d="M12 16V4" />
            <path d="m6 10 6-6 6 6" />
            <path d="M4 20h16" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">
            Tidak ada dokumen yang dibuka
          </h1>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            Pilih file PDF terlebih dahulu untuk mulai menandai dokumen.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Pilih PDF
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">
            PDF tidak bisa dibuka
          </h1>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">{error}</p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Pilih PDF lain
        </Link>
      </div>
    );
  }

  if (loading || !pdfDoc) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-600" />
        <p className="text-sm text-zinc-500">Membaca dokumen…</p>
      </div>
    );
  }

  return (
    <EditorProvider
      fileName={file.name}
      buffer={file.buffer}
      pdfDoc={pdfDoc}
      totalPages={pdfDoc.numPages}
    >
      <EditorView />
    </EditorProvider>
  );
}
