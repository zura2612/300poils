// components/ui/theme-provider.tsx
"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Rend les enfants sans le provider lors du SSR/premier rendu
  if (!mounted) {
    return <>{children}</>;
  }
  return (<NextThemesProvider enableSystem={false} {...props}>{children}</NextThemesProvider>);
}