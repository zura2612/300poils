// fichier src/components/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Pour gérer l'état "actif du lien
//import { useAuth } from "@workos-inc/authkit-react"; 
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./theme-toggle";
import { LogToggle } from "./LogToggle";
import { LockedLink } from "./LockedLink";
import { AuthModal } from "./AuthModal";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { HeaderTranslations } from "@/types/translations";
import { siteConfig } from "@/config/site";
import { siteStyle, siteClass } from "@/config/site";

const sectionStyle = "mb-1 border border-black dark:border-white";

// Styles pour la navigation Desktop
const boutonTexte = "font-semibold text-center tracking-wider transition hover:opacity-60";
const desktopBaseClass = `rounded-xl px-4 py-2 ${boutonTexte}`;
const desktopActiveClass = `${desktopBaseClass} text-accent-foreground bg-accent`;

// Styles pour la navigation Mobile (pleine largeur, aligné à gauche)
const mobileBaseClass = "w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted";
const mobileActiveClass = "bg-accent text-accent-foreground hover:bg-accent/90 hover:text";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "A propos", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState("");

  const { lang } = useLanguage();
  const pathname = usePathname();
  const { data:t, error } = usePageTranslations<HeaderTranslations>("header", lang);
  
  const { user, isLoading: isAuthLoading } = useAuth();
  const isAuthenticated = !!user;

  // Handlers pour le modal
  const openAuthModal = (message: string) => { setAuthModalMessage(message); setAuthModalOpen(true); };
  const closeAuthModal = () => { setAuthModalOpen(false); };

  if (error || !t) return (
    <header className="mb-1 sticky top-0 z-100 backdrop-blur-md">
      <section className={sectionStyle}>
        <p className="text-center py-4 text-destructive" role="alert">
          {error instanceof Error ? error.message : "Impossible de charger les textes de header"}
        </p>
      </section>
    </header>
  );

  // ✅ Fonction de rendu d'un label : bouton normal ou verrouillé
  const renderLabel = ( label: HeaderTranslations["navigation"]["labels"][number], variant: "desktop" | "mobile" ) => {
    const isProtected = label.requiresAuth === true;
    const isLocked = isProtected && !isAuthLoading && !isAuthenticated;
    const isActive = pathname === label.to; // Vérification de l'état actif

    // Bouton verrouillé (utilisateur non connecté)
    if (isLocked) {
      return (
        <LockedLink key={label.to} label={label.bouton} ariaLabelLocked={label.ariaLabelLocked}
          onClick={() => { if (variant === "mobile") setOpen(false); openAuthModal(label.lockedMessage ?? "Connexion requise.");}}
          className={variant === "desktop" ? desktopBaseClass : mobileBaseClass}/>);
    }

    // Bouton normal (utilisateur connecté ou lien non protégé)
    if (variant === "desktop") {
      return (
        <Link key={label.to} href={label.to} className={isActive ? desktopActiveClass : desktopBaseClass}>
          {label.bouton}
        </Link>
      );
    }
    // Version mobile
    return (
      <Link key={label.to} href={label.to} onClick={() => setOpen(false)} className={isActive ? `${mobileBaseClass} ${mobileActiveClass}` : mobileBaseClass}>
        {label.bouton}
      </Link>
    );
  };

  return (
    <header className="mb-1 sticky top-0 z-100 backdrop-blur-md">
      <section className={sectionStyle}>
        <div className="flex h-16 items-center justify-between">
          {/* Logo entreprise décalé à droite via ml-4*/}
          <Link href="/" className="flex items-center gap-2 ml-4 font-bold">
            <img src="/favicon.ico" alt={`Logo ${siteConfig.entreprise}`} width={32} height={32}
              className="h-9 w-9 rounded-full object-cover"/>
            <span className="ml-2 changer-couleur-effet">{siteConfig.entreprise}</span>
          </Link>

          {/* Items du menu navigation (desktop) */}
          <nav className="hidden items-center gap-1 md:flex">
            {t.navigation.labels.map((label) => renderLabel(label, "desktop"))}
          </nav>

          {/* langue, jour/nuit, connexion */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />

            <ThemeToggle labels={{light: t.tooltips.themeLight,dark: t.tooltips.themeDark}}/>

            {/* Décalage de LogToggle vers la gauche via mr-4 */}
            <div className="mr-4">
            <LogToggle labels={{
                titre: t.tooltips.titre, item1: t.tooltips.item1, item2: t.tooltips.item2,
                login: t.tooltips.login, logout: t.tooltips.logout, loading: t.tooltips.loading,
                logoutSuccess: t.tooltips.logoutSuccess, connected: t.tooltips.connected
                }}/>
            </div>
          </div>

          <button aria-label="Menu" className="md:hidden rounded-full p-2 hover:bg-muted" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menu hamburger pour mobile */}
        {open && (
          <div className="border-t border-border bg-background md:hidden">
            <div className="container-narrow flex flex-col gap-1 py-3">
              {/* Liens de navigation mobiles */}
              {t.navigation.labels.map((label) => renderLabel(label, "mobile"))}
              <hr className="my-2 border-muted" />

              <div className="mt-3 flex items-center gap-4 px-3">
                {/* Langue */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t.mobileSections.language}
                  </span>
                  <LanguageSwitcher />
                </div>
                {/* jour/nuit */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t.mobileSections.display}
                  </span>
                  <ThemeToggle labels={{ light: t.tooltips.themeLight, dark: t.tooltips.themeDark }}/>
                </div>
                {/* connexion */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t.mobileSections.account}
                  </span>
                  {/* logoutSuccess et connected ne sont pas utilisés. Pourquoi? */}
                  <LogToggle labels={{
                    titre: t.tooltips.titre, item1: t.tooltips.item1, item2: t.tooltips.item2,
                    login: t.tooltips.login, logout: t.tooltips.logout, loading: t.tooltips.loading }}/>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* fin de Menu hamburger pour mobile */}
      </section>

      {/* ✅ Modal d'authentification (en dehors du header pour le z-index) */}
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal}  message={authModalMessage} />
    </header>
  );
}