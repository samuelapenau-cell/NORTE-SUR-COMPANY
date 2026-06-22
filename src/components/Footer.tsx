"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STORE } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-xl tracking-[4px] text-paper uppercase">
              NORTE<span className="text-neon">/</span>SUR
            </span>
            <p className="mt-3 text-xs text-stone font-body leading-relaxed max-w-[240px]">
              {STORE.slogan}
            </p>
            <p className="mt-4 text-xs font-mono uppercase tracking-[2px] text-stone">
              Maracay, Venezuela
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[2px] text-gravel mb-4">Tienda</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/tienda" className="text-xs text-stone hover:text-paper transition-colors">Todos</Link></li>
              <li><Link href="/tienda?categoria=franelas-oversize" className="text-xs text-stone hover:text-paper transition-colors">Franelas</Link></li>
              <li><Link href="/tienda?categoria=hoodies" className="text-xs text-stone hover:text-paper transition-colors">Hoodies</Link></li>
              <li><Link href="/tienda?categoria=joggers" className="text-xs text-stone hover:text-paper transition-colors">Joggers</Link></li>
              <li><Link href="/tienda?categoria=gorras" className="text-xs text-stone hover:text-paper transition-colors">Gorras</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[2px] text-gravel mb-4">Info</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/nosotros" className="text-xs text-stone hover:text-paper transition-colors">Nosotros</Link></li>
              <li><Link href="/contacto" className="text-xs text-stone hover:text-paper transition-colors">Contacto</Link></li>
              <li><Link href="/rastrear" className="text-xs text-stone hover:text-paper transition-colors">Rastrear</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[2px] text-gravel mb-4">Redes</h4>
            <ul className="flex flex-col gap-2">
              <li><a href={`https://instagram.com/${STORE.instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs text-stone hover:text-paper transition-colors">Instagram</a></li>
              <li><a href={`https://tiktok.com/@${STORE.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-xs text-stone hover:text-paper transition-colors">TikTok</a></li>
              <li><a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-xs text-stone hover:text-paper transition-colors">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-stone/50 font-mono">
            &copy; {new Date().getFullYear()} {STORE.legalName}
          </p>
          <p className="text-[10px] text-stone/50 font-mono uppercase tracking-[2px]">
            {STORE.slogan}
          </p>
        </div>
      </div>
    </footer>
  );
}
