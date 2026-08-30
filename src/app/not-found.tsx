// app/not-found.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-black rounded-2xl">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        {/* Grand 404 stylisé avec dégradé */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent select-none"
        >
          Erreur 404
        </motion.h1>

        {/* Icône boussole avec animation de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950"
        >
          <motion.span
            animate={{ rotate: [0, -12, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
            className="inline-flex"
          >
            <Compass
              className="w-9 h-9 text-indigo-600 dark:text-indigo-400"
              aria-hidden="true"
            />
          </motion.span>
        </motion.div>

        {/* Titre */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-2xl text-black dark:text-white font-bold"
        >
          Cette page est introuvable
        </motion.h2>

        {/* Message grand public */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-3 text-slate-600 dark:text-slate-400 max-w-md"
        >
          La page que vous recherchez n'existe pas ou a été déplacée.
        </motion.p>

        {/* Bouton retour accueil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold shadow-md"
          >
            Retour à l'accueil
          </Link>
        </motion.div>
      </div>
    </main>
  );
}