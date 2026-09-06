// src/components/LanguageSwitcher.tsx
import { useLanguage } from "@/contexts/LanguageContext";
import { siteClass } from "@/config/site";

export function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();
  // Définition dynamique du label selon la langue ciblée par le bouton
  const label = lang === "fr" ? "Switch to English" : "Passer en français";
    
  return (
    <button
      onClick={toggleLang}
      aria-label={label}
      title={label}
      // "pointer-events-auto" et "isolate" pour garantir la capture du survol
      className={`relative grid h-9 w-9 place-items-center rounded-full 
        transition pointer-events-auto isolate ${siteClass.hoverBackground}`}
    >
      {lang === "fr" ? ( <img src="/flags/en.svg" alt="English" className="h-7 w-7 pointer-events-none" /> ) :
        ( <img src="/flags/fr.svg" alt="Français" className="h-7 w-7 pointer-events-none" /> )
      }
    </button>
  );
}