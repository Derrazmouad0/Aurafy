"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function HeroCarousel({ movies = [] }: { movies?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEnglish = searchParams.get("lang") === "en";

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [movies?.length]);

  if (!movies || movies.length === 0) {
    return (
      <div className="relative h-[85vh] w-full flex items-center justify-center bg-deepBlack">
        <div className="w-12 h-12 border-4 border-signaturePurple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];
  const displayTitle = currentMovie?.title || currentMovie?.name;
  const displayDate = currentMovie?.release_date || currentMovie?.first_air_date || "";
  const displayYear = displayDate ? displayDate.split('-')[0] : "";
  
  // On détecte si c'est un film ou une série pour le lien
  const mediaType = currentMovie?.media_type || (currentMovie?.first_air_date ? 'tv' : 'movie');
  const langQuery = isEnglish ? "?lang=en" : "";

  // Fonction de redirection vers la page de détails
  const handleNavigate = () => {
    router.push(`/${mediaType}/${currentMovie?.id}${langQuery}`);
  };

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      
      {/* Arrière-plan avec fondu enchaîné */}
      <div 
        key={currentIndex} 
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out animate-fade-in"
      >
        <Image 
          src={`https://image.tmdb.org/t/p/original${currentMovie?.backdrop_path}`} 
          alt={displayTitle || "Hero Image"} 
          fill 
          className="object-cover opacity-60" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deepBlack via-deepBlack/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-deepBlack via-deepBlack/20 to-transparent" />
      </div>

      {/* Contenu textuel */}
      <div className="relative h-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col justify-center pb-20">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          
          <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase">
            <span className="text-signaturePurple drop-shadow-md">
              ⭐ {currentMovie?.vote_average?.toFixed(1) || "N/A"}
            </span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span className="text-accentBlue drop-shadow-md">{displayYear}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span className="bg-white/10 px-3 py-1 rounded-md text-white backdrop-blur-md">
              {mediaType === 'tv' ? (isEnglish ? 'SERIES' : 'SÉRIE') : 'FILM'}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl tracking-tighter">
            {displayTitle}
          </h1>
          
          <p className="text-textGray text-lg line-clamp-3 leading-relaxed font-light drop-shadow-md">
            {currentMovie?.overview || (isEnglish ? "No synopsis available." : "Aucun synopsis disponible.")}
          </p>
          
          {/* Boutons d'action cliquables */}
          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleNavigate} 
              className="px-8 py-4 bg-signaturePurple text-white font-bold rounded-2xl hover:bg-signaturePurple/80 transition-all glow-purple flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5.14v14l11-7-11-7z"/></svg> 
              {isEnglish ? "Play" : "Lecture"}
            </button>
            <button 
              onClick={handleNavigate} 
              className="px-8 py-4 bg-uiGray/50 text-white font-bold rounded-2xl hover:bg-uiGray transition-all backdrop-blur-md border border-white/5 flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95"
            >
              {isEnglish ? "More Info" : "Plus d'infos"}
            </button>
          </div>
        </div>
      </div>

      {/* Points de navigation en bas */}
      <div className="absolute bottom-10 left-6 md:left-12 flex gap-2 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex ? "w-8 bg-signaturePurple glow-purple" : "w-3 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

    </div>
  );
}