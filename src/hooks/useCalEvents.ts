// src/hooks/useCalEvents.ts
import { useEffect, useRef } from "react";
import { getCalInstance } from "@/lib/cal";
import type { CalEventHandlers, CalEvent } from "@/types/cal";

export function useCalEvents(handlers: CalEventHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const isSetupRef = useRef(false);

  useEffect(() => {
    if (isSetupRef.current) return;
    let isMounted = true;
    let cal: Awaited<ReturnType<typeof getCalInstance>> | null = null;

    // 1. On extrait les callbacks dans des variables pour conserver leur référence mémoire
    const handleBookingSuccessful = (e: unknown) => {
      const event = e as { detail?: CalEvent };
      const data = event?.detail?.data;
      if (!data || !data.date) {
        console.error("Invalid booking data received:", data);
        return;
      }
      handlersRef.current.onBookingSuccess?.(data);
    };

    const handleBookingCancelled = (e: unknown) => {
      const event = e as { detail?: CalEvent };
      const data = event?.detail?.data;
      if (data) {
        handlersRef.current.onBookingCancel?.(data);
      }
    };

    const handleRescheduleSuccessful = (e: unknown) => {
      const event = e as { detail?: CalEvent };
      const data = event?.detail?.data;
      if (data) {
        handlersRef.current.onReschedule?.(data);
      }
    };

    const setup = async () => {
      try {
        cal = await getCalInstance();
        if (!isMounted) return;

        isSetupRef.current = true;

        /*cal("on", {
          action: "bookingSuccessful",
          callback: (e: unknown) => {
            const event = e as { detail?: CalEvent };
            const data = event?.detail?.data;
            if (!data || !data.date) {
              console.error("Invalid booking data received:", data);
              return;
            }
            handlersRef.current.onBookingSuccess?.(data);
          }
        });
        cal("on", {
          action: "bookingCancelled",
          callback: (e: unknown) => {
            const event = e as { detail?: CalEvent };
            const data = event?.detail?.data;
            if (data) {
              handlersRef.current.onBookingCancel?.(data);
            }
          }
        });
        cal("on", {
          action: "rescheduleBookingSuccessful",
          callback: (e: unknown) => {
            const event = e as { detail?: CalEvent };
            const data = event?.detail?.data;
            if (data) {
              handlersRef.current.onReschedule?.(data);
            }
          }
        });*/
      // 2. Inscription avec les références de fonctions
        cal("on", { action: "bookingSuccessful", callback: handleBookingSuccessful as any });
        cal("on", { action: "bookingCancelled", callback: handleBookingCancelled as any });
        cal("on", { action: "rescheduleBookingSuccessful", callback: handleRescheduleSuccessful as any });
      } catch (error) {
        console.error("Failed to setup Cal events:", error);
      }
    };

    setup();

    return () => {
      isMounted = false;

      // MODIFICATION : Nettoyer les listeners après une initialisation réussie.
      // L'ancienne condition les conservait quand isSetupRef.current valait true,
      // ce qui pouvait déclencher plusieurs callbacks après un remontage.
      // 3. Désinscription propre en fournissant la même référence de callback à cal("off")
      if (cal) {
        /*cal("off", { action: "bookingSuccessful" });
        cal("off", { action: "bookingCancelled" });
        cal("off", { action: "rescheduleBooking" });*/
        cal("off", { action: "bookingSuccessful", callback: handleBookingSuccessful as any });
        cal("off", { action: "bookingCancelled", callback: handleBookingCancelled as any });
        cal("off", { action: "rescheduleBookingSuccessful", callback: handleRescheduleSuccessful as any });
      }
      // MODIFICATION : Réarmer le garde-fou pour permettre une nouvelle inscription.
      isSetupRef.current = false;
    };
  }, []);
}