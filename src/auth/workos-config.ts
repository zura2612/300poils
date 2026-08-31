// fichier src/auth/workos-config.ts
const clientId = process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI;
const apiHostname = process.env.NEXT_PUBLIC_WORKOS_API_HOSTNAME;

if (!clientId) {
  throw new Error(
    "[WorkOS] La variable d'environnement NEXT_PUBLIC_WORKOS_CLIENT_ID n'est pas définie. " +
    "Vérifiez votre fichier .env.local"
  );
}

if (!redirectUri) {
  throw new Error(
    "[WorkOS] La variable d'environnement NEXT_PUBLIC_WORKOS_REDIRECT_URI n'est pas définie. " +
    "Vérifiez votre fichier .env.local"
  );
}

// apiHostname est optionnel selon la configuration WorkOS (production vs développement)
// Si vous êtes en développement local, vous pouvez commenter cette vérification
if (!apiHostname) {
  throw new Error(
    "[WorkOS] La variable d'environnement NEXT_PUBLIC_WORKOS_API_HOSTNAME n'est pas définie. " +
    "Vérifiez votre fichier .env.local"
  );
}

export const workosConfig = {
  clientId,           // Type: string (garanti par la validation ci-dessus)
  redirectUri,        // Type: string (garanti par la validation ci-dessus)
  ...(apiHostname && { apiHostname }), // Inclus uniquement si défini
};

// WorkOS gère la redirection automatiquement, mais on peut définir l'URL de base si besoin
//export const workosConfig = { clientId, redirectUri, apiHostname };