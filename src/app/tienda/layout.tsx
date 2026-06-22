import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda NORTE SUR | Franelas Oversize y Streetwear Premium",
  description:
    "Explora nuestro catálogo de franelas oversize, hoodies, joggers y streetwear premium en Maracay, Venezuela. Algodón premium, envíos nacionales e internacionales.",
  openGraph: {
    title: "Tienda NORTE SUR | Catálogo Streetwear",
    description: "Franelas oversize, hoodies y streetwear premium en Maracay. CREADOS PARA LA GRANDEZA.",
  },
};

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
