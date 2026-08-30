// fichier src/app/about/page.tsx
"use client"; // Indispensable car ce composant utilise des hooks (useLanguage, usePageTranslations)

import CtaBand from "@/components/cta-band";
import { CheckCircle2, Heart, ShieldCheck, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { AboutTranslations } from "@/types/translations";
import { siteConfig, siteStyle, siteClass } from "@/config/site";

// ==============================================================================
// CORRECTION ASSETS : Chemins absolus pointant vers le dossier `public`
// ==============================================================================
// Next.js ne permet pas d'importer des .mp4 ou .jpg via un `import`. 
// Vous devez déplacer ces fichiers manuellement dans le dossier `public` de votre projet.
// Exemple : déplacez `src/assets/video_1.mp4` vers `public/videos/video_1.mp4`
const nomVideo_1 = "/videos/video_1.mp4";
const imgVideo_1 = "/images/video_1.jpg";
const imgPortrait = "/images/portrait.jpg";

export default function AboutPage() {
  const { lang } = useLanguage();
  const { data: t, error } = usePageTranslations<AboutTranslations>("about", lang);

  // Gestion propre de l'état de chargement / erreur
  if (error || !t) {
    return (
      <p className="text-center py-10 text-destructive" role="alert">
        {error instanceof Error ? error.message : "Impossible de charger les textes de la page about"}
      </p>
    );
  }

  // Remplace les variables dynamiques dans les textes traduits
  const champHeroSecondary = t.hero.secondary.replace("{entreprise}", siteConfig.entreprise);
  const champHistoireSecondary = t.histoire.secondary
    .replace("{entreprise}", siteConfig.entreprise)
    .replace("{nom}", siteConfig.nom);

  const aboutIconMap: Record<string, React.ElementType> = {
    CheckCircle2: CheckCircle2,
    Heart: Heart,
    ShieldCheck: ShieldCheck,
    Users: Users,
  };

  return (
    <main className="w-full">
      {/* HERO */}
      <section className={siteClass.sectionClass}>
        <div className="container-narrow grid gap-10 py-10 md:py-20 md:grid-cols-2">
          <div>
            <h1 className={siteStyle.ligne1SectionBlancStyle}>{t.hero.primary}</h1>
            <p className={siteStyle.ligne2SectionBlancStyle}>{champHeroSecondary}</p>
          </div>

          <div className="relative rounded-2xl overflow-hidden cursor-pointer group">
            <video
              controls
              preload="metadata"
              className="w-full h-auto rounded-2xl"
              poster={imgVideo_1}
            >
              <source src={nomVideo_1} type="video/mp4" />
              Votre navigateur ne supporte pas la balise vidéo.
            </video>
          </div>
        </div>
      </section>

      {/* HISTOIRE */}
      <section className={siteClass.sectionClass}>
        <div className="grid gap-10 py-5 md:py-10 md:grid-cols-2">
          <div>
            <h2 className={siteStyle.ligne1SectionBlancStyle}>{t.histoire.primary}</h2>
            <p className={siteStyle.ligne2SectionBlancStyle}>{champHistoireSecondary}</p>
            <br />
            
            {/* CORRECTION : Une balise <img> ne peut pas avoir de classes 'flex flex-col'. 
                J'ai ajusté les classes pour un rendu responsive et propre. */}
            <img
              src={imgPortrait}
              alt={`Portrait de ${siteConfig.nom}`}
              loading="lazy"
              decoding="async"
              className="w-full max-w-sm rounded-2xl object-cover shadow-soft"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {t.histoire.cartes.map(({ iconKey, title, text }) => {
              // Fallback sécurisé sur CheckCircle2 si la clé est manquante
              const Icon = aboutIconMap[iconKey] || CheckCircle2;
              
              return (
                <div key={title} className={`p-5 rounded-xl ${siteClass.border} bg-card`}>
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MÉTRIQUES */}
      <section className={siteClass.sectionClass}>
        <div className="container-narrow grid gap-6 text-center md:grid-cols-4">
          {t.metriques.cartes.map((metric) => (
            <div key={metric.title} className={`p-5 rounded-xl ${siteClass.border} bg-card`}>
              <p className="text-3xl font-bold text-primary">{metric.valeur}</p>
              <p className="mt-1 text-sm text-muted-foreground">{metric.title}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </main>
  );
}