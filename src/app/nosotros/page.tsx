"use client";

import Link from "next/link";
import Image from "next/image";
import { STORE } from "@/lib/constants";

export default function NosotrosPage() {
  return (
    <div className="pt-28 pb-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 md:mb-24">
          <span className="text-[10px] font-mono uppercase tracking-[3px] text-stone">Nosotros</span>
          <h1 className="font-display text-5xl md:text-7xl text-paper uppercase leading-[0.9] tracking-[-1px] mt-3">
            CREADOS PARA
            <br />
            <span className="text-neon">LA GRANDEZA</span>
          </h1>
          <div className="h-[1px] w-12 bg-neon mt-5" />
          <p className="mt-6 text-sm text-stone font-body max-w-[540px] leading-relaxed">
            Franelas oversize, hoodies, joggers y streetwear premium. Fundado en Venezuela,
            para la crew que no busca encajar — busca destacar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-20">
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-paper uppercase leading-[0.9] tracking-[-1px]">
              Nuestra
              <br />
              <span className="text-neon">Historia</span>
            </h2>
            <div className="h-[1px] w-10 bg-neon mt-5 mb-6" />
          </div>
          <div className="space-y-4 text-sm text-stone font-body leading-relaxed">
            <p>
              Nacimos en Maracay con una misión clara: crear ropa que represente la cultura
              urbana venezolana. Desde nuestro local, hemos construido una comunidad de miles
              de personas que comparten nuestra pasión por el estilo oversize y el streetwear.
            </p>
            <p>
              Con más de {STORE.followers} seguidores en Instagram y presencia en TikTok,
              nos hemos convertido en Distribuidores N°1 de oversizes en Maracay y un referente
              de la moda urbana en Venezuela.
            </p>
            <p>
              Creemos que la ropa es más que tela: es identidad. Cada prenda que diseñamos
              pasa por un filtro de calidad, corte oversize perfecto y estilo que habla el
              lenguaje de la calle. Sin filtros. Sin excusas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20">
          {[
            { num: "123K+", label: "Instagram" },
            { num: "63.7K", label: "TikTok" },
            { num: "500+", label: "Productos" },
            { num: "1", label: "Venezuela" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 bg-smoke border border-border text-center">
              <p className="font-display text-4xl md:text-5xl text-neon tracking-[1px]">{stat.num}</p>
              <p className="mt-2 text-[10px] text-stone/60 font-mono uppercase tracking-[2px]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-20">
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-paper uppercase leading-[0.9] tracking-[-1px]">
              ¿Por qué
              <br />
              <span className="text-neon">elegirnos?</span>
            </h2>
            <div className="h-[1px] w-10 bg-neon mt-5 mb-6" />
            <div className="space-y-6 text-sm text-stone font-body">
              {[
                { icon: "leaf", title: "Algodón Premium 100%", desc: "Transpirable, hipoalergénico y durable." },
                { icon: "scissors", title: "Corte Oversize Perfecto", desc: "El fit que define la marca." },
                { icon: "flag", title: "Hecho en Venezuela", desc: "Producción local con estándares globales." },
                { icon: "building", title: "Urban Streetwear", desc: "Diseños que hablan el lenguaje de la calle." },
              ].map((item) => {
                const Icon = () => {
                  switch (item.icon) {
                    case "leaf":
                      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 019.5 6.5C11 5 13 4 15 4c0 2 .5 4-1.5 6-1 1-2.5 2-4 2"/><path d="M4 20c3.5-2 6-5 8-8"/></svg>;
                    case "scissors":
                      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>;
                    case "flag":
                      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>;
                    case "building":
                      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9" y2="7"/><line x1="15" y1="6" x2="15" y2="7"/><line x1="9" y1="10" x2="9" y2="11"/><line x1="15" y1="10" x2="15" y2="11"/><line x1="9" y1="14" x2="9" y2="15"/><line x1="15" y1="14" x2="15" y2="15"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
                    default:
                      return null;
                  }
                };
                return (
                  <div key={item.title} className="flex gap-3">
                    <span className="text-neon mt-0.5 flex-shrink-0"><Icon /></span>
                    <div>
                      <strong className="text-paper/80">{item.title}</strong>
                      <p className="mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="aspect-[4/3] bg-smoke border border-border overflow-hidden relative">
            <Image
              src="/portada/Screenshot_2026-06-22-14-20-40-030_com.instagram.android-edit.jpg.jpeg"
              alt="NORTE SUR — Streetwear premium"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink via-ink/60 to-transparent pt-12">
              <p className="text-[10px] text-neon font-mono uppercase tracking-[3px]">{STORE.slogan}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-20">
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-paper uppercase leading-[0.9] tracking-[-1px]">
              Visitanos en
              <br />
              <span className="text-neon">Maracay</span>
            </h2>
            <div className="h-[1px] w-10 bg-neon mt-5 mb-6" />
            <div className="space-y-4 text-sm text-stone font-body">
              <a href={STORE.mapsUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-neon transition-colors">
                <strong className="text-paper/80">{STORE.address.line1}</strong>
                <br />{STORE.address.line2}
              </a>
              <p>{STORE.address.city}, {STORE.address.state}</p>
              <div className="pt-4 border-t border-border">
                <p className="text-[10px] font-mono uppercase tracking-[2px] text-neon mb-3">Horarios</p>
                <p className="text-stone">Lun - Vie: {STORE.hours.weekdays}</p>
                <p className="text-stone">Sáb: {STORE.hours.saturday}</p>
                <p className="text-stone">Dom: {STORE.hours.sunday}</p>
              </div>
            </div>
          </div>
          <div className="aspect-[4/3] bg-smoke border border-border overflow-hidden relative">
            <a href={STORE.mapsUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <iframe
                src="https://www.google.com/maps?q=10.2526227,-67.6065823&z=17&output=embed"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                title="Ubicación NORTE SUR — Maracay"
                className="pointer-events-none opacity-60"
              />
              <div className="absolute inset-0 z-10" />
            </a>
          </div>
        </div>

        <div id="envios" className="mb-20">
          <div className="mb-10">
            <span className="text-[10px] font-mono uppercase tracking-[3px] text-stone">Envíos</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl text-paper uppercase leading-[0.9] tracking-[-1px]">
              Opciones de <span className="text-neon">Envío</span>
            </h2>
            <div className="h-[1px] w-10 bg-neon mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {["MRW", "Zoom", "Domesa", "Liberty Express", "Tealca"].map((agencia) => (
              <div key={agencia} className="p-4 bg-smoke border border-border text-center">
                <p className="font-mono text-sm text-neon tracking-[1px]">{agencia}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="faq">
          <div className="mb-10">
            <span className="text-[10px] font-mono uppercase tracking-[3px] text-stone">FAQ</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl text-paper uppercase leading-[0.9] tracking-[-1px]">
              Preguntas <span className="text-neon">Frecuentes</span>
            </h2>
            <div className="h-[1px] w-10 bg-neon mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { q: "¿Cómo hago un pedido?", a: "Agregá los productos a tu carrito, completá tus datos y envianos el pedido por WhatsApp." },
              { q: "¿Hacen envíos a todo Venezuela?", a: "Sí. Hacemos delivery en Maracay y envíos nacionales vía MRW, Zoom, Domesa, Liberty Express y Tealca." },
              { q: "¿Venden al mayor?", a: "Sí. Tenemos precios especiales por docena (~$8.5-$11 c/u) y por pieza ($12-$35)." },
              { q: "¿Cómo puedo pagar?", a: "Aceptamos pago móvil, transferencias bancarias, Zelle y efectivo. Precios en USD." },
              { q: "¿Puedo retirar en tienda?", a: "Sí. Seleccioná pick-up al hacer tu pedido." },
              { q: "¿Cómo son las tallas?", a: "Manejamos S/M/L/XL/2XL. Consultanos por WhatsApp para asesoría." },
              { q: "¿Aceptan cambios?", a: "Sí, dentro de los primeros 7 días. Producto debe estar en estado original." },
              { q: "¿Hacen prendas personalizadas?", a: "No. Trabajamos con diseños de colección y drops limitados." },
            ].map((faq) => (
              <div key={faq.q} className="p-6 bg-smoke border border-border">
                <h3 className="font-display text-xl text-neon tracking-[1px] uppercase">{faq.q}</h3>
                <p className="mt-3 text-sm text-stone font-body leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
