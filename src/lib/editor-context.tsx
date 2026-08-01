"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { DocumentElement } from "@/types/element";
import { hashBuffer } from "@/lib/hashDocument";

export interface PageSize {
  width: number;
  height: number;
}

interface EditorContextValue {
  fileName: string;
  buffer: ArrayBuffer;
  pdfDoc: PDFDocumentProxy | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSizes: Record<number, PageSize>;
  pageSize: PageSize | null;
  setPageSizeForPage: (pageIndex: number, size: PageSize) => void;
  elements: DocumentElement[];
  addElement: (element: DocumentElement) => void;
  updateElement: (id: string, patch: Partial<DocumentElement>) => void;
  removeElement: (id: string) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  getDocumentHash: () => Promise<string>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

interface EditorProviderProps {
  fileName: string;
  buffer: ArrayBuffer;
  pdfDoc: PDFDocumentProxy | null;
  totalPages: number;
  children: ReactNode;
}

export function EditorProvider({
  fileName,
  buffer,
  pdfDoc,
  totalPages,
  children,
}: EditorProviderProps) {
  const [currentPage, setCurrentPageState] = useState(1);
  const [pageSizes, setPageSizes] = useState<Record<number, PageSize>>({});
  const [elements, setElements] = useState<DocumentElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hashRef = useRef<string | null>(null);

  const pageSize = pageSizes[currentPage - 1] ?? null;

  const setPageSizeForPage = useCallback(
    (pageIndex: number, size: PageSize) => {
      setPageSizes((prev) => {
        if (prev[pageIndex]?.width === size.width && prev[pageIndex]?.height === size.height) {
          return prev;
        }
        return { ...prev, [pageIndex]: size };
      });
    },
    []
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      setCurrentPageState((prev) => {
        const next = Math.max(1, Math.min(page, totalPages || 1));
        if (next !== prev) setSelectedId(null);
        return next;
      });
    },
    [totalPages]
  );

  const addElement = useCallback((element: DocumentElement) => {
    setElements((prev) => [...prev, element]);
    setSelectedId(element.id);
  }, []);

  const updateElement = useCallback(
    (id: string, patch: Partial<DocumentElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...patch } : el))
      );
    },
    []
  );

  const removeElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId((sel) => (sel === id ? null : sel));
  }, []);

  const getDocumentHash = useCallback(async () => {
    if (hashRef.current) return hashRef.current;
    const hash = await hashBuffer(buffer);
    hashRef.current = hash;
    return hash;
  }, [buffer]);

  const value = useMemo<EditorContextValue>(
    () => ({
      fileName,
      buffer,
      pdfDoc,
      totalPages,
      currentPage,
      setCurrentPage,
      pageSizes,
      pageSize,
      setPageSizeForPage,
      elements,
      addElement,
      updateElement,
      removeElement,
      selectedId,
      setSelectedId,
      getDocumentHash,
    }),
    [
      fileName,
      buffer,
      pdfDoc,
      totalPages,
      currentPage,
      setCurrentPage,
      pageSizes,
      pageSize,
      setPageSizeForPage,
      elements,
      addElement,
      updateElement,
      removeElement,
      selectedId,
      setSelectedId,
      getDocumentHash,
    ]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor harus dipakai di dalam EditorProvider");
  }
  return ctx;
}
