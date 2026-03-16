export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Bienvenue sur DTracker
        </h1>
        <p className="text-gray-600 max-w-xl">
          Une petite application expérimentale pour jouer avec des catégories,
          des dépenses et quelques graphiques aléatoires. Rien de sérieux,
          juste un terrain de jeu pour Next.js, Prisma et Chart.js.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Catégories
          </h2>
          <p className="text-xs text-gray-500">
            Créez des groupes comme &quot;Courses&quot;, &quot;Loisirs&quot; ou
            &quot;Abonnements&quot;.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Dépenses
          </h2>
          <p className="text-xs text-gray-500">
            Saisissez quelques montants fictifs pour tester les écrans.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Aperçu rapide
          </h2>
          <p className="text-xs text-gray-500">
            Jetez un œil au graphique de démonstration dans l&apos;onglet
            &quot;Analytics&quot;.
          </p>
        </div>
      </section>
    </div>
  );
}
