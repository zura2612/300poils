// fichier src/components/WorkOSWrapper.tsx
"use client";

import { AuthKitProvider } from '@workos-inc/authkit-react';
import { workosConfig } from '../auth/workos-config';
import type { ReactNode } from "react";

export function WorkOSWrapper({ children }: { children: ReactNode }) {
 if (!workosConfig.clientId || !workosConfig.redirectUri) {
    console.error(
      "[WorkOSWrapper] Configuration WorkOS incomplète. " +
      "Vérifiez les variables NEXT_PUBLIC_WORKOS_CLIENT_ID et NEXT_WORKOS_REDIRECT_URI"
    );
    return (
      <div className="p-4 text-center text-destructive">
        Configuration d'authentification manquante. Contactez l'administrateur.
      </div>
    );
  }

  return (
    <AuthKitProvider {...workosConfig}>
      {children}
    </AuthKitProvider>
  );
}