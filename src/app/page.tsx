import UploadDropzone from "@/components/landing/UploadDropzone";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4.5 w-4.5"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
        Private PDF Studio
      </span>
    </div>
  );
}

function PrivacyBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
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
        <path d="m9 12 2 2 4-4" />
      </svg>
      100% diproses di browser kamu
    </span>
  );
}

const FEATURES = [
  {
    title: "Tanda Tangan",
    desc: "Gambar manual, ketik nama dengan font kursif, atau upload hasil scan tanda tangan.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="M21 3c0 0-4 2-8 5.5" />
        <path d="M10 4H3v16h6" />
      </svg>
    ),
  },
  {
    title: "Foto & Stempel",
    desc: "Tempel stempel perusahaan, cap basah, atau foto sebagai elemen visual di dokumen.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 8h8v8H8z" />
        <path d="m8 8 4-4" />
        <path d="m16 8 4-4" />
      </svg>
    ),
  },
  {
    title: "QR Code Verifikasi",
    desc: "Generate QR berisi nama penanda, waktu, dan hash dokumen sebagai penanda informal.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
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

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <PrivacyBadge />
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Tanda tangan &amp; penanda PDF,{" "}
              <span className="text-indigo-600">langsung di browser kamu.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
              Tempel tanda tangan, stempel, dan QR code ke dokumen PDF — lalu
              unduh hasilnya. Tanpa daftar akun, tanpa upload file, dan tanpa
              dokumen kamu meninggalkan perangkat.
            </p>
          </div>

          <div className="mt-10">
            <UploadDropzone />
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400">
            Privasi dulu: seluruh proses berjalan 100% di browser kamu.
            Dokumen PDF tidak pernah disimpan atau dikirim ke server manapun.
          </p>
        </section>

        <section className="border-y border-zinc-200/80 bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-zinc-900">
              Tiga cara menandai dokumen
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    {f.icon}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-zinc-900">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-8 text-center sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
              Dokumen kamu, tetap milik kamu
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-600">
              File PDF dan gambar yang kamu gunakan diproses sepenuhnya di
              perangkatmu. Tidak ada upload, tidak ada penyimpanan cloud, tidak
              ada jejak yang tertinggal di server kami — karena memang tidak ada
              server.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-center">
            <p className="text-xs leading-relaxed text-amber-800">
              <span className="font-semibold">Catatan penting:</span> QR code
              pada aplikasi ini adalah penanda informasi informal, bukan
              sertifikasi tanda tangan digital resmi yang legal secara hukum
              (bukan pengganti e-meterai / PSrE resmi).
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200/80">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-400 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <p>© {new Date().getFullYear()} Private PDF Studio — open source &amp; free.</p>
        </div>
      </footer>
    </div>
  );
}
