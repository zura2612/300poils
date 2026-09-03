// app/contact/loading.tsx
export default function LoadingContact() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-black rounded-2xl">
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-black dark:border-t-white rounded-full animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Chargement du formulaire en cours pour la page Contact…
        </p>
      </div>
    </main>
  );
}