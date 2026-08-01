"use client";

import { useCallback, useEffect, useRef } from "react";
import { getPdfjs } from "@/lib/pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { PageSize } from "@/lib/editor-context";

interface PdfCanvasProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  onPageSize?: (size: PageSize) => void;
  children?: React.ReactNode;
}

const MAX_PAGE_WIDTH = 880;

export default function PdfCanvas({
  pdfDoc,
  pageNumber,
  onPageSize,
  children,
}: PdfCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  const renderPage = useCallback(
    async (containerWidth: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      await getPdfjs();
      const page = await pdfDoc.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const targetWidth = Math.min(
        containerWidth,
        MAX_PAGE_WIDTH,
        baseViewport.width
      );
      const scale = targetWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      renderTaskRef.current?.cancel();
      const task = page.render({
        canvas,
        canvasContext: ctx,
        viewport,
        transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
      });
      renderTaskRef.current = task;
      await task.promise;

      onPageSize?.({ width: viewport.width, height: viewport.height });
    },
    [pdfDoc, pageNumber, onPageSize]
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const width = wrapper.clientWidth || MAX_PAGE_WIDTH;
    void renderPage(width);

    return () => {
      renderTaskRef.current?.cancel();
    };
  }, [renderPage]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex w-full items-start justify-center"
    >
      <div className="relative w-fit">
        <canvas ref={canvasRef} className="block rounded-sm shadow-xl" />
        {children}
      </div>
    </div>
  );
}
