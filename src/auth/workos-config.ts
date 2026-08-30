// fichier src/auth/workos-config.ts
const clientId = process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID;
const redirectUri = process.env.WORKOS_REDIRECT_URI;
const apiHostname = process.env.WORKOS_API_HOSTNAME;

// WorkOS gère la redirection automatiquement, mais on peut définir l'URL de base si besoin
export const workosConfig = { clientId, redirectUri, apiHostname };