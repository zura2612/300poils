import { UserCheck } from "lucide-react";

export default function Loading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-blue-600" />
            Administration des utilisateurs
          </h1>
          <div className="h-4 w-52 bg-gray-200 animate-pulse rounded mt-2" />
        </div>
      </div>

      {/* Bouton d'action Skeleton */}
      <div className="flex justify-end mb-4">
        <div className="h-9 w-44 bg-gray-200 animate-pulse rounded-xl" />
      </div>

      {/* Tableau Skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Rôle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-48 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between border border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm">
        <div className="h-4 w-36 bg-gray-200 animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>
    </main>
  );
}