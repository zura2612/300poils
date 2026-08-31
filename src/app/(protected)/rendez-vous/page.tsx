// fichier src/app/(protected)/rendez-vous/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Metadata } from "next";

import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { BookingTranslations } from "@/types/translations";

// import des constantes d'environnement
import { siteConfig, siteStyle, siteClass } from "@/config/site";

import { InlineCalendar } from "@/components/booking/InlineCalendar";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { BookingInfo } from "@/components/booking/BookingInfo";
import { EventSelector } from "@/components/booking/EventSelector";
import { buildCalLinkWithPrefill } from "@/lib/cal";
import { CAL_EVENTS, getDefaultEvent, getEventById } from "@/config/cal-events";
import { getLastSelectedEvent, setLastSelectedEvent } from "@/lib/last-event";
import type { CalBookingDetails } from "@/types/cal";
//import { BOOKING_STORAGE_KEY } from "@/lib/storage-keys";
import { useAuth } from "@workos-inc/authkit-react";

type BookingStatus = "idle" | "success" | "cancelled";

// ==============================================================================
// MODIFICATION 2 : Export des métadonnées (remplace head: () => ({ meta: [...] }))
// ==============================================================================
// Next.js utilise l'API Metadata pour générer les balises <head> automatiquement. Cette exportation doit être faite dans un Server Component, mais comme notre
// page est "use client", nous utilisons generateMetadata dans un fichier séparé OU nous générons les balises manuellement via <head> dans le JSX.
// Solution recommandée : créer un fichier page.tsx côté serveur qui exporte metadata et un composant client BookingPageClient pour la logique interactive.
// Pour simplifier la migration, nous gardons tout dans un seul fichier client.

export default function BookingPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventFromUrl = searchParams.get("event") || undefined;

  // Tous les hooks doivent être appelés AVANT tout return conditionnel
  const { data: t, isLoading: isTransLoading, error } = usePageTranslations<BookingTranslations>("rendez-vous", lang);
  const { user, isLoading: isAuthLoading } = useAuth();
  const isAuthenticated = !!user;

  const [status, setStatus] = useState<BookingStatus>("idle");
  const [lastBooking, setLastBooking] = useState<CalBookingDetails | null>(null);
  // MODIFICATION 1 : État de chargement du bouton "Choisir"
  // Q3.1 État de chargement avec spinner pendant le rechargement du calendrier.
  // Q3.2 Le rechargement prend 2-4 secondes, donc l'état de chargement est pertinent.
  const [isSelecting, setIsSelecting] = useState(false);

  // SÉCURITÉ ACTIVE : Nettoyage garanti au montage pour éviter les fantômes
  /*useEffect(() => {
    // On force la suppression de toute ancienne donnée de réservation au chargement
    // Cela garantit que même si un vieux cache existe, il est détruit immédiatement.
    if (typeof window !== "undefined") { localStorage.removeItem("lastSelectedEvent"); }
  }, []);*/
  /*useEffect(() => {
    console.log("🔍 ÉTAT AU RENDU -> status:", status, "| lastBooking:", lastBooking);
  }, [status, lastBooking]);*/


  // Logique de sélection d'événement (déterministe)
  const selectedEvent = (() => {
    if (eventFromUrl) {
      const fromUrl = getEventById(eventFromUrl);
      if (fromUrl) return fromUrl;
    }
    const lastEventId = getLastSelectedEvent();
    if (lastEventId) {
      const fromStorage = getEventById(lastEventId);
      if (fromStorage) return fromStorage;
    }
    return getDefaultEvent();
  })();

  useEffect(() => {
    if (!eventFromUrl) {
      const lastEventId = getLastSelectedEvent();
      if (lastEventId && getEventById(lastEventId)) {
        router.replace(`/rendez-vous?event=${encodeURIComponent(lastEventId)}`);
      }
    }
  }, [eventFromUrl, router]);

  // MODIFICATION 2 : Détection de la fin du rechargement du calendrier
  // Quand selectedEvent.id change, le calendrier se recharge (via la prop 'key' de InlineCalendar).
  // On attend un délai minimum (1 seconde) pour éviter le flash, puis on désactive l'état de chargement.
  useEffect(() => {
    if (isSelecting) {
      const timer = setTimeout(() => {
        setIsSelecting(false);
      }, 1000); // Délai minimum de 1 seconde pour éviter le flash
      return () => clearTimeout(timer);
    }
  }, [selectedEvent.id, isSelecting]);

  // Handler de sélection d'événement avec état de chargement
  // Au clic sur "Choisir", on active isSelecting pour bloquer les clics suivants.
  // Le calendrier se recharge, et après 1 seconde, isSelecting est désactivé.
  const handleEventSelect = useCallback((eventId: string) => {
    if (isSelecting) return; // Anti-spam : bloque les clics pendant le chargement
    
    setIsSelecting(true); // Active l'état de chargement
    router.replace(`/rendez-vous?event=${encodeURIComponent(eventId)}`);
    setLastSelectedEvent(eventId);
    setStatus("idle");
    setLastBooking(null);
  }, [router, isSelecting]);

  const handleBookingSuccess = useCallback((data: CalBookingDetails) => {
    //console.log("handleBookingSuccess: ✅ Réservation réussie détectée via Cal.com");
    setStatus("success");
    setLastBooking(data);

    // MODIFICATION 3 : Suppression de l'écriture dans sessionStorage
    setTimeout(() => {
      document.getElementById("booking-confirmation")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 300);
  }, []);

  const handleBookingCancel = useCallback(() => {
    //console.log("handleBookingCancel:❌ Réservation annulée");
    setStatus("cancelled");
   }, []);

  const handleReschedule = useCallback((data: CalBookingDetails) => {
    //console.log("handleReschedule:🔄 Réservation modifiée");
    setLastBooking(data);
    setStatus("success");
   }, []);

  const handleNewBooking = useCallback(() => {
    //console.log("handleNewBooking:🔄 Nouvelle réservation demandée (reset de l'état)");
    setStatus("idle");
    setLastBooking(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleGoHome = useCallback(() => {
    router.push("/");
  }, [router]);

  // Vérifications conditionnelles APRÈS tous les hooks
  if (isAuthLoading || isTransLoading) {
    return (
      <p className="text-center py-10 animate-pulse" aria-live="polite">Chargement...</p>
    );
  }

  if (error || !t) {
    return (
      <main className="w-full">
        <section className={siteClass.sectionClass}>
          <p className="text-center py-4 text-destructive" role="alert">
            {error instanceof Error ? error.message : "Impossible de charger les textes de la page Rendez-vous"}
          </p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container-narrow py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">{t.auth.title}</h2>
        <p className="text-muted-foreground mb-6">{t.auth.message}</p>
        <button  onClick={() => router.push("/")} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
          {t.auth.button}
        </button>
      </div>
    );
  }

  // MODIFICATION 9 : Rendu principal (identique, avec adaptations mineures)
  const userName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.lastName || undefined;
  const userEmail = user?.email || undefined;

  const calLink = buildCalLinkWithPrefill(selectedEvent.slug, {
    name: userName,
    email: userEmail,
  });

  return (
    <main className="w-full">
      {/* HERO */}
      <section className={siteClass.sectionClass}>
        <div className="container-narrow">
          <h1 className={siteStyle.ligne1SectionBlancStyle}>{t.hero.primary}</h1>
          <p className={siteStyle.ligne2SectionBlancStyle}>{t.hero.secondary}</p>
        </div>
      </section>

      {/* SÉLECTEUR D'ÉVÉNEMENTS (masqué après réservation) */}
      {status !== "success" && (
        <EventSelector events={CAL_EVENTS} selectedEventId={selectedEvent.id} onSelect={handleEventSelect} texts={t.events} isSelecting={isSelecting}/>
      )}

      {/* Calendrier */}
      <section className={siteClass.sectionClass}>
        <div className="container-narrow py-10">
          {status === "success" && lastBooking && lastBooking.date ? (
            <BookingConfirmation booking={lastBooking} onNewBooking={handleNewBooking} onGoHome={handleGoHome} texts={t.confirmation}/>
          ) : (
            <>
              {status === "cancelled" && (
                <div className="mb-8 rounded-2xl border border-black bg-yellow-50 p-6 shadow-soft" role="status">
                  <p className="text-yellow-800">{t.annulation.message}</p>
                </div>
              )}
              <div className="rounded-2xl border border-black bg-card p-6 shadow-soft">
                <InlineCalendar key={selectedEvent.id} calLink={calLink} layout="month_view" className="w-full"
                  eventHandlers={{ onBookingSuccess: handleBookingSuccess, onBookingCancel: handleBookingCancel, onReschedule: handleReschedule }}
                  loadingText={t.chargement} errorText={t.erreur} retryText={t.reessayer}/>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Informations */}
      <BookingInfo primary={t.info.primary} secondary={t.info.secondary} cartes={t.info.cartes}/>
    </main>
  );
}