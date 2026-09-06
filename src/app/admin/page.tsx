// src/app/admin/page.tsx
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function AdminPage() {
  // Récupération de l'utilisateur connecté via avec withAuth()
  const { user } = await withAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Administration</h1>
      <p>Bienvenue, {user?.firstName ?? user?.email ?? "Administrateur"} !</p>
    </div>
  );
}