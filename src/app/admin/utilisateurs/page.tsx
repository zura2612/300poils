// fichier src/app/admin/utilisateurs/page.tsx
import Link from "next/link";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { ShieldAlert, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { ExportUsersButton } from "./ExportUsersButton";
import { siteClass } from "@/config/site";

const vignetteStyle = `mb-6 ${siteClass.text} ${siteClass.border} rounded-xl shadow-sm`;
const boutonStyle = `inline-flex items-center gap-1 px-3 py-2 font-medium ${siteClass.text} ${siteClass.border} rounded-xl`; 
//const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE = 2;

interface UserData {
  id: string; email: string;
  firstName: string; lastName: string;
  metadata?: { role?: string }; createdAt: string;
}

interface PaginationMeta {
  before: string | null; after: string | null;
  hasBefore: boolean; hasMore: boolean;
}

interface PageProps { searchParams: Promise<{ after?: string; before?: string;}>; }

export default async function AdminUsersPage({ searchParams }: PageProps) {
  // 1. Récupération des paramètres d'URL et de l'utilisateur WorkOS
  const { after, before } = await searchParams;
  const { user, accessToken } = await withAuth();
  console.log("[AdminUsersPage] user.id=", user?.id);
  //console.log("(AdminUsersPage] accessToken=", accessToken?.substring(0,10)+"...");
  const workerUrl = process.env.ADMIN_WORKER_URL || process.env.NEXT_PUBLIC_ADMIN_WORKER_URL;
  //console.log("AdminUsersPage workerUrl=", workerUrl);

  if (!workerUrl) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <span>Configuration incomplète : URL de l'API admin manquante.</span>
        </div>
      </main>
    );
  }

  let usersList: UserData[] = [];
  let pagination: PaginationMeta = { before: null, after: null, hasBefore: false, hasMore: false, };
  let fetchError: string | null = null;

  // 2. Requête API côté serveur avec curseurs dans l'URL
  try {
    let url = `${workerUrl}/api/users?limit=${DEFAULT_PAGE_SIZE}`;
    if (after) {
      url += `&after=${encodeURIComponent(after)}`;
    } else if (before) {
      url += `&before=${encodeURIComponent(before)}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Inconnu" }));
      //console.error("❌ Erreur retournée par admin-worker:", errorData);
      throw new Error(`Erreur serveur: ${response.status} (${errorData.error})`);
    }

    const result = await response.json();
    usersList = result.data || [];
    if (result.pagination) {
      pagination = result.pagination;
    }
  } catch (err: any) {
    console.error("admin/utilisateurs/page.tsx: Erreur lors du chargement des utilisateurs:", err);
    fetchError = "Impossible de charger la liste des utilisateurs.";
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* En-tête */}
      <div className={`flex items-center justify-between mb-6 ${siteClass.border_bas} pb-5`}>
        <div>
          <h1 className={`flex gap-2 text-xl items-center ${siteClass.text} font-bold`}>
            <UserCheck className="h-6 w-6 text-blue-600" />
            Administration des utilisateurs
          </h1>
          <p className="mt-1">
            Connecté en tant que <strong className="text-blue-700">{user?.email}</strong>
          </p>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex justify-end mb-6">
        <ExportUsersButton disabled={usersList.length === 0} workerUrl={workerUrl} />
      </div>

      {/* Contenu principal */}
      {fetchError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <span>{fetchError}</span>
        </div>
      ) : (
        <>
          {/* Tableau des utilisateurs */}
          <div className={`${vignetteStyle} overflow-hidden`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${siteClass.border_bas} font-semibold uppercase tracking-wider`}>
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black dark:divide-white">
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center italic">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{u.firstName} {u.lastName}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {u.metadata?.slug || "inconnu"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination basée sur l'URL */}
          <div className={`flex items-center ${vignetteStyle} justify-between py-3 px-4 sm:px-6`}>
            <div className="">
              Affichage de <span className="font-medium">{usersList.length}</span> utilisateur(s)
            </div>
            <div className="flex gap-2">
              {pagination.hasBefore && pagination.before ? (
                <Link
                  href={`/admin/utilisateurs?before=${pagination.before}`}
                  className={`${boutonStyle} ${siteClass.hoverBorder} transition-colors`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Link>
              ) : (
                <button
                  disabled
                  className={`${boutonStyle} opacity-60 cursor-not-allowed`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </button>
              )}

              {pagination.hasMore && pagination.after ? (
                <Link
                  href={`/admin/utilisateurs?after=${pagination.after}`}
                  className={`${boutonStyle} ${siteClass.hoverBorder} transition-colors`}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className={`${boutonStyle} opacity-60 cursor-not-allowed`}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}