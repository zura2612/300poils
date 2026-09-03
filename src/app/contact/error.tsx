// app/contact/error.tsx
"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ContactError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-black rounded-2xl">
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center max-w-md mx-auto">
        {/* Icône */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-950">
          <AlertCircle className="w-9 h-9 text-red-500" aria-hidden="true" />
        </div>

        {/* Titre grand public */}
        <h1 className="text-2xl text-black dark:text-white font-extrabold">
          Oups, quelque chose s'est mal passé
        </h1>

        {/* Message rassurant */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Nous n'avons pas pu charger le formulaire de contact. Pas d'inquiétude,
          vous pouvez revenir à l'accueil ou réessayer dans quelques instants.
        </p>

        {/* Lien vers l'accueil */}
        <Link
          href="/"
          className="inline-flex items-center justify-center py-3 px-6 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold shadow-md"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}