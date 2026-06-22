"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { CartSidebar } from "@/components/CartSidebar";

export function Header() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const profileHref = isAdmin ? "/admin" : "/perfil";
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useFocusTrap(menuOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/tienda", label: "Tienda" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-ink">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image src="/logo.png" alt="NORTE SUR" width={120} height={36} className="h-8 w-auto" priority />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-paper/50 hover:text-neon transition-colors duration-300 tracking-[2px] uppercase font-mono"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-paper/50 hover:text-neon transition-colors duration-300"
                aria-label="Abrir carrito"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon text-ink text-[9px] font-bold flex items-center justify-center font-mono">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>
            )}

            {mounted && (
              <>
                {user ? (
                  <Link
                    href={profileHref}
                    className="hidden sm:flex p-2 text-paper/50 hover:text-neon transition-colors duration-300"
                    aria-label="Mi Cuenta"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href="/ingresar"
                    className="hidden sm:block text-xs text-paper/50 hover:text-neon transition-colors font-mono uppercase tracking-[2px]"
                  >
                    Ingresar
                  </Link>
                )}
              </>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-paper/50 hover:text-neon transition-colors duration-300"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              <div className="w-5 h-3.5 relative flex flex-col justify-between">
                <span className={`block h-[1px] w-full bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
                <span className={`block h-[1px] w-full bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-[1px] w-full bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        <div
          ref={menuRef}
          className={`lg:hidden overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          role="dialog"
          aria-modal={menuOpen}
          aria-label="Menú de navegación"
        >
          <div className="px-6 py-8 border-t border-border flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-xl text-paper/70 hover:text-neon transition-colors font-body tracking-[1px]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-6 border-t border-border flex flex-col gap-4">
              {user ? (
                <Link href={profileHref} onClick={() => setMenuOpen(false)} className="text-sm text-paper/40 hover:text-paper transition-colors font-mono uppercase tracking-[2px]">
                  Mi Cuenta
                </Link>
              ) : (
                <Link href="/ingresar" className="text-sm text-paper/40 hover:text-paper transition-colors font-mono uppercase tracking-[2px]">
                  Ingresar
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
