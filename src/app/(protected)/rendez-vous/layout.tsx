// fichier src/app/(protected)/rendez-vous/layout.tsx
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// ==============================================================================
// MODIFICATION : Export des métadonnées (remplace head: () => ({ meta: [...] }))
// ==============================================================================
// Next.js exige que metadata soit exporté depuis un Server Component.
// Ce layout est automatiquement un Server Component (pas de "use client").
export const metadata: Metadata = {
  title: `${siteConfig.entreprise} - Prendre rendez-vous`,
  description: siteConfig.headDescriptionBooking,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteConfig.url}/rendez-vous`,
  },
  openGraph: {
    title: `${siteConfig.entreprise} — Prendre rendez-vous`,
    description: siteConfig.headDescriptionBooking,
    type: "website",
    url: `${siteConfig.url}/rendez-vous`,
    images: [`${siteConfig.url}/vehicule.jpg`],
    siteName: siteConfig.entreprise,
  },
};

export default function RendezVousLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}