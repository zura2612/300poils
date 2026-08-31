// src/components/theme-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  labels?: { light: string; dark: string; };
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Évite les erreurs d'incompatibilité serveur/client (hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Si `labels` n'est pas fourni, on utilise les valeurs par défaut.
  // Cela garantit que le composant fonctionne même sans prop (rétrocompatibilité).
  const lightLabel = labels?.light ?? "Mode clair";
  const darkLabel = labels?.dark ?? "Mode sombre";

  /*if (!mounted) {
    return <div className="w-9 h-9" />; // Espace réservé pendant le chargement
  }*/
  if (!mounted) {
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Changer le thème"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
  }

const isDark = theme === "dark";

return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? lightLabel : darkLabel}
      title={isDark ? lightLabel : darkLabel}
      className="rounded-full p-2 hover:bg-muted transition-colors"
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}