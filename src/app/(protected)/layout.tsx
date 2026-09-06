// fichier src/app/(protected)/layout.tsx
"use client";

//import { useAuth } from "@workos-inc/authkit-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

// ==============================================================================
// MODIFICATION 1 : Layout de protection remplaçant _protected.tsx de TanStack
// ==============================================================================
// Dans Next.js, il n'existe pas de "beforeLoad" comme dans TanStack Router.
// Deux approches possibles :
//   1. Middleware (sécurité serveur, recommandé pour les données sensibles)
//   2. Layout client (plus simple, utilise le SDK WorkOS côté navigateur)
// Nous choisissons l'approche 2 car WorkOS AuthKit est un SDK client-side.

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // ==============================================================================
  // MODIFICATION 2 : Redirection côté client quand l'utilisateur n'est pas connecté
  // ==============================================================================
  // Équivalent du "throw redirect({ to: '/' })" de TanStack Router.
  // Le useEffect garantit que la redirection ne se produit qu'après l'hydratation.
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/?auth_required=true");
    }
  }, [isLoading, user, router]);

  // ==============================================================================
  // MODIFICATION 3 : États de chargement et d'erreur
  // ==============================================================================
  if (isLoading) {
    return (
      <main className="w-full">
        <p className="text-center py-20 animate-pulse" aria-live="polite">
          Vérification de l'authentification...
        </p>
      </main>
    );
  }

  if (!user) {
    // Sécurité : afficher un placeholder pendant la redirection
    return null;
  }

  // ==============================================================================
  // MODIFICATION 4 : Rendu des enfants uniquement si authentifié
  // ==============================================================================
  return <>{children}</>;
}