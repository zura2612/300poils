// components/welcome-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeModalProps {
  duration?: number;
}

const STORAGE_KEY = "welcome_modal_seen";

export default function WelcomeModal({ duration = 5 }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Détection du montage client et contrôle sessionStorage
  useEffect(() => {
    setIsMounted(true);
    const hasBeenSeen = sessionStorage.getItem(STORAGE_KEY);
    //console.log("[WelcomeModal] Clé sessionStorage trouvée ?", hasBeenSeen);

    if (!hasBeenSeen) {
      setIsOpen(true);
    }
  }, []);

  // 2. Décompte chiffré
  useEffect(() => {
    if (!isOpen) return;

    if (timeLeft <= 0) {
      handleClose();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // 3. Fermeture et enregistrement
  const handleClose = () => {
    //console.log("[WelcomeModal] Fermeture et enregistrement dans sessionStorage");
    sessionStorage.setItem(STORAGE_KEY, "creation");
    setIsOpen(false);
  };

  // Évite les erreurs d'hydratation SSR
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Overlay avec flou de verre */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Boîte Modale */}
          <motion.div
            // MODIFICATION : Départ à -100vh pour que la modale démarre complètement au-dessus de l'écran visible
            initial={{ opacity: 0, scale: 0.95, y: "-100vh" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            // MODIFICATION : Remontée hors écran (-100vh) lors de la fermeture
            exit={{ opacity: 0, scale: 0.95, y: "-100vh" }}
            // MODIFICATION : Passage en type "tween" avec duration: 3.0 s et easeOut pour forcer une descente contrôlée, progressive et lente
            transition={{
              type: "tween",
              ease: "easeOut",
              duration: 3.0,
            }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-black dark:border-white bg-blue-200 dark:bg-black p-6 shadow-2xl text-black dark:text-white"
          >          
            {/* Bouton fermeture (X) */}
            <button
              onClick={handleClose}
              className="absolute top-1 right-1 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Contenu */}
            <div className="flex flex-col pt-4 items-center text-center space-y-4">        
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">Bienvenue sur notre site de toilettage canin</h3>
              </div>

              <div className="pt-2 font-medium text-black dark:text-white">
                Fermeture automatique dans{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {timeLeft} s
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}