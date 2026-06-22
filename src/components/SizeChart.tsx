"use client";

import { useState } from "react";

const PANTS_SIZES = ["28", "30", "32", "34", "36"];
const TOP_SIZES = ["S", "M", "L", "XL"];

const PANTS_MEASUREMENTS: Record<string, { waist: string; length: string; hip: string }> = {
  "28": { waist: "71", length: "102", hip: "91" },
  "30": { waist: "76", length: "104", hip: "97" },
  "32": { waist: "81", length: "106", hip: "102" },
  "34": { waist: "86", length: "108", hip: "107" },
  "36": { waist: "91", length: "110", hip: "112" },
};

const TOP_MEASUREMENTS: Record<string, { chest: string; length: string; shoulder: string }> = {
  S: { chest: "96", length: "69", shoulder: "43" },
  M: { chest: "102", length: "71", shoulder: "45" },
  L: { chest: "107", length: "73", shoulder: "47" },
  XL: { chest: "112", length: "75", shoulder: "49" },
};

const PANTS_CATEGORIES = new Set(["pantalones", "bermudas", "shorts"]);
const TOP_CATEGORIES = new Set(["slim-fit", "franelas-boxyfit", "franelas-oversize", "hoodies-crewnecks"]);

export function SizeChart({ categorySlug }: { categorySlug?: string }) {
  const [open, setOpen] = useState(false);
  const isPants = PANTS_CATEGORIES.has(categorySlug || "");
  const isTop = TOP_CATEGORIES.has(categorySlug || "");
  if (!isPants && !isTop) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-auto text-[9px] font-mono uppercase tracking-[1.5px] text-offwhite/30 hover:text-gold transition-colors flex items-center gap-1"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Guía de tallas
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg bg-surface-light border border-border rounded-sm p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-offwhite/30 hover:text-offwhite transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>

            <h3 className="font-display text-2xl text-offwhite tracking-[1px] mb-1">Guía de Tallas</h3>
            <p className="text-xs text-offwhite/30 font-body mb-6">
              Medidas en centímetros (cm). Tomá las medidas de una prenda similar que tengas en casa.
            </p>

            {isPants && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-[10px] font-mono uppercase tracking-[1.5px] text-gold/60">
                    <th className="text-left pb-3 font-normal">Talla</th>
                    <th className="text-left pb-3 font-normal">Cintura</th>
                    <th className="text-left pb-3 font-normal">Largo</th>
                    <th className="text-left pb-3 font-normal">Cadera</th>
                  </tr>
                </thead>
                <tbody>
                  {PANTS_SIZES.map((size) => {
                    const m = PANTS_MEASUREMENTS[size];
                    return (
                      <tr key={size} className="border-b border-border/10 last:border-0">
                        <td className="py-3 font-mono text-offwhite/80">{size}</td>
                        <td className="py-3 font-mono text-offwhite/50">{m.waist}</td>
                        <td className="py-3 font-mono text-offwhite/50">{m.length}</td>
                        <td className="py-3 font-mono text-offwhite/50">{m.hip}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {isTop && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-[10px] font-mono uppercase tracking-[1.5px] text-gold/60">
                    <th className="text-left pb-3 font-normal">Talla</th>
                    <th className="text-left pb-3 font-normal">Pecho</th>
                    <th className="text-left pb-3 font-normal">Largo</th>
                    <th className="text-left pb-3 font-normal">Hombro</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_SIZES.map((size) => {
                    const m = TOP_MEASUREMENTS[size];
                    return (
                      <tr key={size} className="border-b border-border/10 last:border-0">
                        <td className="py-3 font-mono text-offwhite/80">{size}</td>
                        <td className="py-3 font-mono text-offwhite/50">{m.chest}</td>
                        <td className="py-3 font-mono text-offwhite/50">{m.length}</td>
                        <td className="py-3 font-mono text-offwhite/50">{m.shoulder}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            <div className="mt-6 pt-5 border-t border-border/20">
              <h4 className="text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/40 mb-2">¿Cómo medir?</h4>
              {isPants ? (
                <ul className="text-xs text-offwhite/30 font-body space-y-1.5">
                  <li><strong className="text-offwhite/50">Cintura:</strong> Medí alrededor de la parte más angosta</li>
                  <li><strong className="text-offwhite/50">Largo:</strong> Desde la cintura hasta el ruedo</li>
                  <li><strong className="text-offwhite/50">Cadera:</strong> Medí alrededor de la parte más ancha</li>
                </ul>
              ) : (
                <ul className="text-xs text-offwhite/30 font-body space-y-1.5">
                  <li><strong className="text-offwhite/50">Pecho:</strong> Medí alrededor de la parte más ancha del pecho</li>
                  <li><strong className="text-offwhite/50">Largo:</strong> Desde el hombro hasta el ruedo</li>
                  <li><strong className="text-offwhite/50">Hombro:</strong> De costura a costura de hombro</li>
                </ul>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border/10 text-center">
              <p className="text-[10px] font-mono text-offwhite/20">Si tienes dudas, contáctanos por <a href={`https://wa.me/584122934158`} target="_blank" rel="noopener noreferrer" className="text-gold/60 hover:text-gold transition-colors">WhatsApp</a></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
