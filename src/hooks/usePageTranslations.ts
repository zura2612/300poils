// fichier src/hooks/usePageTranslations.ts
"use client";
import { useState, useEffect } from 'react';

// Importation statique des fichiers français pour court-circuiter le réseau
import frHeader from "../../public/translations/header.fr.json";
import frFooter from "../../public/translations/footer.fr.json";
import frCtaBand from "../../public/translations/ctaBand.fr.json";
import frAbout from "../../public/translations/about.fr.json";
import frContact from "../../public/translations/contact.fr.json";
import frHome from "../../public/translations/home.fr.json";
import frRendezVous from "../../public/translations/rendez-vous.fr.json";
import frServices from "../../public/translations/services.fr.json";

const translationsCache: Record<string, Record<string, any>> = {
  header: { fr: frHeader },
  footer: { fr: frFooter },
  ctaBand: { fr: frCtaBand },
  about: { fr: frAbout },
  contact: { fr: frContact },
  home: { fr: frHome },
  "rendez-vous": { fr: frRendezVous }, // "" à cause du tiret
  services: { fr: frServices }
};

export function usePageTranslations<T>(page: string, lang: string = 'fr') {
  const cachedData = translationsCache[page]?.[lang];
  // Le state est initialisé avec les données de la langue actuelle (si disponibles)
  const [data, setData] = useState<T | null>((cachedData as T) || null);
  const [isLoading, setIsLoading] = useState(!cachedData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Si les données sont déjà en cache (ex: français au chargement initial), on sort immédiatement
        if (cachedData) {
          setData(cachedData as T); // ← AJOUT CRITIQUE : synchronise le state avec la langue actuelle
          setIsLoading(false);
          return;
        }

        // Sécurité pour le rendu serveur (SSR/SSG) : interception des appels fetch hors du navigateur
        if (typeof window === "undefined") return;

        const response = await fetch(`/translations/${page}.${lang}.json`);
        if (!response.ok) { 
          throw new Error(`usePageTranslations.ts: Failed to load translations for ${page} (${lang})`); 
        }
        
        const json = await response.json() as T;
        
        // Mise à jour du cache pour les futurs appels de ce composant
        if (!translationsCache[page]) { 
          translationsCache[page] = {}; 
        }
        translationsCache[page][lang] = json;
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [page, lang, cachedData]); // cachedData ajouté aux dépendances pour la stabilité du hook

  return { data, isLoading, error };
}

// Fonction pour pré-charger les traductions d'autres langues (ex: anglais) en arrière-plan
export function preloadAllTranslations() {
  const pages = ["header", "footer", "ctaBand", "about", "contact", "home", "rendez-vous", "services"];
  const languages = ["en"]; // Ajoutez d'autres codes langue si nécessaire

  // Sécurité indispensable pour éviter que le processus de build Node.js ne tente 
  // d'exécuter des fetch globaux, ce qui provoquerait une erreur au build.
  if (typeof window === "undefined") return;

  pages.forEach((page) => {
    if (!translationsCache[page]) { 
      translationsCache[page] = {}; 
    }
    
    languages.forEach((lang) => {
      // On ne précharge que si la langue n'est pas déjà en cache
      if (!translationsCache[page][lang]) {
        fetch(`/translations/${page}.${lang}.json`)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then((json) => { 
            translationsCache[page][lang] = json; 
          })
          .catch((err) => { 
            console.error(`usePageTranslations.ts: preload Echec au chargement de ${page}.${lang}.json:`, err); 
          });
      }
    });
  });
}