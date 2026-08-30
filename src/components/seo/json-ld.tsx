// components/seo/json-ld.tsx
import Script from "next/script";

export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "François Vauchot",
    "url": "https://site-toilettage47.com",
    "jobTitle": "Développeur Informatique Full-Stack",
    "description": "Ingénieur et développeur Full-Stack spécialisé dans les écosystèmes React, Next.js et l'infrastructure Cloudflare.",
    "knowsAbout": ["React", "Next.js", "TypeScript", "Cloudflare", "Développement Web", "SEO Technique"],
    "sameAs": ["https://linkedin.com/in/françois-vauchot-2781472b9", "https://github.com/zura2612"],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://site-toilettage47.com/contact"
    }
  };

  return (
   <Script
      id="json-ld-website"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="beforeInteractive" // Recommandé pour le SEO afin qu'il soit dispo rapidem
    />
  );
}