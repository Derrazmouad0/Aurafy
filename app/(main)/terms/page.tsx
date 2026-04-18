import Link from "next/link";

export default async function TermsPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const isEnglish = (await searchParams).lang === "en";

  const t = isEnglish ? {
    title: "Terms of Service",
    updated: "Last updated: October 2023",
    introTitle: "1. Acceptance of Terms",
    introText: "By accessing and using the Aurafy platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.",
    serviceTitle: "2. Description of Service",
    serviceText: "Aurafy provides a personalized discovery and organization platform for movies, TV series, and anime. We do not host any streaming video files on our servers. All metadata and images are provided by the TMDB API.",
    userTitle: "3. User Accounts",
    userText: "To use certain features (like the Watchlist and Reviews), you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
    ipTitle: "4. Intellectual Property",
    ipText: "The Aurafy design, logos, and original code are our intellectual property. Movie posters, titles, and summaries remain the property of their respective creators and are displayed via TMDB under fair use and their API terms.",
    liabilityTitle: "5. Limitation of Liability",
    liabilityText: "Aurafy is provided 'as is' without any warranties. We are not responsible for any interruptions in service, data loss, or inaccuracies in the content provided by third-party APIs.",
    changesTitle: "6. Changes to Terms",
    changesText: "We reserve the right to modify these terms at any time. We will notify users of any significant changes. Continued use of the platform after changes implies acceptance of the new terms."
  } : {
    title: "Conditions d'utilisation",
    updated: "Dernière mise à jour : Octobre 2023",
    introTitle: "1. Acceptation des conditions",
    introText: "En accédant et en utilisant la plateforme Aurafy, vous acceptez de vous conformer et d'être lié par ces Conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.",
    serviceTitle: "2. Description du service",
    serviceText: "Aurafy offre une plateforme personnalisée de découverte et d'organisation pour les films, séries TV et animes. Nous n'hébergeons aucun fichier vidéo en streaming sur nos serveurs. Toutes les métadonnées et images sont fournies par l'API TMDB.",
    userTitle: "3. Comptes utilisateurs",
    userText: "Pour utiliser certaines fonctionnalités (comme la Watchlist et les Avis), vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de vos identifiants et de toutes les activités qui se produisent sous votre compte.",
    ipTitle: "4. Propriété intellectuelle",
    ipText: "Le design, les logos et le code original d'Aurafy sont notre propriété intellectuelle. Les affiches de films, titres et résumés restent la propriété de leurs créateurs respectifs et sont affichés via TMDB.",
    liabilityTitle: "5. Limitation de responsabilité",
    liabilityText: "Aurafy est fourni 'tel quel' sans aucune garantie. Nous ne sommes pas responsables des interruptions de service, de la perte de données ou des inexactitudes dans le contenu fourni par des API tierces.",
    changesTitle: "6. Modification des conditions",
    changesText: "Nous nous réservons le droit de modifier ces conditions à tout moment. Nous informerons les utilisateurs de tout changement important. L'utilisation continue de la plateforme après des modifications implique l'acceptation des nouvelles conditions."
  };

  return (
    <main className="min-h-screen bg-deepBlack text-white pt-32 pb-24">
      <div className="max-w-[900px] mx-auto px-6 md:px-12 animate-fade-in">
        
        {/* En-tête */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-2 h-10 bg-accentBlue rounded-full glow-blue"></span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
              {t.title}
            </h1>
          </div>
          <p className="text-textGray italic">{t.updated}</p>
        </div>

        {/* Contenu de lecture (Typographie aérée) */}
        <div className="space-y-10 text-lg font-light leading-relaxed text-textGray">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.introTitle}</h2>
            <p>{t.introText}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.serviceTitle}</h2>
            <p>{t.serviceText}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.userTitle}</h2>
            <p>{t.userText}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.ipTitle}</h2>
            <p>{t.ipText}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.liabilityTitle}</h2>
            <p>{t.liabilityText}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.changesTitle}</h2>
            <p>{t.changesText}</p>
          </section>
        </div>

        {/* Bouton de retour */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Link 
            href={`/${isEnglish ? '?lang=en' : ''}`}
            className="inline-flex items-center gap-2 text-accentBlue hover:text-white transition-colors font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {isEnglish ? "Back to Home" : "Retour à l'accueil"}
          </Link>
        </div>

      </div>
    </main>
  );
}