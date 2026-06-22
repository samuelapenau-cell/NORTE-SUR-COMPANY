"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-border/30 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-offwhite/30" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
            <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0122.56 9" />
            <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
            <path d="M8.53 16.11a6 6 0 016.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </div>
        <h1 className="font-display text-4xl text-offwhite tracking-[1px] mb-3">Sin conexión</h1>
        <p className="text-sm text-offwhite/40 font-body leading-relaxed">
          Parece que no tienes internet. Revisa tu conexión y vuelve a intentarlo.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-3 bg-gold/10 border border-gold/30 text-gold text-[10px] font-mono uppercase tracking-[2px] rounded-sm hover:bg-gold/20 transition-all"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
