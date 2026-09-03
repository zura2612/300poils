// components/seo/json-ld.tsx
//import Script from "next/script";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocaBusiness",
    "name": "300 Poils - Toilettage canin",
    "image": "https://300poils-fvsoft-1963.vercel.app/favicon.png",
    "url": "https://300poils-fvsoft-1963.vercel.app",
    "telephone": "+33652728569",
    "category": "Toiletteur canin",
    "description": "Salon de toilettage canin à domicile dans le Lot-et-Garonne",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "148 route de Figuès",
      "addressLocality": "Argenton",
      "postalCode": "47250",
      "addressRegion": "Lot-et-Garonne",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 44.38678,
      "longitude": 0.09117
    },
    "areaServed": [ { "@type": "AdministrativeArea", "name": "Lot-et-Garonne" }, { "@type": "City", "name": "Marmande" },
      { "@type": "City", "name": "Tonneins" } ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Prestations de toilettage",
      "itemListElement": [
        {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Bain et séchage",
          "description": "Lavage avec shampoing adapté au pelage, démêlage et séchage doux."
        }
        },
        {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Tonte et coupe ciseaux",
          "description": "Tonte d'entretien ou coupe ciseaux spécifique à la race."
        }
        },
        {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Soin complet (Griffes & Oreilles)",
          "description": "Coupe des griffes, nettoyage des oreilles et soin des coussinets."
        }
        }
      ]
      }
};

export default function JsonLd() {
/* suppression de id="json-ld-website" et strategy="beforeInteractive" // Recommandé pour le SEO afin qu'il soit dispo rapidement */
  return (
   <>
   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
   </>
  );
}