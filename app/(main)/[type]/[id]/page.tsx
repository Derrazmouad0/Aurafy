import Image from "next/image";
import Link from "next/link";
import { getItemDetails } from "../../../../lib/tmdb";
import MovieCard from "../../../../components/movies/MovieCard";
import WatchlistButton from "../../../../components/movies/WatchlistButton";
import SeasonSection from "../../../../components/movies/SeasonSection";
import ReviewSection from "../../../../components/movies/ReviewSection";
import PlayButton from "../../../../components/movies/PlayButton";

export default async function DetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ type: string, id: string }>, 
  searchParams: Promise<{ lang?: string }> 
}) {
  const { type, id } = await params;
  const isEnglish = (await searchParams).lang === "en";
  const apiLang = isEnglish ? "en-US" : "fr-FR";
  
  const item = await getItemDetails(type, id, apiLang);
  
  const t = isEnglish ? {
    notFound: "Content not found",
    notFoundDesc: "The movie or series you are looking for is currently unavailable.",
    back: "Back to Home",
    play: "Play",
    trailer: "Trailer",
    syn: "Synopsis",
    noSyn: "No synopsis available at this time.",
    cast: "Cast",
    similar: "Similar Titles",
    seasons: "Seasons",
    min: "min"
  } : {
    notFound: "Contenu introuvable",
    notFoundDesc: "Le film ou la série que vous cherchez n'est pas disponible.",
    back: "Retour à l'accueil",
    play: "Lecture",
    trailer: "Bande-annonce",
    syn: "Synopsis",
    noSyn: "Aucun synopsis disponible pour le moment.",
    cast: "Distribution",
    similar: "Titres similaires",
    seasons: "Saisons",
    min: "min"
  };

  // Sécurité anti-bug : Si TMDB ne trouve rien
  if (!item || Array.isArray(item) || !item.id) {
    return (
      <main className="min-h-screen bg-deepBlack flex items-center justify-center px-6">
        <div className="text-center space-y-6 glass-panel p-12 rounded-[32px]">
          <h1 className="text-3xl font-bold text-white">{t.notFound}</h1>
          <p className="text-textGray">{t.notFoundDesc}</p>
          <Link href={`/${isEnglish ? '?lang=en' : ''}`} className="inline-block px-8 py-4 bg-signaturePurple text-white font-bold rounded-2xl hover:bg-signaturePurple/80 transition-colors">
            {t.back}
          </Link>
        </div>
      </main>
    );
  }

  // Préparation des données
  const title = item.title || item.name || "Titre Inconnu";
  const year = (item.release_date || item.first_air_date || "N/A").split("-")[0];
  const trailer = item.videos?.results?.find((v: any) => v.type === "Trailer" || v.site === "YouTube");
  const cast = item.credits?.cast?.slice(0, 6) || [];
  const recommendations = item.recommendations?.results?.slice(0, 6) || [];

  return (
    <main className="min-h-screen bg-deepBlack text-white pb-20">
      
      {/* 1. Header Immersif */}
      <div className="relative h-[70vh] w-full bg-uiGray">
        {item.backdrop_path && (
          <Image 
            src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
            alt={title}
            fill
            className="object-cover opacity-40"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deepBlack via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-deepBlack via-deepBlack/20 to-transparent" />

        <div className="relative h-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-12">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-4 text-sm font-bold tracking-widest text-signaturePurple uppercase drop-shadow-md">
              <span>{year}</span>
              <span className="w-1 h-1 bg-white/30 rounded-full"></span>
              <span>⭐ {item.vote_average?.toFixed(1) || "N/A"}</span>
              <span className="w-1 h-1 bg-white/30 rounded-full"></span>
              <span>{type === "movie" ? `${item.runtime || "??"} ${t.min}` : `${item.number_of_seasons || 1} ${t.seasons}`}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-2xl">{title}</h1>
            
            <div className="flex flex-wrap gap-2">
              {item.genres?.map((g: any) => (
                <span key={g.id} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              
              {/* Le Nouveau Bouton de Lecture Interactif (Uniquement pour les films ici) */}
              {type === "movie" && (
                <PlayButton mediaType={type} mediaId={id} isEnglish={isEnglish} />
              )}
              
              {/* Le bouton Bande-annonce YouTube */}
              {trailer && (
                <a 
                  href={`https://www.youtube.com/watch?v=${trailer.key}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-uiGray text-white font-bold rounded-2xl flex items-center gap-3 border border-white/5 hover:bg-white/10 transition-colors shadow-lg hover:scale-105"
                >
                  {t.trailer}
                </a>
              )}

              {/* Le Bouton Watchlist */}
              <WatchlistButton item={item} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Contenu détaillé */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-16">
        
        {/* Colonne Gauche : Synopsis, Saisons & Commentaires */}
        <div className="lg:col-span-2 space-y-16">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-signaturePurple rounded-full"></span>
              {t.syn}
            </h2>
            <p className="text-textGray text-lg font-light leading-relaxed">
              {item.overview || t.noSyn}
            </p>
          </section>

          {/* Section Interactive des Saisons (Gère la lecture des épisodes) */}
          {type === "tv" && item.seasons && item.seasons.length > 0 && (
             <SeasonSection tvId={id} seasons={item.seasons} fallbackPoster={item.poster_path} />
          )}

          {/* Section des Commentaires */}
          <ReviewSection mediaId={id} />
        </div>

        {/* Colonne Droite : Distribution & Recommandations */}
        <div className="space-y-12">
          {cast.length > 0 && (
            <section>
              <h3 className="text-sm font-bold tracking-widest text-textGray uppercase mb-6">{t.cast}</h3>
              <div className="space-y-4">
                {cast.map((actor: any) => (
                  <div key={actor.id} className="flex items-center gap-4 group">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 group-hover:border-signaturePurple transition-colors bg-deepBlack">
                      {actor.profile_path && (
                        <Image src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{actor.name}</p>
                      <p className="text-xs text-textGray">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {recommendations.length > 0 && (
            <section>
              <h3 className="text-sm font-bold tracking-widest text-textGray uppercase mb-6">{t.similar}</h3>
              <div className="grid grid-cols-2 gap-4">
                {recommendations.map((rec: any) => (
                  <div key={rec.id} className="hover:scale-105 transition-transform">
                    <MovieCard movie={rec} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

      </div>
    </main>
  );
}