"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center px-6 bg-[#160303]">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3C2F" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-[#F0EBE3] tracking-[2px]">
            Algo salio <span className="text-[#FF3C2F]">mal</span>
          </h1>
          <p className="mt-4 text-sm text-[#F0EBE3]/40 font-body leading-relaxed">
            Ocurrio un error inesperado. Recarga la pagina para intentar de nuevo.
          </p>
          <button
            onClick={reset}
            className="mt-8 px-8 py-4 bg-[#E0B8AC] text-black font-display text-lg tracking-[2px] rounded-sm hover:bg-[#EAC8BE] transition-all duration-300"
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
