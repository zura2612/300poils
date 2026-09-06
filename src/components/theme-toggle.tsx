// src/components/theme-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { siteClass } from "@/config/site";

interface ThemeToggleProps { labels?: { light: string; dark: string; }; }

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
  if (!mounted) {
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`p-2 rounded-lg ${siteClass.hoverBackground} transition-colors`}
      aria-label="Changer le thème"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
  }

const isDark = theme === "dark";
/*className={`p-2 rounded-full ${siteClass.hoverBackground} transition-colors`}*/
return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? lightLabel : darkLabel}
      title={isDark ? lightLabel : darkLabel}
      className={`relative grid h-9 w-9 place-items-center rounded-full 
        transition pointer-events-auto isolate ${siteClass.hoverBackground}`}
     >
      {isDark ? (
        <Sun className="h-7 w-7" aria-hidden="true" />
      ) : (
        <Moon className="h-7 w-7" aria-hidden="true" />
      )}
    </button>
  );
}