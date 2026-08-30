// src/lib/logger.ts

/**
 * Génère un log console avec un horodatage au format français.
 * @param message Le message principal à afficher.
 * @param args Données supplémentaires à afficher (objets, variables, etc.).
 */
export const logWithTimestamp = (message: string, ...args: any[]): void => {
  const timestamp = new Date().toLocaleString('fr-FR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  console.log(`[${timestamp}] ${message}`, ...args);
};

// Variante pour les erreurs (affiche en rouge dans la plupart des terminaux/navigateurs)
export const errorWithTimestamp = (message: string, ...args: any[]): void => {
  const timestamp = new Date().toLocaleString('fr-FR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  console.error(`[❌] ${timestamp}] ${message}`, ...args);
};

// Variante pour les warning (affiche en jaune dans la plupart des terminaux/navigateurs)
export const warnWithTimestamp = (message: string, ...args: any[]): void => {
  const timestamp = new Date().toLocaleString('fr-FR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  console.warn(`[!] ${timestamp}] ${message}`, ...args);
};