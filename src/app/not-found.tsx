import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="font-display text-[12rem] leading-none text-gold/10 tracking-[4px] select-none">
          404
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-offwhite tracking-[2px] -mt-8">
          Página no <span className="text-gold">encontrada</span>
        </h1>
        <p className="mt-6 text-sm text-offwhite/40 font-body leading-relaxed">
          Esta página no existe o fue movida. Revisa el link o vuelve al inicio.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-4 bg-gold text-black font-display text-lg tracking-[2px] rounded-sm hover:bg-gold-light transition-all duration-300 active:scale-[0.98]"
          >
            Volver al inicio
          </Link>
          <Link
            href="/tienda"
            className="px-8 py-4 border border-border text-offwhite/70 hover:text-gold hover:border-gold/50 font-body text-sm tracking-[1px] rounded-sm transition-all duration-300"
          >
            Explorar tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
