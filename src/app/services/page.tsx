// fichier src/app/services/page.tsx
"use client";

import Link from "next/link";
import CtaBand from "@/components/cta-band";
import { Baby, Brush, CheckCircle2, Droplet, Heart, Scissors } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Imports de la logique de traduction
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { ServicesTranslations } from "@/types/translations";

// import des constantes d'environnement
import { siteConfig, siteStyle, siteClass } from "@/config/site";

export default function ServicesPage() {
  const { lang } = useLanguage();
  const { data:t, error } = usePageTranslations<ServicesTranslations>("services", lang);
  //const t = data || (frServicesTranslations as unknown as ServicesTranslations);
  if (error || !t)
    return <p className="text-center py-10 text-destructive" role="alert">
    {error instanceof Error ? error.message : "Impossible de charger les textes de la page services"}</p>;
  
  // Mapping des clés du JSON vers les icônes Lucide
  const servicesIconMap: Record<string, React.ElementType> = {
    Brush: Brush,
    Baby: Baby,
    Droplet: Droplet,
    CheckCircle2: CheckCircle2,
    Heart: Heart,
    Scissors: Scissors,
    };
  
  return (
    <main className="w-full">
  	  {/* HERO */}
      <section className={siteClass.sectionClass}>
        <div className="py-2 text-center md:py-4">
          <h1 className={`${siteStyle.ligne1SectionBlancStyle}`}>{t.hero.primary}</h1>
          <p className={`${siteStyle.ligne2SectionBlancStyle}`}>{t.hero.secondary}</p>
        </div>
      </section>
	  
	  {/* SERVICES */}
      <section className={siteClass.sectionClass}>
        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3`}>
          {t.services.cartes.map(({ iconKey, title, text, bouton }) => {
          // Récupère l'icône correspondante depuis le mapping
          const Icon = servicesIconMap[iconKey];
          return (
            <article key={title} className={`flex flex-col gap-5 p-5 rounded-xl ${siteClass.border} ${siteClass.hoverBorder} bg-card  transition hover:-translate-y-0.5`}>
              <div className="">
		<div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
                </div>
                <h2 className={`${siteStyle.titreVignetteStyle}`}>{title}</h2>
                <p className={`${siteStyle.ligne1VignetteStyle}`}>{text}</p>
	      </div>
              {/*<Link href="/contact" search={{ project: title }} avec React Router Passe title comme valeur du projet */}
              <Link href={`/contact?project=${encodeURIComponent(title)}`}
                className="mt-auto rounded-xl py-2 px-4 text-sm font-semibold text-center text-accent-foreground bg-accent tracking-wider transition hover:opacity-80">
                {bouton}
              </Link>
            </article>
          );
        })}
        </div>
      </section>
     
      <CtaBand />
    </main>
  );
}
