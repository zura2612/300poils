// fichier src/app/page.tsx
"use client";

//import Hero from "@/components/hero";
import CtaBand from "@/components/cta-band";
import WelcomeModal from "@/components/welcome-modal";
import { ArrowRight, Award, Clock, Lightbulb, PlugZap, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { useLanguage } from "@/contexts/LanguageContext";

// Imports de la logique de traduction
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { HomeTranslations } from "@/types/translations";

// import des images
const imgVehicule = "/images/vehicule.jpg";
const imgRealisation_1 = "/images/realisation_1.jpg";
const imgRealisation_2 = "/images/realisation_2.jpg";
const imgRealisation_3 = "/images/realisation_3.jpg";

// import des constantes d'environnement
import { siteConfig, siteStyle, siteClass } from "@/config/site";

/*export interface HeroProps { className?: string; }*/

export default function HomePage() {
  const { lang } = useLanguage();
  const { data:t, error } = usePageTranslations<HomeTranslations>("home", lang);
  if (error || !t)
    return <p className="text-center py-10 text-destructive" role="alert">
    {error instanceof Error ? error.message : "Impossible de charger les textes de la page home"}</p>;
  
  // assurer la cohérence entre les icones des home.xx.json, les icones importées et homeIconMap
  const homeIconMap: Record<string, React.ElementType> = {
    Award: Award, Clock: Clock, Lightbulb: Lightbulb, PlugZap: PlugZap,ShieldCheck: ShieldCheck
  };
	
  // Mapping des clés du JSON vers les images importées
  const realisationsImages: Record<string, string> = {
    "realisation_1.jpg": imgRealisation_1,
    "realisation_2.jpg": imgRealisation_2,
    "realisation_3.jpg": imgRealisation_3
  };  

  return (
    <main className="w-full">
      {/* Fenêtre de bienvenue (se ferme au bout de 5 secondes) */}
      <WelcomeModal duration={5} />    
   
      {/* Section Hero */}
      <section className={siteClass.sectionClass}>
        <div className="grid md:grid-cols-2 text-center gap-10 px-2 md:px-4 py-2 md:py-4">
          <div>
            <h1 className={`${siteStyle.ligne1SectionBlancStyle} text-destructive`}>
              Attention site de démonstration uniquement!
            </h1>
            <h1 className={`${siteStyle.ligne1SectionBlancStyle}`}>
	      {t.hero.primaryBefore}<span className="text-souligne">{t.hero.primaryAccent}</span>{t.hero.primaryAfter}
            </h1>
            <div className={`pl-2 ${siteStyle.ligne2SectionBlancStyle}`}>
              {t.hero.secondary.replace("{entreprise}", siteConfig.entreprise)}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-accent/20 blur-2xl"/>
              <img 
              src={imgVehicule}  
              alt="véhicule de l'entreprise" 
              loading="lazy" 
              decoding="async"
              className={`relative aspect-square w-full rounded-xl object-cover ${siteClass.border}`}
              />
            </div>
          </div>
      </section>

      {/* TRUST BAR */}
      <section className={siteClass.sectionClass}>
        <div className="container-narrow  grid grid-cols-2 md:grid-cols-3 text-center gap-6 py-8">
           {t.trustbar.items.map(({ iconKey, label }) => {
           const Icon = homeIconMap[iconKey];
           return (
	     <div key={label} className="flex items-center justify-center gap-2">
               <Icon className="h-4 w-4 text-primary" /> {label}
             </div> );
		  })}
        </div>
      </section>

      {/* POURQUOI */}
      <section className={siteClass.sectionClass}>
        <div className="text-center">
          <p className={`${siteStyle.titreSectionBlancStyle}`}>{t.pourquoi.title}</p>
          <h2 className={`${siteStyle.ligne1SectionBlancStyle}`}>
            {t.pourquoi.primary}
          </h2>
          <p className={`pl-2 ${siteStyle.ligne2SectionBlancStyle}`}>{t.pourquoi.secondary}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
		  {t.pourquoi.cartes.map(({ iconKey, title, text }) => {
           const Icon = homeIconMap[iconKey];
           return (
		    <div key={title} className={`rounded-xl ${siteClass.border} ${siteClass.hoverBorder} bg-card p-5 shadow-soft transition hover:-translate-y-0.5 `}>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className={`${siteStyle.titreVignetteStyle}`}>{title}</h3>
              <p className={`${siteStyle.ligne1VignetteStyle}`}>{text}</p>
            </div> );
		  })}
        </div>
      </section>
      
      {/* PROCESSUS */}
      <section className={siteClass.sectionClass}>
        <div className="text-center">
          <p className={`${siteStyle.titreSectionBlancStyle}`}>{t.processus.title}</p>
          <h2 className={`${siteStyle.ligne1SectionBlancStyle}`}>{t.processus.primary}</h2>
        </div>

        <div className="relative mt-12 flex flex-col gap-8 md:flex-row md:items-stretch">
	  {t.processus.cartes.map((step,i) => (
            <div key={step.num} className="relative flex-1">
              <div className={`h-full rounded-xl ${siteClass.border} bg-card p-6 shadow-soft`}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {step.num}
                  </span>
                  <h3 className={`${siteStyle.titreVignetteStyle}`}>{step.title}</h3>
                </div>
                <p className={`${siteStyle.ligne1VignetteStyle}`}>{step.text}</p>
              </div>
              {i < t.processus.cartes.length -1 && (
                <ArrowRight className="absolute -right-7 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-black dark:text-white md:block" />
              )}
            </div>
	  ))}
        </div>
      </section>
     
      {/* REALISATIONS */}
	  <section className={siteClass.sectionClass}>
	    <div className="text-center">
            <p className={`${siteStyle.titreSectionBlancStyle}`}>{t.realisations.title}</p>
            <h2 className={`${siteStyle.ligne1SectionBlancStyle}`}>{t.realisations.primary}</h2>
            </div>
        
	    <div className="relative mt-12 grid gap-8 md:grid-cols-3">
              {t.realisations.cartes.map((p) => {
              // Récupère l'image correspondante depuis le mapping
              const imgSrc = realisationsImages[p.srcKey];
	      // Vérifie que l'image existe (fallback si nécessaire)
              if (!imgSrc) {
                console.warn(`Image non trouvée pour la clé : ${p.srcKey}`);
                return null;
              }
              return (
	        <figure key={p.title} className={`group relative overflow-hidden rounded-xl ${siteClass.border} ${siteClass.hoverBorder}`} >
                 <img src={imgSrc} alt={p.title} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
                 <figcaption className="absolute inset-x-3 bottom-3 rounded-xl bg-background/95 px-3 py-2 text-xs">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-muted-foreground">{p.location}</p>
                 </figcaption>
                </figure> );
	      })}
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className={siteClass.sectionClass}>
	  <div className="text-center">
            <p className={`${siteStyle.titreSectionBlancStyle}`}>{t.temoignages.title}</p>
            <h2 className={`${siteStyle.ligne1SectionBlancStyle}`}>{t.temoignages.primary}</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.temoignages.cartes.map((item) => (
              <article key={item.name} className={`flex flex-col rounded-xl ${siteClass.border} bg-card p-6 shadow-soft`}>
                {/* Étoiles (5 étoiles pleines) */}
		<div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

		{/* Texte du témoignage */}
                <p className={`${siteStyle.ligne1VignetteStyle}`}>"{item.text}”</p>
                {/* nom du témoin et date de l'avis */}
	        <div className="mt-auto flex items-end gap-3">
                  <div>
                    <p className={`${siteStyle.ligne1VignetteStyle} font-semibold`}>{item.name}</p>
                    <p className={`${siteStyle.ligne1VignetteStyle}`}>{item.date}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
      </section>

      {/* FAQ */}
      <section className={siteClass.sectionClass}>
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-10"> {/* 60% et 40% */}
          <div>
            <p className={`pl-2 ${siteStyle.titreSectionBlancStyle}`}>{t.faq.title}</p>
            <h2 className={`pl-2 ${siteStyle.ligne1SectionBlancStyle}`}>{t.faq.primary}</h2>
	    <p className={`pl-2 ${siteStyle.ligne2SectionBlancStyle}`}>{t.faq.secondary}</p>
	  </div>

          <Accordion type="single" collapsible className="w-full">
            {t.faq.questions.map((faqItem, index) => (
              <AccordionItem key={faqItem.question} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">{faqItem.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faqItem.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
           
      {/* Section CtaBand */}
      <CtaBand />    
    </main>
  );
}