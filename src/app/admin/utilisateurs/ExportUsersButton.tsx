'use client';

import { useState } from 'react';
//import { useAuth } from '@workos-inc/authkit-react';
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ExportUsersButtonProps {
  disabled?: boolean;
  workerUrl?: string;
}

export function ExportUsersButton({ disabled, workerUrl }: ExportUsersButtonProps) {
  const { getAccessToken } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const token = await getAccessToken();
      const response = await fetch(`${workerUrl}/api/users/export`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Exportation réussie !");
    } catch (err) {
      toast.error("Échec de l'exportation.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || disabled}
      className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-colors"
    >
      {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      <span>Exporter la liste (.csv)</span>
    </button>
  );
}