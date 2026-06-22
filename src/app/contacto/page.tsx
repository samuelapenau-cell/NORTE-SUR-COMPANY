"use client";

import { STORE } from "@/lib/constants";

export default function ContactoPage() {
  return (
    <div className="pt-28 pb-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <span className="text-[10px] font-mono uppercase tracking-[3px] text-stone">Contacto</span>
          <h1 className="font-display text-5xl md:text-7xl text-paper uppercase leading-[0.9] tracking-[-1px] mt-3">
            Hable<span className="text-neon">mos</span>
          </h1>
          <div className="h-[1px] w-12 bg-neon mt-5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="space-y-6">
            <a href={"https://wa.me/" + STORE.whatsapp} target="_blank" rel="noopener noreferrer"
              className="block p-8 bg-smoke border border-border group hover:border-stone/50 transition-all duration-300">
              <p className="text-[9px] font-mono uppercase tracking-[2px] text-stone mb-2">WhatsApp</p>
              <h3 className="font-display text-2xl text-paper group-hover:text-neon transition-colors tracking-[1px] uppercase">Sidney</h3>
              <p className="text-sm text-stone font-body mt-1">{STORE.phone}</p>
            </a>

            <a href={"https://wa.me/" + STORE.whatsappLine2} target="_blank" rel="noopener noreferrer"
              className="block p-8 bg-smoke border border-border group hover:border-stone/50 transition-all duration-300">
              <p className="text-[9px] font-mono uppercase tracking-[2px] text-stone mb-2">WhatsApp</p>
              <h3 className="font-display text-2xl text-paper group-hover:text-neon transition-colors tracking-[1px] uppercase">Nairobi</h3>
              <p className="text-sm text-stone font-body mt-1">{STORE.whatsappLine2}</p>
            </a>

            <a href={STORE.mapsUrl} target="_blank" rel="noopener noreferrer" className="block p-8 bg-smoke border border-border group hover:border-stone/50 transition-all duration-300">
              <p className="text-[9px] font-mono uppercase tracking-[2px] text-stone mb-2">Ubicación</p>
              <h3 className="font-display text-2xl text-paper group-hover:text-neon transition-colors tracking-[1px] uppercase">Visitanos</h3>
              <p className="text-sm text-stone font-body mt-1">{STORE.address.line1}, {STORE.address.line2}</p>
              <p className="text-xs text-gravel font-body">{STORE.address.city}, {STORE.address.state}</p>
            </a>

            <a href={"https://instagram.com/" + STORE.instagram} target="_blank" rel="noopener noreferrer"
              className="block p-8 bg-smoke border border-border group hover:border-stone/50 transition-all duration-300">
              <p className="text-[9px] font-mono uppercase tracking-[2px] text-stone mb-2">Instagram</p>
              <h3 className="font-display text-2xl text-paper group-hover:text-neon transition-colors tracking-[1px] uppercase">@{STORE.instagram}</h3>
            </a>

            <a href={"https://tiktok.com/@nortesurcompany"} target="_blank" rel="noopener noreferrer"
              className="block p-8 bg-smoke border border-border group hover:border-stone/50 transition-all duration-300">
              <p className="text-[9px] font-mono uppercase tracking-[2px] text-stone mb-2">TikTok</p>
              <h3 className="font-display text-2xl text-paper group-hover:text-neon transition-colors tracking-[1px] uppercase">@nortesurcompany</h3>
            </a>
          </div>

          <div className="p-8 bg-smoke border border-border">
            <p className="text-[9px] font-mono uppercase tracking-[2px] text-stone mb-6">Horarios</p>
            <div className="space-y-4">
              {[
                { day: "Lunes - Viernes", hours: "9:00 AM - 7:00 PM" },
                { day: "Sábado", hours: "9:00 AM - 5:00 PM" },
                { day: "Domingo", hours: "10:00 AM - 3:00 PM" },
              ].map((sched) => (
                <div key={sched.day} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                  <span className="text-sm text-stone/80 font-body">{sched.day}</span>
                  <span className="text-sm text-paper font-mono">{sched.hours}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-[9px] font-mono uppercase tracking-[2px] text-stone mb-4">Servicios</p>
              <div className="flex flex-wrap gap-2">
                {["Delivery", "Pick-up", "Asesoría de tallas", "Cambios", "Venta al mayor"].map((svc) => (
                  <span key={svc} className="px-3 py-1.5 border border-border text-[10px] font-mono text-stone/80">
                    {svc}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-[9px] text-gravel font-mono uppercase tracking-[2px]">
                NORTE SUR · {STORE.slogan}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
