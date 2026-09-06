// fichier src/app/admin/statistiques/page.tsx
import { withAuth } from "@workos-inc/authkit-nextjs";
import { ShieldAlert, BarChart3, Users, UserCheck, UserX, Activity, CalendarDays, TrendingUp } from "lucide-react";
import { siteClass } from "@/config/site";

const vignetteStyle = `flex flex-col items-starts p-6  mb-4 ${siteClass.text} ${siteClass.border} rounded-xl shadow-sm`;

interface StatsData {
  totalUsers: number;
  activeSessions: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  recentSignUps: { last24h: number; last7d: number; last30d: number; };
}

function getNouveauLabel(count: number | string): string {
  if (typeof count === "number") {
    return count <= 1 ? "nouveau" : "nouveaux";
  }
  return "nouveaux";
}

export default async function AdminStatistiquesPage() {
  // 1. Récupération du jeton d'accès côté serveur
  const { user, accessToken } = await withAuth();
  if (!accessToken) {
    return (
      <div className="p-4 text-center text-destructive">
        Session expirée ou non autorisée. Veuillez vous reconnecter.
      </div>
    );
  }
  const workerUrl = process.env.ADMIN_WORKER_URL || process.env.NEXT_PUBLIC_ADMIN_WORKER_URL;
  if (!workerUrl) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 flex items-center gap-3">
          <ShieldAlert className="h-7 w-7 text-red-600" />
          <span>Configuration incomplète : URL de l'API admin manquante.</span>
        </div>
      </main>
    );
  }

  let stats: StatsData | null = null;
  let fetchError: string | null = null;

  // 2. Fetch synchrone avant le rendu HTML
  try {
    const response = await fetch(`${workerUrl}/api/stats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const result = await response.json();
    stats = result.data || result;
  } catch (err: any) {
    console.error("admin/statistiques/page.tsx: Erreur chargement statistiques serveur:", err);
    fetchError = "Impossible de charger les données statistiques.";
  }

  // Extractions sécurisées
  const totalUsers = stats?.totalUsers ?? "inconnu";
  const activeUsers24h = stats?.activeSessions ?? "inconnu";
  const verifiedUsers = stats?.verifiedUsers ?? "inconnu";
  const unverifiedUsers = stats?.unverifiedUsers ?? "inconnu";
  
  const signUps24h = stats?.recentSignUps?.last24h ?? "inconnu";
  const signUps7d = stats?.recentSignUps?.last7d ?? "inconnu";
  const signUps30d = stats?.recentSignUps?.last30d ?? "inconnu";

  return (
    <main className="w-full">
      {/* En-tête */}
      <section className={siteClass.sectionClass}>
      <div className={`flex items-center justify-between mb-4 ${siteClass.border_bas} pb-5`}>
        <div>
          <h1 className={`flex gap-2 text-2xl items-center ${siteClass.text} font-bold`}>
            <BarChart3 className="h-7 w-7 text-blue-600" />
            Statistiques de l'application
          </h1>
          <p className="mt-1">Vue d'ensemble de l'activité globale du système</p>
        </div>
      </div>

      {/* Contenu principal */}
      {fetchError ? (
        <div className="bg-red-50 border border-red-800 rounded-xl p-4 text-red-800 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          <span>{fetchError}</span>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          {/* Indicateurs principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* total utilisateurs */}
            <div className={vignetteStyle}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="h-6 w-6" /></div>
                <p className="text-xs font-medium uppercase tracking-wider">Total Utilisateurs :</p>
                <p className="text-2xl font-bold mt-1">{totalUsers}</p>
              </div>
            </div>

            {/* actifs */}
            <div className={vignetteStyle}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Activity className="h-6 w-6" /></div>
                <p className="text-xs font-medium uppercase tracking-wider">Actifs (24h) :</p>
                <p className="text-2xl font-bold mt-1">{activeUsers24h}</p> 
              </div>
            </div>
          </div>

          {/* Évolution des inscriptions */}
          <div>
            <h2 className={`flex items-center gap-2 mb-4 ${siteClass.text} font-semibold uppercase tracking-wider`}>
              <TrendingUp className="h-4 w-4" />
              Évolution des inscriptions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* dernières 24 heures */}
              <div className={vignetteStyle}>
                <p className="font-medium">Dernières 24 heures</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold">{signUps24h}</span>
                  <span>{getNouveauLabel(signUps24h)}</span>
                </div>
              </div>
              {/* derniers 7 jours */}
              <div className={vignetteStyle}>
                <p className="font-medium">Derniers 7 jours</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold">{signUps7d}</span>
                  <span>{getNouveauLabel(signUps7d)}</span>
                </div>
              </div>
              {/* derniers 30 jours */}
              <div className={vignetteStyle}>
                <p className="font-medium">Derniers 30 jours</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold">{signUps30d}</span>
                  <span>{getNouveauLabel(signUps30d)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vérifications des comptes */}
          <div>
            <h2 className={`flex items-center gap-2 mb-4 ${siteClass.text} font-semibold uppercase tracking-wider`}>
              <CalendarDays className="h-4 w-4" />
              Vérification des comptes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* e-mails vérifiés */}
              <div className={vignetteStyle}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><UserCheck className="h-5 w-5" /></div>
                  <p className="font-bold">Comptes e-mails vérifiés :</p>
                  <p className="text-xl font-bold">{verifiedUsers}</p>
                </div>
               </div>
              
              {/* e-mails non vérifiés */}
              <div className={vignetteStyle}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><UserX className="h-5 w-5" /></div>
                  <p className="font-bold">Comptes non vérifiés :</p>
                  <p className="text-xl font-bold">{unverifiedUsers}</p>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      ) : (
        <p className="text-gray-400 text-center italic py-10">Aucune donnée disponible.</p>
      )}
    </section>
    </main>
  );
}