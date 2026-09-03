// src/app/contact/page.tsx
"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { contactSchema, ContactFormData } from "@/lib/schemas/contact";
import { sendContactEmail } from "./actions";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { ContactTranslations } from "@/types/translations";
import { siteStyle, siteClass } from "@/config/site";

const styleLabel = "block mb-3";
const styleInput = `w-full px-4 py-2.5 rounded-xl ${siteClass.border} focus:ring-1 focus:ring-ring outline-none`;
const styleButton = siteStyle.boutonStyle;
const styleText = siteClass.text;

function ContactFormContent() {
  const { lang } = useLanguage();
  const { data: t, error, isLoading } = usePageTranslations<ContactTranslations>("contact", lang);

  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject") || searchParams.get("project") || "";
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      prenomNom: "",
      email: "",
      telephone: "",
      sujet: "",
      message: "",
      website: "", // Honeypot antispam
    },
  });

  // Injection automatique du sujet/projet passé en paramètre URL
  useEffect(() => {
    if (subjectParam) {
      setValue("sujet", subjectParam, { shouldValidate: true });
    }
  }, [subjectParam, setValue]);

  if (isLoading) {
    return <p className="text-center py-10 animate-pulse">Chargement des textes de la page contact...</p>;
  }

  if (error || !t) {
    return (
      <p className="text-center py-10 text-destructive" role="alert">
        {error instanceof Error ? error.message : "Impossible de charger les textes de la page contact"}
      </p>
    );
  }

  const onSubmit = async (data: ContactFormData) => {
    const res = await sendContactEmail(data);

    if (res.success) {
      toast.success("Votre message a bien été envoyé !");

      // Chargement dynamique de canvas-confetti au submit (SSR-safe)
      const confetti = (await import("canvas-confetti")).default;

      let originX = 0.5;
      let originY = 0.5;
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        originX = (rect.left + rect.width / 2) / window.innerWidth;
        originY = (rect.top + rect.height / 2) / window.innerHeight;
      }

      confetti({
        particleCount: 200,
        spread: 90,
        origin: { x: originX, y: originY },
        colors: [
          "#4f46e5", "#818cf8", "#312e81",
          "#ef4444", "#dc2626", "#eab308",
          "#facc15", "#ffffff",
        ],
      });
      reset();
    } else {
      toast.error(res.error || "Une erreur est survenue lors de l'envoi.", { duration: 10000 });
    }
  };

  return (
    <main className="w-full pb-5">
      <Toaster position="top-right" duration={4000} />

      {/* Section En-tête */}
      <section className={siteClass.sectionClass}>
        <div className="container-narrow flex flex-col items-center gap-10 py-2 md:py-4">
          <h1 className={`${siteStyle.ligne1SectionBleuStyle}`}>{t.hero.primary}</h1>
          <p className={`${siteStyle.ligne2SectionBleuStyle}`}>{t.hero.secondary}</p>
          <p className="w-full text-right italic text-black dark:text-white mt-3">{t.formulaire.champ}</p>
        </div>
      </section>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className={`container-narrow flex flex-col ${siteClass.sectionClass} space-y-6 px-4 mt-6`}>
        {/* Honeypot antispam */}
        <div className="hidden" aria-hidden="true">
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        {/* Ligne 1 : Identité, Email, Téléphone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label htmlFor="prenomNom" className={styleLabel}>{t.formulaire.identite}</label>
            <input
              id="prenomNom"
              {...register("prenomNom")}
              className={styleInput}
              placeholder="Jean Martin"
            />
            {errors.prenomNom && <p className="text-red-500 text-xs mt-1">{errors.prenomNom.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className={styleLabel}>{t.formulaire.email}</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={styleInput}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="telephone" className={styleLabel}>{t.formulaire.telephone}</label>
            <input
              id="telephone"
              type="tel"
              {...register("telephone")}
              className={styleInput}
            />
            {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
          </div>
        </div>

        {/* Ligne 2 : Sujet / Projet */}
        <div>
          <label htmlFor="sujet" className={styleLabel}>{t.formulaire.projet}</label>
          <div className="relative max-w-xs">
            <select  id="sujet" {...register("sujet")} className={`${styleInput} appearance-none pr-10 cursor-pointer`}>
              <option value={t.projets.defaut} className={styleText}>{t.projets.defaut}</option>
              {t.projets?.labels?.map((projet, index) => ( <option key={index} value={projet.option} className={styleText}>{projet.option}</option>))}
            </select>
            {/* Icône flèche pour matérialiser le déroulant */}
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-black dark:text-white" />
          </div>
          {errors.sujet && <p className="text-red-500 text-xs mt-1">{errors.sujet.message}</p>}
        </div>

        {/* Ligne 3 : Message */}
        <div>
          <label htmlFor="message" className={styleLabel}>{t.formulaire.message}</label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            className={styleInput}
            placeholder={t.formulaire.message_suggestion}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>

        {/* Bouton */}
        <button
          ref={buttonRef}
          type="submit"
          disabled={isSubmitting}
          className={`w-fit self-center ${styleButton}`}
        >
          {isSubmitting ? t.formulaire.bouton_attente : t.formulaire.bouton }
        </button>
      </form>
    </main>
  );
}

// Composant racine exporté avec la frontière Suspense obligatoire pour useSearchParams
export default function ContactPage() {
  return (
    <Suspense fallback={<p className="text-center py-10 animate-pulse">Chargement...</p>}>
      <ContactFormContent />
    </Suspense>
  );
}