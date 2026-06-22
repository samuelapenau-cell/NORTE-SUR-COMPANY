import type { Metadata } from "next";
import { Archivo_Black, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToastContainer } from "@/components/ToastContainer";
import { PageTransition } from "@/components/PageTransition";
import { SITE_URL, STORE } from "@/lib/constants";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NORTE SUR | CREADOS PARA LA GRANDEZA — Maracay",
    template: "%s | NORTE SUR",
  },
  icons: { icon: "/favicon.ico" },
  description:
    "Franelas oversize, hoodies, joggers y streetwear premium en Maracay, Venezuela. Orgullo venezolano.",
  keywords: [
    "ropa oversize Maracay",
    "streetwear Venezuela",
    "franelas oversize",
    "moda urbana Aragua",
    "NORTE SUR",
    "hoodies Maracay",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "NORTE SUR | CREADOS PARA LA GRANDEZA",
    description: "Franelas oversize, hoodies y streetwear premium. Fundado en Venezuela.",
    siteName: "NORTE SUR",
    locale: "es_VE",
    type: "website",
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/logo.png`, width: 512, height: 512 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivoBlack.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="fixed -top-full left-4 z-[100] px-5 py-3 bg-neon text-ink text-xs font-mono uppercase tracking-[2px] transition-all duration-300 focus:top-4 focus:outline-none">
          Saltar al contenido
        </a>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <ToastContainer />
          </CartProvider>
          <Script
            id="json-ld"
            type="application/ld+json"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Store",
                name: STORE.legalName,
                alternateName: "NORTE SUR",
                description: "Franelas oversize, hoodies, joggers y streetwear premium en Maracay, Venezuela.",
                url: SITE_URL,
                image: `${SITE_URL}/logo.png`,
                email: STORE.email,
                telephone: STORE.phone,
                slogan: STORE.slogan,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: `${STORE.address.line1}, ${STORE.address.line2}`,
                  addressLocality: STORE.address.city,
                  addressRegion: STORE.address.state,
                  addressCountry: STORE.address.country,
                },
                sameAs: [
                  `https://instagram.com/${STORE.instagram}`,
                  `https://tiktok.com/@${STORE.tiktok}`,
                  `https://wa.me/${STORE.whatsapp}`,
                  `https://threads.net/@${STORE.threads}`,
                ],
              }),
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
