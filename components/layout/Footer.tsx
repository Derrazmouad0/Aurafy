"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Footer() {
  const searchParams = useSearchParams();
  const isEnglish = searchParams.get("lang") === "en";

  const t = {
    desc: isEnglish ? "Immersive platform for discovering and organizing audiovisual content." : "Plateforme immersive de découverte et d'organisation de contenus audiovisuels.",
    nav: isEnglish ? "Navigation" : "Navigation",
    home: isEnglish ? "Home" : "Accueil",
    movies: isEnglish ? "Movies" : "Films",
    series: isEnglish ? "Series" : "Séries",
    anime: isEnglish ? "Anime" : "Anime",
    legal: isEnglish ? "Legal" : "Légal",
    privacy: isEnglish ? "Privacy Policy" : "Confidentialité",
    terms: isEnglish ? "Terms of Service" : "Conditions d'utilisation",
    rights: isEnglish ? "All rights reserved." : "Tous droits réservés."
  };

  const langQuery = isEnglish ? "?lang=en" : "";

  return (
    <footer className="bg-uiGray/50 border-t border-white/5 py-12 mt-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="text-2xl font-black tracking-tighter text-white">AURA<span className="text-signaturePurple">FY</span></span>
          <p className="text-textGray text-sm mt-4 font-light max-w-xs">{t.desc}</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">{t.nav}</h4>
          <ul className="space-y-2 text-sm text-textGray">
            <li><Link href={`/${langQuery}`} className="hover:text-signaturePurple transition-colors">{t.home}</Link></li>
            <li><Link href={`/movies${langQuery}`} className="hover:text-signaturePurple transition-colors">{t.movies}</Link></li>
            <li><Link href={`/series${langQuery}`} className="hover:text-signaturePurple transition-colors">{t.series}</Link></li>
            <li><Link href={`/anime${langQuery}`} className="hover:text-signaturePurple transition-colors">{t.anime}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">{t.legal}</h4>
          <ul className="space-y-2 text-sm text-textGray">
            <li><Link href={`/privacy${langQuery}`} className="hover:text-signaturePurple transition-colors">{t.privacy}</Link></li>
            <li><Link href={`/terms${langQuery}`} className="hover:text-signaturePurple transition-colors">{t.terms}</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-white/5 text-sm text-textGray text-center md:text-left">
        © {new Date().getFullYear()} Aurafy. {t.rights}
      </div>
    </footer>
  );
}