// fichier src/components/providers.tsx
"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { WorkOSWrapper } from "@/components/WorkOSWrapper";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <WorkOSWrapper>
          {children}
          <Toaster position="top-right" duration={5000} richColors closeButton />
        </WorkOSWrapper>
      </LanguageProvider>
    </ThemeProvider>
  );
}