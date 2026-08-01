"use client";

import { useState } from "react";
import SignaturePanel from "@/components/editor/SignaturePanel";
import StampPanel from "@/components/editor/StampPanel";
import QrCodePanel from "@/components/editor/QrCodePanel";

type TabKey = "signature" | "stamp" | "qr";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "signature",
    label: "Tanda Tangan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4.5 w-4.5"
      >
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="M21 3c0 0-4 2-8 5.5" />
        <path d="M10 4H3v16h6" />
      </svg>
    ),
  },
  {
    key: "stamp",
    label: "Foto & Stempel",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4.5 w-4.5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 8h8v8H8z" />
        <path d="m8 8 4-4" />
        <path d="m16 8 4-4" />
      </svg>
    ),
  },
  {
    key: "qr",
    label: "QR Code",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4.5 w-4.5"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3z" />
        <path d="M18 17h3" />
        <path d="M17 21h3v-1" />
      </svg>
    ),
  },
];

export default function SidePanel() {
  const [tab, setTab] = useState<TabKey>("signature");

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-zinc-200 bg-white md:w-80 md:border-b-0 md:border-r">
      <nav
        className="grid grid-cols-3 border-b border-zinc-200"
        aria-label="Panel elemen"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-current={tab === t.key ? "page" : undefined}
            className={`flex flex-col items-center gap-1 border-b-2 px-1 py-3 text-[11px] font-medium transition-colors sm:text-xs ${
              tab === t.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin p-4">
        {tab === "signature" && <SignaturePanel />}
        {tab === "stamp" && <StampPanel />}
        {tab === "qr" && <QrCodePanel />}
      </div>
    </aside>
  );
}
