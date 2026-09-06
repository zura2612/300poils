// fichier src/components/LogToggle.tsx
"use client";

import { useState, useRef, useEffect } from "react";
//import { useAuth } from "@workos-inc/authkit-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { LogIn, LogOut, Loader2, ChevronDown, Shield, BarChart3 } from "lucide-react";
import { clearLastSelectedEvent } from "@/lib/last-event";
import { useAdminUser } from "@/hooks/useAdminUser";
import { siteClass } from "@/config/site";

interface LogToggleProps {
  labels: { login: string; logout: string; loading: string;
    logoutSuccess?: string; // optionnel
    connected?: string;     // optionnel
  };
}

const boutonConnectedStyle = "rounded-xl px-4 py-2 font-semibold text-center tracking-wider transition hover:opacity-80";

export function LogToggle({ labels }: LogToggleProps) {
  const { user, isLoading, signIn, signOut } = useAuth();
  const { adminUser, isLoading: isAdminLoading, isAdmin } = useAdminUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) { setIsMenuOpen(false); }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => { signIn(); };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsMenuOpen(false);
    clearLastSelectedEvent();
    
    try {
      await signOut();
      toast.success(labels.logoutSuccess, { duration: 4000 });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion", { duration: 4000 });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // État de chargement
  if (isLoading || isLoggingOut || isAdminLoading) {
    return (
      <button disabled className="rounded-xl px-4 py-2 font-semibold opacity-50 cursor-not-allowed flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{labels.loading}</span>
      </button>
    );
  }

  // ✅ UTILISATEUR CONNECTÉ
  if (user) {
    const displayName = user.firstName || labels.connected;
    return (
      <div className="relative" ref={menuRef}>
        <Toaster position="top-right" duration={4000} />
        
        {/* Bouton principal */}
        <button  onClick={() => setIsMenuOpen(!isMenuOpen)} className={boutonConnectedStyle} aria-expanded={isMenuOpen} aria-haspopup="true">
          <span>{displayName}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Menu déroulant */}
        {isMenuOpen && (
          <div className={`absolute right-0 mt-4 w-60 ${siteClass.text} ${siteClass.border} rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}>
            
            {/* ✅ Menu Administrer scindé en deux si isAdmin */}
            {isAdmin && (
              <>
                <div className="px-4 py-2 font-semibold uppercase tracking-wider">
                  {labels.titre}
                </div>
                
                {/* Lien vers la gestion des utilisateurs */}
                <Link
                  href="/admin/utilisateurs" onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 transition-colors border border-transparent ${siteClass.hoverBorder}`}
                >
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>{labels.item1}</span>
                </Link>

                {/* Lien vers la page des statistiques */}
                <Link
                  href="/admin/statistiques" onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 transition-colors border border-transparent ${siteClass.hoverBorder}`}
                >
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span>{labels.item2}</span>
                </Link>
              </>
            )}

            {/* Item Se déconnecter */}
            <button onClick={handleLogout} className={`w-full flex px-4 py-2 gap-3 items-center text-red-600 transition-colors border border-transparent ${siteClass.hoverBorder}`}>
              <LogOut className="h-4 w-4" />
              <span>{labels.logout}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ✅ UTILISATEUR NON CONNECTÉ
  return (
    <>
      <Toaster position="top-right" duration={4000} />
      <button onClick={handleLogin} className="flex px-4 py-2 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors
        items-center gap-2" aria-label={labels.login}>
        <LogIn className="h-4 w-4" />
        <span>{labels.login}</span>
      </button>
    </>
  );
}