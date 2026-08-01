"use client";

interface PageNavProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export default function PageNav({
  currentPage,
  totalPages,
  onChangePage,
}: PageNavProps) {
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChangePage(currentPage - 1)}
        disabled={prevDisabled}
        aria-label="Halaman sebelumnya"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <span className="text-sm tabular-nums text-zinc-600">
        Halaman <span className="font-semibold text-zinc-900">{currentPage}</span>{" "}
        dari <span className="font-semibold text-zinc-900">{totalPages}</span>
      </span>

      <button
        type="button"
        onClick={() => onChangePage(currentPage + 1)}
        disabled={nextDisabled}
        aria-label="Halaman berikutnya"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
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
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
