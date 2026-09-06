// fichier src/components/cta-band.tsx
"use client";
import Link  from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { CtaBandTranslations } from "@/types/translations";
// import des constantes d'environnement
import { siteStyle, siteClass } from "@/config/site";

const boutonTexte = "text-sm font-semibold text-center tracking-wider transition hover:opacity-60";
const desktopBaseClass = `rounded-xl px-4 py-2 ${boutonTexte}`;
const desktopActiveClass = `${desktopBaseClass} text-accent-foreground bg-accent`;

export default function CtaBand() {
  const { lang } = useLanguage();
  const { data: t, error } = usePageTranslations<CtaBandTranslations>("ctaBand", lang);
  if (error || !t)
    return <p className="text-center py-10 text-destructive" role="alert">
    {error instanceof Error ? error.message : "Impossible de charger les textes de ctaBand"}</p>;

  return (
    <section className={siteClass.sectionClass}>
      <div className="flex flex-col items-center gap-6 py-5 text-center md:py-10">
        <span className={`${siteStyle.titreSectionBlancStyle}`}>{t.hero.title}</span>
        <h2 className={`${siteStyle.ligne1SectionBlancStyle}`}>{t.hero.primary}</h2>
        <p className={`${siteStyle.ligne2SectionBlancStyle}`}>{t.hero.secondary}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {/*<Link href="/contact" className={`${siteStyle.boutonStyle}`}>*/}
          <Link href="/contact" className={desktopActiveClass}>
            {t.hero.bouton}
          </Link>
        </div>
      </div>
    </section>
  );
}