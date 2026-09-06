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

  const response = await fetch(`${ADMIN_WORKER_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error( errorData.message || errorData.error || `Erreur API HTTP ${response.status}` );
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