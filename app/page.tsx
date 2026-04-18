import Link from "next/link";
import HeroCarousel from "../components/movies/HeroCarousel";
import MovieCard from "../components/movies/MovieCard";
import { 
  getTrending, getActionMovies, getRomanceMovies, getHorrorMovies, getStudioGhibli, 
  getMoviesByProvider, getSeriesByProvider, getComedyMovies, getSciFiMovies, 
  getMysteryMovies, getDocumentaries, getKDramas 
} from "../lib/tmdb";

const PLATFORMS = [
  { id: "8", name: "Netflix", bg: "bg-black", border: "border-[#E50914]/50 hover:border-[#E50914]", logo: <span className="text-[#E50914] font-black text-3xl tracking-[0.05em] uppercase scale-y-110 drop-shadow-md">Netflix</span> },
  { 
    id: "9", name: "Prime Video", bg: "bg-[#00A8E1]", border: "border-[#00A8E1] hover:border-white",
    logo: (
      <div className="flex flex-col items-center">
        <span className="text-white font-bold text-3xl tracking-tighter lowercase leading-none">prime</span>
        <span className="text-[#00A8E1] bg-white font-bold text-[10px] tracking-[0.2em] uppercase px-1.5 py-0.5 rounded-sm mt-0.5 leading-none">video</span>
      </div>
    )
  },
  { id: "337", name: "Disney+", bg: "bg-gradient-to-b from-[#020D3C] to-[#041561]", border: "border-[#113CCF] hover:border-white", logo: <span className="text-white font-serif italic text-3xl tracking-widest drop-shadow-lg">Disney<span className="align-super text-xl">+</span></span> },
  { id: "1899|384", name: "Max", bg: "bg-gradient-to-br from-[#002BE7] to-[#8C00FF]", border: "border-purple-500 hover:border-white", logo: <span className="text-white font-black text-3xl tracking-tighter drop-shadow-md">MAX</span> },
  { id: "15", name: "Hulu", bg: "bg-[#272c34]", border: "border-[#1ce783]/50 hover:border-[#1ce783]", logo: <span className="text-[#1ce783] font-black text-4xl tracking-tighter">hulu</span> },
  { id: "531", name: "Paramount+", bg: "bg-[#0064FF]", border: "border-[#0064FF] hover:border-white", logo: <span className="text-white font-bold text-xl tracking-tight">Paramount<span className="text-[#00c3ff] drop-shadow-lg">+</span></span> },
  { id: "350", name: "Apple TV+", bg: "bg-black", border: "border-white/20 hover:border-white", logo: <span className="flex items-center gap-1 text-white font-semibold text-2xl"><svg viewBox="0 0 384 512" className="h-6 w-6 fill-white"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.3zM302.2 92.1c22.9-27.4 30.1-59.4 25.3-92.1-28.2 1.1-62 16.2-85.3 43.6-21.1 24.1-30.6 57.1-24.3 88.5 31.5 2.4 61.4-12.6 84.3-40z"/></svg>tv+</span> },
  { id: "283", name: "Crunchyroll", bg: "bg-[#F47521]", border: "border-[#F47521] hover:border-white", logo: <span className="text-black font-black text-2xl uppercase tracking-tighter">Crunchyroll</span> }
];

export default async function Home({ searchParams }: { searchParams: Promise<{ provider?: string, lang?: string }> }) {
  const resolvedParams = await searchParams;
  const currentProvider = resolvedParams.provider;
  const isEnglish = resolvedParams.lang === "en";
  const apiLang = isEnglish ? "en-US" : "fr-FR";

  let categories = [];
  let heroMovies = [];

  if (currentProvider) {
    const [providerMovies, providerSeries] = await Promise.all([
      getMoviesByProvider(currentProvider, apiLang),
      getSeriesByProvider(currentProvider, apiLang)
    ]);
    const providerName = PLATFORMS.find(p => p.id === currentProvider)?.name || "";
    heroMovies = providerMovies.slice(0, 6);
    categories = [
      { title: isEnglish ? `Popular Movies on ${providerName}` : `Films Populaires sur ${providerName}`, data: providerMovies },
      { title: isEnglish ? `Popular Series on ${providerName}` : `Séries Populaires sur ${providerName}`, data: providerSeries },
    ];
  } else {
    const [
      trending, action, romance, horror, ghibli, 
      comedy, scifi, mystery, docs, kdramas
    ] = await Promise.all([
      getTrending(apiLang), getActionMovies(apiLang), getRomanceMovies(apiLang), 
      getHorrorMovies(apiLang), getStudioGhibli(apiLang),
      getComedyMovies(apiLang), getSciFiMovies(apiLang), getMysteryMovies(apiLang),
      getDocumentaries(apiLang), getKDramas(apiLang)
    ]);

    heroMovies = trending.slice(0, 6);
    categories = [
      { title: isEnglish ? "Trending Today" : "Tendances du Jour", data: trending },
      { title: isEnglish ? "K-Dramas & Korean Series" : "K-Dramas & Séries Coréennes", data: kdramas },
      { title: isEnglish ? "Explosive Action" : "Action Explosive", data: action },
      { title: isEnglish ? "Studio Ghibli Masterpieces" : "Chefs-d'œuvre du Studio Ghibli", data: ghibli },
      { title: isEnglish ? "Sci-Fi Adventures" : "Aventures Science-Fiction", data: scifi },
      { title: "Romance", data: romance },
      { title: isEnglish ? "Comedy & Laughs" : "Comédies & Fous rires", data: comedy },
      { title: isEnglish ? "Horror & Thrills" : "Horreur & Frissons", data: horror },
      { title: isEnglish ? "Mystery & Thrillers" : "Mystère & Suspens", data: mystery },
      { title: isEnglish ? "Documentaries" : "Documentaires Fascinants", data: docs }
    ];
  }

  return (
    <div className="w-full bg-deepBlack overflow-hidden">
      <HeroCarousel movies={heroMovies} />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 space-y-20">
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold tracking-[0.2em] text-textGray uppercase">{isEnglish ? "Explore by platform" : "Explorer par plateforme"}</h3>
            {currentProvider && (
              <Link href={`/${isEnglish ? '?lang=en' : ''}`} className="text-sm font-bold text-accentPink hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full backdrop-blur-md">
                ✕ {isEnglish ? "Reset filter" : "Réinitialiser"}
              </Link>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto py-6 px-2 -mx-2 scrollbar-hide snap-x">
            {PLATFORMS.map((p) => {
              const isActive = currentProvider === p.id;
              const href = isActive ? (isEnglish ? '/?lang=en' : '/') : `/?provider=${p.id}${isEnglish ? '&lang=en' : ''}`;
              return (
                <Link key={p.id} href={href} className={`flex-shrink-0 snap-start w-56 h-24 rounded-2xl ${p.bg} flex items-center justify-center border-2 transition-all duration-300 shadow-xl cursor-pointer ${p.border} ${isActive ? 'border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}>
                  {p.logo}
                </Link>
              );
            })}
          </div>
        </section>
        {categories.map((category, index) => (
          <section key={index}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                <span className={`w-1 h-6 rounded-full ${currentProvider ? 'bg-accentPink glow-pink' : 'bg-signaturePurple glow-purple'}`}></span>
                {category.title}
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto py-6 px-2 -mx-2 scrollbar-hide">
              {category.data.length > 0 ? category.data.map((movie: any) => <MovieCard key={movie.id} movie={movie} />) : <p className="text-textGray italic">{isEnglish ? "No content found." : "Aucun contenu."}</p>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}