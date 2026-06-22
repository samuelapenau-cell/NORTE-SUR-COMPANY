import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | NORTE SUR — WhatsApp, Ubicación y Horarios",
  description:
    "Contactanos por WhatsApp, visitanos en Maracay o seguinos en Instagram y TikTok. Estamos en Maracay, Estado Aragua, Venezuela.",
  openGraph: {
    title: "Contacto | NORTE SUR",
    description: "WhatsApp, ubicación y horarios de NORTE SUR en Maracay.",
  },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
