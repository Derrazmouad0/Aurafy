"use client";

import { useEffect } from "react";

interface VideoPlayerProps {
  mediaType: string; // "movie" ou "tv"
  mediaId: string;   // l'ID TMDB
  season?: number;   // Numéro de saison (pour les séries)
  episode?: number;  // Numéro d'épisode (pour les séries)
  onClose: () => void;
}

export default function VideoPlayerModal({ mediaType, mediaId, season, episode, onClose }: VideoPlayerProps) {
  
  // Empêche le scroll de la page quand le lecteur est ouvert
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // ==========================================
  // 🛑 ZONE À COMPLÉTER AVEC TA SOURCE 🛑
  // ==========================================
  
let sourceUrl = "";
const BASE_URL = "https://donkey.to";
    if (mediaType === "movie") {
        sourceUrl = `${BASE_URL}/watch-now?type=movie&id=${mediaId}&seasonId=1&episodeId=1`;
    } else if (mediaType === "tv") {
        sourceUrl = `${BASE_URL}/watch-now?type=tv&id=${mediaId}`;
    }

  // ==========================================

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4 md:p-12 animate-fade-in backdrop-blur-md">
      
      {/* Bouton Fermer (Croix en haut à droite) */}
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors z-[201] p-2 bg-white/5 hover:bg-white/10 rounded-full"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Le Lecteur (Format 16/9) */}
      <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(155,34,214,0.3)] border border-white/10 relative">
        <iframe
          src={sourceUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        ></iframe>
      </div>
      
    </div>
  );
}