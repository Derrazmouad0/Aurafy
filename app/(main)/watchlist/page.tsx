"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import MovieCard from "../../../components/movies/MovieCard";

export default function WatchlistPage() {
  const { data: session, status } = useSession();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const isEnglish = searchParams.get("lang") === "en";

  useEffect(() => {
    if (status === "authenticated") {
      // On passe la langue à l'API pour récupérer les bons titres !
      fetch(`/api/watchlist/details${isEnglish ? '?lang=en' : ''}`)
        .then(res => res.json())
        .then(data => {
          setMovies(data.movies || []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Erreur chargement watchlist", err);
          setIsLoading(false);
        });
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, isEnglish]);

  const t = isEnglish ? {
    title: "My Watchlist",
    emptyTitle: "Your universe is empty",
    emptyDesc: "Add movies or series to your collection to keep track of them.",
    exploreBtn: "Explore Movies",
    loginReq: "Please log in to see your watchlist."
  } : {
    title: "Ma Watchlist",
    emptyTitle: "Votre univers est vide",
    emptyDesc: "Ajoutez des films ou des séries à votre collection pour en garder une trace.",
    exploreBtn: "Explorer les films",
    loginReq: "Veuillez vous connecter pour voir votre watchlist."
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deepBlack">
        <div className="w-10 h-10 border-4 border-signaturePurple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-deepBlack text-white pt-32 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 animate-fade-in">
        
        <div className="flex items-center gap-4 mb-12">
          <span className="w-2 h-10 bg-signaturePurple rounded-full glow-purple"></span>
          <h1 className="text-4xl md:text-5xl font-black text-white">{t.title}</h1>
        </div>

        {status === "unauthenticated" ? (
          <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-[32px] text-center">
            <h2 className="text-2xl font-bold mb-4">{t.loginReq}</h2>
            <Link href={`/login${isEnglish ? '?lang=en' : ''}`} className="mt-4 px-8 py-4 bg-signaturePurple rounded-2xl font-bold glow-purple">
              {isEnglish ? "Log In" : "Se connecter"}
            </Link>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-[32px] text-center">
            <div className="w-24 h-24 bg-uiGray rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-2xl glow-purple">
              <svg className="w-10 h-10 text-signaturePurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">{t.emptyTitle}</h2>
            <p className="text-textGray mb-8 max-w-md">{t.emptyDesc}</p>
            <Link href={`/movies${isEnglish ? '?lang=en' : ''}`} className="px-8 py-4 bg-signaturePurple rounded-2xl font-bold glow-purple hover:scale-105 transition-transform">
              {t.exploreBtn}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {movies.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}