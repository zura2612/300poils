// fichier src/routes/admin.statistiques.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '@workos-inc/authkit-react';
import { useAdminUser } from '@/hooks/useAdminUser';
import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert, BarChart3, Users, UserCheck, UserX, Activity, CalendarDays, TrendingUp } from 'lucide-react';

// Déclaration de la constante globale pour l'API
const BASE_URL = process.env.ADMIN_WORKER_URL;

// 🟢 MODIFICATION : Ajout du garde d'accès beforeLoad sur la route
export const Route = createFileRoute('/admin/statistiques')({
  beforeLoad: ({ context }) => {
    // 1. Si WorkOS est en train de charger la session, on attend
    if (context.auth.isLoading) return;

    // 2. Si non authentifié -> Redirection à la racine
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: AdminStatsPage,
});

// Interface calquée exactement sur la structure renvoyée par ton Worker
interface StatsData {
  totalUsers: number;
  activeSessions: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  recentSignUps: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}

// 🟢 Fonction d'accord grammatical en français (0 ou 1 -> nouveau, > 1 -> nouveaux)
function getNouveauLabel(count: number | string): string {
  if (typeof count === 'number') {
    return count <= 1 ? 'nouveau' : 'nouveaux';
  }
  return 'nouveaux';
}

function AdminStatsPage() {
  const { user, isLoading, getAccessToken } = useAuth();
  const { adminUser, isAdmin, isLoading: isAdminLoading } = useAdminUser();
  
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ========================================================
  // RECOVERY OF STATS
  // ========================================================
  useEffect(() => {
    async function fetchStats() {
      setIsFetching(true);
      setFetchError(null);
      try {
        const token = await getAccessToken();
        
        const response = await fetch(`${BASE_URL}/api/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`admin.statistiques.tsx: Erreur serveur: ${response.status}`);
        }

        const result = await response.json();
        setStats(result.data || result);
      } catch (err: any) {
        console.error("admin.statistiques.tsx: Erreur lors de la récupération des statistiques:", err);
        setFetchError("admin.statistiques.tsx: Impossible de charger les données statistiques.");
      } finally {
        setIsFetching(false);
      }
    }

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin, getAccessToken]);

  if (isLoading || isAdminLoading || adminUser === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 text-sm">Vérification de vos droits d'accès...</p>
      </div>
    );
  }

  // 🔴 REMARQUE : La vérification redirect() dans le corps du composant est désormais
  // sécurisée en amont par `beforeLoad`. En cas de non-droit d'admin applicatif :
  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <ShieldAlert className="h-8 w-8 text-red-600" />
        <p className="text-gray-700 text-sm font-semibold">Accès non autorisé.</p>
      </div>
    );
  }

  // Extraction basée sur les clés validées
  const totalUsers = stats?.totalUsers ?? 'inconnu';
  const activeUsers24h = stats?.activeSessions ?? 'inconnu';
  const verifiedUsers = stats?.verifiedUsers ?? 'inconnu';
  const unverifiedUsers = stats?.unverifiedUsers ?? 'inconnu';
  
  // ✅ Exploitation complète de recentSignUps
  const signUps24h = stats?.recentSignUps?.last24h ?? 'inconnu';
  const signUps7d = stats?.recentSignUps?.last7d ?? 'inconnu';
  const signUps30d = stats?.recentSignUps?.last30d ?? 'inconnu';

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Statistiques de l'application
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Vue d'ensemble de l'activité globale du système
          </p>
        </div>
      </div>

      {/* Contenu Principal */}
      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-500 text-sm">Calcul des statistiques en cours...</p>
        </div>
      ) : fetchError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <span>{fetchError}</span>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          {/* Grille des indicateurs globaux principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalUsers}</p>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Actifs (24h)</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{activeUsers24h}</p>
              </div>
            </div>
          </div>

          {/* ÉVOLUTION DES INSCRIPTIONS */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              Évolution des inscriptions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500 font-medium">Dernières 24 heures</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-gray-900">{signUps24h}</span>
                  <span className="text-xs text-gray-400">{getNouveauLabel(signUps24h)}</span>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500 font-medium">Derniers 7 jours</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-gray-900">{signUps7d}</span>
                  <span className="text-xs text-gray-400">{getNouveauLabel(signUps7d)}</span>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500 font-medium">Derniers 30 jours</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-gray-900">{signUps30d}</span>
                  <span className="text-xs text-gray-400">{getNouveauLabel(signUps30d)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STATUTS DES COMPTES */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              Vérification des comptes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comptes e-mails vérifiés</p>
                  <p className="text-xl font-bold text-gray-900">{verifiedUsers}</p>
                </div>
              </div>

              <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                  <UserX className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comptes non vérifiés</p>
                  <p className="text-xl font-bold text-gray-900">{unverifiedUsers}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <p className="text-gray-400 text-center italic py-10">Aucune donnée disponible.</p>
      )}
    </main>
  );
}