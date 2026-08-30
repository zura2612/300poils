import { NextResponse } from "next/server";

export async function GET() {
  const content = `# fvsoft1963 - François Vauchot (Développeur Web & Cloud)

> Développeur Fullstack spécialisé en applications React/Next.js, architectures Serverless Cloudflare et optimisation de performances web.

## Services principaux
- [Développement Web sur mesure](https://fvsoft1963.com/contact?subject=Web): Applications Next.js / TypeScript.
- [Architecture Serverless & Edge Cloudflare](https://fvsoft1963.com/contact?subject=Cloudflare): Workers, Pages, KV, D1, Hono.
- [Audit & Performance Web](https://fvsoft1963.com/contact?subject=Audit): Core Web Vitals, optimisation de bundle.

## Liens d'ingestion complète
- [Contenu intégral Markdown](https://fvsoft1963.com/llms-full.txt): Ensemble des données textuelles du site pour traitement LLM.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}