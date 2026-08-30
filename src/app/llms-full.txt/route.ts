import { NextResponse } from "next/server";
// Ex: import { getAllRealisations } from "@/lib/mdx";

export async function GET() {
  // Concaténation de tes sources de données textuelles
  const markdownDump = `
# fvsoft1963 - Documentation Complète du Domaine

## Profil & Compétences
Nom : François Vauchot
Rôle : Ingénieur / Développeur Web
Tech Stack : Next.js, React, TypeScript, Tailwind CSS, Cloudflare Workers, Node.js.

## Réalisations & Cas d'étude
[Insérer ici le contenu extrait de tes fichiers MDX / Contentlayer / DB]
`;

  return new NextResponse(markdownDump, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}