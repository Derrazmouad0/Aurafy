import Link from "next/link";

export default async function PrivacyPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const isEnglish = (await searchParams).lang === "en";

  const t = isEnglish ? {
    title: "Privacy Policy",
    updated: "Last updated: October 2023",
    introTitle: "1. Introduction",
    introText: "Welcome to Aurafy. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.",
    dataTitle: "2. The Data We Collect",
    dataText: "We may collect, use, store and transfer different kinds of personal data about you, including Identity Data (first name, last name, username), Contact Data (email address), and Profile Data (your watchlist, preferences, and avatars).",
    apiTitle: "3. Third-Party APIs (TMDB)",
    apiText: "Aurafy uses the TMDB API to display movie and TV show data. However, we do not share your personal account information or email address with TMDB. Your viewing habits and watchlists remain strictly on our servers.",
    securityTitle: "4. Data Security",
    securityText: "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.",
    rightsTitle: "5. Your Legal Rights",
    rightsText: "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, or erasure of your personal data.",
    contactTitle: "6. Contact Us",
    contactText: "If you have any questions about this privacy policy or our privacy practices, please contact us via our official support channels."
  } : {
    title: "Politique de Confidentialité",
    updated: "Dernière mise à jour : Octobre 2023",
    introTitle: "1. Introduction",
    introText: "Bienvenue sur Aurafy. Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette politique de confidentialité vous informe sur la manière dont nous traitons vos données lorsque vous visitez notre site.",
    dataTitle: "2. Les données que nous collectons",
    dataText: "Nous pouvons collecter, utiliser et stocker différents types de données personnelles vous concernant, notamment des données d'identité (nom, prénom, nom d'utilisateur), des données de contact (adresse e-mail) et des données de profil (votre watchlist, vos préférences et avatars).",
    apiTitle: "3. API Tiers (TMDB)",
    apiText: "Aurafy utilise l'API TMDB pour afficher les données des films et séries. Cependant, nous ne partageons pas les informations de votre compte personnel ou votre adresse e-mail avec TMDB. Vos habitudes de visionnage et watchlists restent strictement sur nos serveurs.",
    securityTitle: "4. Sécurité des données",
    securityText: "Nous avons mis en place des mesures de sécurité appropriées pour éviter que vos données personnelles ne soient accidentellement perdues, utilisées, modifiées, divulguées ou consultées de manière non autorisée.",
    rightsTitle: "5. Vos droits légaux",
    rightsText: "Dans certaines circonstances, les lois sur la protection des données vous confèrent des droits concernant vos données personnelles, y compris le droit de demander l'accès, la correction ou l'effacement de vos données.",
    contactTitle: "6. Nous contacter",
    contactText: "Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques de confidentialité, veuillez nous contacter via nos canaux d'assistance officiels."
  };

  return (
    <main className="min-h-screen bg-deepBlack text-white pt-32 pb-24">
      <div className="max-w-[900px] mx-auto px-6 md:px-12 animate-fade-in">
        
        {/* En-tête */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-2 h-10 bg-signaturePurple rounded-full glow-purple"></span>
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
            <h2 className="text-2xl font-bold text-white mb-4">{t.dataTitle}</h2>
            <p>{t.dataText}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.apiTitle}</h2>
            <p>{t.apiText}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.securityTitle}</h2>
            <p>{t.securityText}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.rightsTitle}</h2>
            <p>{t.rightsText}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.contactTitle}</h2>
            <p>{t.contactText}</p>
          </section>
        </div>

        {/* Bouton de retour */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Link 
            href={`/${isEnglish ? '?lang=en' : ''}`}
            className="inline-flex items-center gap-2 text-signaturePurple hover:text-white transition-colors font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {isEnglish ? "Back to Home" : "Retour à l'accueil"}
          </Link>
        </div>

      </div>
    </main>
  );
}