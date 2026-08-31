// fichier src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
/*import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { WorkOSWrapper } from '@/components/WorkOSWrapper';
import { LanguageProvider } from '@/contexts/LanguageContext';*/
import Header from "@/components/header";
import Footer from "@/components/footer";
import JsonLd from "@/components/seo/json-ld";

//const inter = { className: 'font-sans' }; // Utilise la fonte définie dans globals.css?

export const metadata: Metadata = {
  metadataBase: new URL("https://300poils.vercel.app"),
  title: {
    default: "300 Poils | Toiletteur canin Lot-et-Garonne",
    template: "%s | 300poils",
  },
  description:
    "Site vitrine pour entreprise de toilettage canin dans le 47",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "300poils | Toiletteur canin Lot-et-Garonne",
    description:
      "Site vitrine pour entreprise de toilettage canin dans le 47",
    url: "https://300poils.vercel.app",
    siteName: "300poils",
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* - attribute="class" : next-themes ajoutera la classe "dark" sur <html> quand le thème sombre est actif.
     C'est ce qui active les variantes dark: de Tailwind CSS (ex: dark:bg-gray-950).
   - defaultTheme="system" : utilise la préférence du système d'exploitation comme valeur par défaut (auto-détection jour/nuit).
   - enableSystem : permet à l'utilisateur de revenir au mode "auto".
   - disableTransitionOnChange : évite un flash visuel lors du basculement en désactivant les transitions CSS pendant le changement de thème.
*/
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      {/* 100% de la hauteur de l'écran flexbox verticale utiliser bg-background et text-foreground définis dans globals.css*/}
    <body className={`font-sans min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white`} suppressHydrationWarning>
      <Providers>
        <Header />
        <main className="flex-1 py-2 sm:py-4">{children}</main>            
        <Footer />
      </Providers>
      <JsonLd />  
    </body>
    </html>
  );
}