// fichier src/components/booking/EventSelector.tsx
//import { Sparkles, MessageSquare, Target, Calendar } from "lucide-react";
import type { CalEventConfig } from "@/types/cal";
import type { BookingTranslations } from "@/types/translations";

import { siteClass } from "@/config/site";

interface EventSelectorProps {
  events: CalEventConfig[];
  selectedEventId: string;
  onSelect: (eventId: string) => void;
  texts: BookingTranslations["events"];
}

// Mapping global des icônes disponibles
// Les icônes sont référencées par leur clé dans les fichiers JSON
/*const iconMap: Record<string, React.ElementType> = {
  Sparkles, MessageSquare, Target, Calendar };*/

function formatPrice(event: CalEventConfig, texts: BookingTranslations["events"]): string {
  if (event.price === 0) return texts.free;
  const symbol = event.currency === "EUR" ? "€" : event.currency;
  return `${event.price} ${symbol}`;
}

export function EventSelector({events, selectedEventId, onSelect, texts}: EventSelectorProps) {
  return (
    <section className={siteClass.sectionClass}>
      <div className="container-narrow">
        <h2 className="text-2xl font-bold mb-2">{texts.sectionTitle}</h2>
        <p className="text-muted-foreground mb-4">{texts.sectionSubtitle}</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const eventTexts = texts[event.translationKey as keyof typeof texts] as
              | { iconKey: string; title: string; description: string } | undefined;

            const isSelected = event.id === selectedEventId;
            const baseClasses = "text-left rounded-xl p-6 transition-all";
            const selectedClasses = "ring-2 ring-primary";
            const unselectedClasses = `${siteClass.border} ${siteClass.hoverBorder}`;
            return (
              <button
                key={event.id} onClick={() => onSelect(event.id)}
                className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start justify-between mb-4">
                    <span className={`
                    text-sm font-semibold px-3 py-1 rounded-full whitespace-pre-line
                    ${event.price === 0 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800" }
                    `}>{texts.beforePrice}{formatPrice(event, texts)}
                    </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {eventTexts?.title ?? event.id}
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  {eventTexts?.description ?? ""}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-black/10">
                  <span className="text-sm text-muted-foreground">
                    {event.duration} {texts.duration}
                  </span>
                  <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                    {isSelected ? texts.selected : texts.selectButton}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}