// src/app/admin/layout.tsx
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

// Utilisation du slug technique fixe au lieu du nom d'affichage du rôle
const ADMIN_SLUG = "admin";

export default async function AdminLayout({ children }: { children: React.ReactNode; }) {
  // 1. Récupération de la session WorkOS et du jeton d'accès côté serveur
  const { user, accessToken } = await withAuth();

  // Si l'utilisateur n'est pas connecté
  if (!user || !accessToken) { redirect("/"); }

  // 2. Récupération de l'URL du Worker Cloudflare
  const workerUrl =  process.env.ADMIN_WORKER_URL || process.env.NEXT_PUBLIC_ADMIN_WORKER_URL;

  if (!workerUrl) {
    console.error("app/admin/layout.tsx : URL du worker admin non définie.");
    redirect("/");
  }

  // 3. Appel au Worker Cloudflare depuis le serveur Next.js
  try {
    const response = await fetch(`${workerUrl}/api/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // Pas de mise en cache pour toujours vérifier le statut en temps réel
      cache: "no-store",
    });

    if (!response.ok) { redirect("/"); }

    const result = await response.json();
    const adminUser = result?.data;

    // 4. Vérification basée sur le slug technique du rôle
    const isAdmin = adminUser?.metadata?.slug === ADMIN_SLUG;
    if (!isAdmin) { redirect("/"); }
  } catch (error) {
    console.error("app/admin/layout.tsx : Erreur lors de la vérification admin :", error);
    redirect("/");
  }

  // L'utilisateur est authentifié ET administrateur
  return children;
}