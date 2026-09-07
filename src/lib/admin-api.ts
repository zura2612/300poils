// src/lib/admin-api.ts
import type { AdminUser } from "@/hooks/useAdminUser";

const ADMIN_WORKER_URL =
  process.env.ADMIN_WORKER_URL ||
  process.env.NEXT_PUBLIC_ADMIN_WORKER_URL ||
  "";

export interface PaginationMeta {
  before: string | null;
  after: string | null;
  hasBefore: boolean;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
  error?: string;
}

/* Utilitaire centralisé pour effectuer des appels sécurisés à l'API Cloudflare Worker */
async function callAdminApi<T>(
  endpoint: string,
  getAccessToken: () => Promise<string | undefined>,
  options: RequestInit = {}
  ): Promise<T> {
  if (!ADMIN_WORKER_URL) {
    throw new Error( "Configuration manquante : ADMIN_WORKER_URL ou NEXT_PUBLIC_ADMIN_WORKER_URL n'est pas définie." );
  }

  const token = await getAccessToken();
  if (!token) { throw new Error("Jeton d'accès non disponible ou session expirée."); }

  let response: Response;
  try {
    response = await fetch(`${ADMIN_WORKER_URL}${endpoint}`, {
    ...options,
  /*const response = await fetch(`${ADMIN_WORKER_URL}${endpoint}`, {
    ...options,*/
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    });
  } catch (networkError) {
    console.error("admin-api.ts/callAdminApi Erreur réseau / CORS lors du fetch :", networkError);
    throw new Error(
    `Impossible de joindre le Worker Admin (${ADMIN_WORKER_URL}). Vérifiez CORS ou l'URL.`
    );
  }

   if (!response.ok) {
    const rawText = await response.text();
    let errorData: any = {};
    try { errorData = JSON.parse(rawText); } catch { errorData = { error: rawText }; }
    // Affiche la clé "details" si le Worker la renvoie
    const errorMessage = errorData.details  ? `callAdminApi: ${errorData.error} (${errorData.details})`
      : errorData.message || errorData.error || `callAdminApi: Erreur HTTP ${response.status}`;
    throw new Error(errorMessage);
    /*const errorData = await response.json().catch(() => ({}));
    throw new Error( errorData.message || errorData.error || `Erreur HTTP ${response.status}` );*/
  }
  return response.json();
}

/* Récupère le profil de l'utilisateur connecté via le Worker Admin (/api/me) */
export async function getCurrentUser(
  getAccessToken: () => Promise<string | undefined>
  ): Promise<ApiResponse<AdminUser>> {
  return callAdminApi<ApiResponse<AdminUser>>("/api/me", getAccessToken);
}

/* Récupère la liste paginée des utilisateurs */
export async function getUsers(
  getAccessToken: () => Promise<string | undefined>,
  params?: { limit?: number; after?: string; before?: string }
  ): Promise<ApiResponse<AdminUser[]>> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.after) queryParams.set("after", params.after);
  if (params?.before) queryParams.set("before", params.before);

  const queryString = queryParams.toString();
  const endpoint = `/api/users${queryString ? `?${queryString}` : ""}`;

  return callAdminApi<ApiResponse<AdminUser[]>>(endpoint, getAccessToken);
}
