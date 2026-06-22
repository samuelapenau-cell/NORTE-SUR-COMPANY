import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros | NORTE SUR — CREADOS PARA LA GRANDEZA",
  description:
    "Conocé nuestra historia. NORTE SUR Company es una marca de franelas oversize, hoodies y streetwear premium ubicada en Maracay, Estado Aragua, Venezuela. Más de 123K seguidores en Instagram.",
  openGraph: {
    title: "Nosotros | NORTE SUR — CREADOS PARA LA GRANDEZA",
    description: "Franelas oversize y streetwear premium en Maracay, Venezuela. Orgullo venezolano.",
  },
};

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
