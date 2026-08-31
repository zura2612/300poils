// fichier src/app/contact/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { ContactTranslations } from "@/types/translations";
import { siteConfig, siteStyle, siteClass } from "@/config/site";

const intituleZoneSaisieStyle = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const inputBase = `w-full rounded-xl ${siteClass.border} ${siteClass.hoverBorder} bg-background text-foreground px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary`;
const selectBase = `${inputBase} appearance-none pr-8 cursor-pointer`;
const workerUrl = process.env.NEXT_PUBLIC_RESEND_WORKER_URL;

function ContactFormContent() {
  const { lang } = useLanguage();
  const { data: t, error, isLoading } = usePageTranslations<ContactTranslations>("contact", lang);

  const searchParams = useSearchParams();
  const projectFromUrl = searchParams.get("project") || "";
  const [isSending, setIsSending] = useState(false);

  const [selectedProject, setSelectedProject] = useState<string>(projectFromUrl);

  useEffect(() => {
    if (t && !selectedProject && t.projets?.defaut) {
      setSelectedProject(t.projets.defaut);
    }
  }, [t, selectedProject]);

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

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    if (!workerUrl) {
      toast.error("Configuration serveur manquante (RESEND_WORKER_URL). Contactez l'administrateur.");
      console.error("[ContactPage] La variable d'environnement NEXT_PUBLIC_RESEND_WORKER_URL n'est pas définie.");
      setIsSending(false);
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const enrichedData = { ...data, pageUrl: window.location.href };

    try {
      const response = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichedData),
      });

      const result = (await response.json()) as { error?: string };

      if (response.ok) {
        toast.success(t.toast.succes);
        form.reset();
        setSelectedProject(t.projets.defaut);
      } else {
        toast.error(result.error ?? t.toast.erreur_resend);
      }
    } catch (err) {
      toast.error(t.toast.erreur_reseau);
      console.error("Erreur :", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="w-full">
      <Toaster position="top-right" duration={4000} />

      <section className={siteClass.sectionClass}>
        <div className="container-narrow flex flex-col items-center gap-10 py-5 md:grid-cols-2 md:py-10">
          <h1 className={`${siteStyle.ligne1SectionBleuStyle}`}>{t.hero.primary}</h1>
          <p className={`${siteStyle.ligne2SectionBleuStyle}`}>{t.hero.secondary}</p>
        </div>
      </section>

      <section className={siteClass.sectionClass}>
        <div className="grid">
          <form onSubmit={sendEmail} className="w-full rounded-xl p-2 md:p-4 shadow-soft">
            <div className="flex justify-end mb-1">
              <p className="text-xs text-muted-foreground italic" id="required-fields-note">
                {t.formulaire.champ}
              </p>
            </div>

            <div className="grid gap-2 md:gap-4 sm:grid-cols-2 md:grid-cols-3">
              {/* Identité */}
              <div>
                <label className={intituleZoneSaisieStyle}>{t.formulaire.identite}</label>
                <input
                  name="prenomNom"
                  type="text"
                  required
                  title={t.formulaire.message_tooltip}
                  className={inputBase}
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className={intituleZoneSaisieStyle}>{t.formulaire.telephone}</label>
                <input name="phone" type="tel" className={inputBase} />
              </div>

              {/* Courriel */}
              <div>
                <label className={intituleZoneSaisieStyle}>{t.formulaire.email}</label>
                <input
                  name="courriel"
                  type="email"
                  required
                  title={t.formulaire.message_tooltip}
                  className={inputBase}
                />
              </div>

              {/* Sélection du soin / projet */}
              <div className="col-span-full sm:col-span-1">
                <label className={intituleZoneSaisieStyle}>{t.formulaire.projet}</label>
                <div className="relative">
                  <select
                    name="project"
                    className={selectBase}
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option value={t.projets.defaut}>{t.projets.defaut}</option>
                    {t.projets.labels.map((projet, index) => (
                      <option key={index} value={projet.option}>
                        {projet.option}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    className="pointer-events-none absolute h-4 w-4 text-muted-foreground top-1/2 -translate-y-1/2"
                    style={{ right: "10px" }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="col-span-full">
                <label className={intituleZoneSaisieStyle}>{t.formulaire.message}</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  title={t.formulaire.message_tooltip}
                  aria-describedby="required-fields-note"
                  className={inputBase}
                  placeholder={t.formulaire.message_suggestion}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className={`mt-4 ${siteStyle.boutonStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSending ? "Envoi en cours..." : t.formulaire.bouton}
            </button>

            <p className="mt-3 text-xs text-muted-foreground">{t.formulaire.confidentialite}</p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<p className="text-center py-10 animate-pulse">Chargement...</p>}>
      <ContactFormContent />
    </Suspense>
  );
}