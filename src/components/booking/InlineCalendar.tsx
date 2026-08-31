// fichier src/components/booking/InlineCalendar.tsx
"use client";
import { useEffect, useRef, useState } from "react";

import { getCalApi } from "@calcom/embed-react";
import { useCalEvents } from "@/hooks/useCalEvents";
import type { CalEventHandlers } from "@/types/cal";

import { siteClass } from "@/config/site";

interface InlineCalendarProps {
  calLink: string;
  layout?: "month_view" | "column_view" | "week_view";
  eventHandlers: CalEventHandlers;
  className?: string;
  loadingText?: string;
  errorText?: string;
  retryText?: string;
}

export function InlineCalendar({calLink, layout = "month_view", eventHandlers, className, loadingText = "Chargement des disponibilités...",
  errorText = "Impossible de charger le calendrier.", retryText = "Réessayer"}: InlineCalendarProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const isInitializedRef = useRef(false);
  //console.log("[InlineCalendar] Prop calLink reçue :", calLink);
  //console.log("InlineCalendar.tsx: className=", className);
  useCalEvents(eventHandlers);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Protection contre StrictMode : ne pas initialiser deux fois
    if (isInitializedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInitializedRef.current) {
          observer.disconnect();
          // Délai pour laisser le DOM se stabiliser après StrictMode
          setTimeout(() => {
            if (containerRef.current && document.body.contains(containerRef.current)) {
              isInitializedRef.current = true;
              loadCalendar();
            }
          }, 100);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [calLink, layout]);

  const loadCalendar = async () => {
    try {
      const cal = await getCalApi({ namespace: "default" });
      const element = containerRef.current;
      if (!element || !document.body.contains(element)) {
        console.warn("InlineCalendar.tsx: Container not in DOM, skipping initialization");
        return;
      }
      // MODIFICATION : Intégration de layout dans l'URL calLink
      // L'API Cal.com n'accepte pas 'layout' comme propriété directe de l'objet passé à cal("inline", {...}). 
      // Il doit être intégré dans l'URL calLink sous forme de paramètre de requête (?layout=month_view).
      // 
      // On vérifie si calLink contient déjà un '?' pour utiliser le bon séparateur :
      //   - Si '?' présent → on ajoute '&layout=xxx'
      //   - Si '?' absent → on ajoute '?layout=xxx'
      const calLinkWithLayout = calLink.includes("?") ? `${calLink}&layout=${layout}` : `${calLink}?layout=${layout}`;
      // Le script d'embed de Cal.com s'appuie sur ces attributs pour configurer 
      // l'iframe. Les définir manuellement garantit qu'il ne manque aucune information.
      element.setAttribute("data-cal-namespace", "default");
      element.setAttribute("data-cal-link", calLinkWithLayout);
      element.setAttribute("data-cal-config", JSON.stringify({ layout }));

      // Configuration de l'UI du calendrier
      cal("ui", {
        theme: "light", // Changez en "dark" si vous voulez forcer le mode sombre
        hideEventTypeDetails: false,
        layout: layout,
      });

      // Injection du calendrier inline dans le conteneur référencé
      cal("inline", {
        elementOrSelector: element,
        calLink: calLinkWithLayout,
      });

      setStatus("loaded");
    } catch (error) {
      console.error("Cal.com loading failed:", error);
      setStatus("error");
      isInitializedRef.current = false; // Permet de réessayer en cas d'échec
    }
  };

  return (
    <section className={siteClass.sectionClass}>
      <div className="min-h-[600px] w-full" ref={containerRef} role="application" aria-label="Calendrier de réservation">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" aria-hidden="true"/>
            <span className="text-sm">{loadingText}</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-red-600">{errorText}</p>
            <button onClick={() => {isInitializedRef.current = false; setStatus("loading"); loadCalendar();}}
              className="px-4 py-2 text-sm text-blue-600 underline hover:text-blue-800">{retryText}</button>
          </div>
        )}
      </div>
    </section>
  );
}