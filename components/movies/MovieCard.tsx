"use client";

import Image from "next/image";
import Link from "next/link";

export default function MovieCard({ movie }: { movie: any }) {
  const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
  
  if (!posterPath) return null;

  // Déterminer le type pour l'URL (movie ou tv)
  const mediaType = movie.media_type || (movie.title ? "movie" : "tv");

  return (
    <Link href={`/${mediaType}/${movie.id}`} className="group block w-36 md:w-48 flex-shrink-0">
      <div className="w-full aspect-[2/3] relative rounded-xl overflow-hidden cursor-pointer border border-white/5 shadow-lg bg-uiGray transition-all duration-300 group-hover:glow-purple group-hover:border-signaturePurple/50">
        <Image 
          src={posterPath} 
          alt={movie.title || movie.name || "Affiche"} 
          fill 
          sizes="(max-width: 768px) 144px, 192px"
          className="object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deepBlack via-deepBlack/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h4 className="text-white font-bold text-sm line-clamp-2 leading-tight drop-shadow-md">
            {movie.title || movie.name}
          </h4>
          <div className="flex items-center gap-1 mt-1 text-xs text-signaturePurple font-bold tracking-widest drop-shadow-md">
            ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-textGray font-medium truncate group-hover:text-white transition-colors">
        {movie.title || movie.name}
      </p>
    </Link>
  );
}