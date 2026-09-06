// fichier src/hooks/useAdminUser.ts
import { useState, useEffect } from 'react';
//import { useAuth } from '@workos-inc/authkit-react';
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUser } from '@/lib/admin-api';

// Custom metadata dans workos.com pour l'utilisateur administrateur francois.vauchot@gmail.com
const ADMIN_SLUG = 'admin';
// ajout de export pour utilisation dans admin-api.ts
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  metadata: {
    role?: string;
    slug?: string;
    [key: string]: any;
  };
  createdAt: string;
  lastSignInAt: string | null;
}

export function useAdminUser() {
  const { user, accessToken, getAccessToken, isLoading: isAuthLoading } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || isAuthLoading) { setIsLoading(false); setAdminUser(null); return; }

    async function loadAdminUser() {
      // Évite l'appel API et le log d'erreur inutile si la variable est absente
      if (!process.env.NEXT_PUBLIC_ADMIN_WORKER_URL) {
        setError("NEXT_PUBLIC_ADMIN_WORKER_URL non définie");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await getCurrentUser(getAccessToken);
        setAdminUser(response.data);
        setError(null);
      } catch (err) {
        console.error('hooks/useAdminUser.ts/loadAdminUser: Erreur chargement admin user:', err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadAdminUser();
    }, [user, isAuthLoading, accessToken]);

  // pour un projet donné metadata.role = name et metadata.slug = slug du rôle défini dans Authorization/Roles
  const isAdmin = adminUser?.metadata?.slug === ADMIN_SLUG;
//console.log("hooks/useAdminUser.ts adminUser.metadata.role=", adminUser.metadata.role);
//console.log("hooks/useAdminUser.ts adminUser.metadata.slug=", adminUser.metadata.slug);

  return { adminUser, isLoading: isAuthLoading || isLoading, error, isAdmin };
}