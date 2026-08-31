// fichier src/hooks/useCalEvents.ts
import { useEffect, useRef } from "react";
import { getCalInstance } from "@/lib/cal";
import type { CalEventHandlers, CalEvent, CalBookingData } from "@/types/cal";

export function useCalEvents(handlers: CalEventHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const isSetupRef = useRef(false);

  // ==========================================================================
  // Callbacks stables extraits dans des refs
  // ==========================================================================
  // La même référence de fonction est utilisée dans cal("on") et cal("off"),
  // ce qui est obligatoire pour que le désabonnement fonctionne correctement.
  
  const bookingSuccessCallback = useRef((e: unknown) => {
    const event = e as { detail?: CalEvent };
    const data = event?.detail?.data;
    
    // ==========================================================================
    // MODIFICATION : Validation stricte de la structure CalBookingData
    // ==========================================================================
    // On vérifie que data contient bien toutes les propriétés requises par
    // le type CalBookingData défini dans cal.ts :
    //   - booking (objet CalBooking)
    //   - eventType (objet CalEventType)
    //   - date (string)
    //   - duration (number)
    //   - organizer (objet CalOrganizer)
    //   - confirmed (boolean)
    if (!data || !data.booking || !data.date || !data.organizer) {
      console.error("Invalid booking data received:", data);
      return;
    }
    
    // ✅ On passe directement data (type CalBookingData) au handler
    // Pas besoin de reconstruire un objet partiel
    handlersRef.current.onBookingSuccess?.(data);
  }).current;

  const bookingCancelCallback = useRef((e: unknown) => {
    const event = e as { detail?: CalEvent };
    const data = event?.detail?.data;
    if (data) {
      handlersRef.current.onBookingCancel?.(data);
    }
  }).current;

  // ==========================================================================
  // MODIFICATION : Action corrigée "rescheduleBookingSuccessfulV2"
  // ==========================================================================
  // L'API Cal.com n'a PAS d'action "rescheduleBooking".
  // Les noms valides sont :
  //   - "rescheduleBookingSuccessful" (legacy)
  //   - "rescheduleBookingSuccessfulV2" (recommandé)
  const rescheduleCallback = useRef((e: unknown) => {
    const event = e as { detail?: CalEvent };
    const data = event?.detail?.data;
    if (data) {
      handlersRef.current.onReschedule?.(data);
    }
  }).current;

  useEffect(() => {
    if (isSetupRef.current) return;
    let isMounted = true;
    let cal: Awaited<ReturnType<typeof getCalInstance>> | null = null;

    const setup = async () => {
      try {
        cal = await getCalInstance();
        if (!isMounted) return;
        isSetupRef.current = true;

        cal("on", {
          action: "bookingSuccessful",
          callback: bookingSuccessCallback,
        });

        cal("on", {
          action: "bookingCancelled",
          callback: bookingCancelCallback,
        });

        cal("on", {
          action: "rescheduleBookingSuccessfulV2",
          callback: rescheduleCallback,
        });
      } catch (error) {
        console.error("Failed to setup Cal events:", error);
      }
    };

    setup();

    return () => {
      isMounted = false;
      // on nettoie seulement si le setup a été fait
      if (cal && isSetupRef.current) {
        cal("off", {
          action: "bookingSuccessful",
          callback: bookingSuccessCallback,
        });
        cal("off", {
          action: "bookingCancelled",
          callback: bookingCancelCallback,
        });
        cal("off", {
          action: "rescheduleBookingSuccessfulV2",
          callback: rescheduleCallback,
        });
      }
    };
  }, [bookingSuccessCallback, bookingCancelCallback, rescheduleCallback]);
}