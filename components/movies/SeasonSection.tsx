"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import VideoPlayerModal from "./VideoPlayerModal";

export default function SeasonSection({ tvId, seasons, fallbackPoster }: { tvId: string, seasons: any[], fallbackPoster: string }) {
  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [seasonData, setSeasonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour le lecteur vidéo
  const [playerOpen, setPlayerOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const isEnglish = searchParams.get("lang") === "en";

  const handleSeasonClick = async (seasonNumber: number) => {
    if (activeSeason === seasonNumber) {
      setActiveSeason(null); 
      return;
    }
    setActiveSeason(seasonNumber);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/season?id=${tvId}&season=${seasonNumber}`);
      const data = await res.json();
      setSeasonData(data);
    } catch (error) {
      console.error("Erreur de chargement de la saison", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEpisodePlay = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setPlayerOpen(true);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-white">
        <span className="w-1 h-6 bg-accentPink rounded-full glow-pink"></span>
        {isEnglish ? "Seasons" : "Saisons"}
      </h2>
      
      <div className="flex gap-4 overflow-x-auto py-6 px-2 -mx-2 scrollbar-hide">
        {seasons.filter((s: any) => s.season_number > 0).map((season: any) => (
          <div 
            key={season.id} 
            onClick={() => handleSeasonClick(season.season_number)}
            className={`flex-shrink-0 w-40 cursor-pointer group transition-all duration-300 ${activeSeason === season.season_number ? 'scale-105' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
          >
            <div className={`aspect-[2/3] relative rounded-xl overflow-hidden border-2 shadow-lg mb-3 ${activeSeason === season.season_number ? 'border-accentPink glow-pink' : 'border-white/5 group-hover:border-white/20'}`}>
              <Image 
                src={season.poster_path ? `https://image.tmdb.org/t/p/w200${season.poster_path}` : `https://image.tmdb.org/t/p/w200${fallbackPoster}`} 
                alt={season.name} fill className="object-cover" 
              />
            </div>
            <p className="font-bold text-white text-sm truncate">{season.name}</p>
            <p className="text-xs text-textGray">{season.episode_count} {isEnglish ? "Episodes" : "Épisodes"}</p>
          </div>
        ))}
      </div>

      {activeSeason !== null && (
        <div className="mt-4 p-6 glass-panel rounded-[24px] border border-white/10 animate-fade-in relative overflow-hidden bg-uiGray">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-accentPink border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : seasonData && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-black text-white">{seasonData.name}</h3>
                <button onClick={() => setActiveSeason(null)} className="text-textGray hover:text-white bg-white/5 p-2 rounded-full">
                  ✕
                </button>
              </div>
              
              <p className="text-textGray font-light leading-relaxed">
                {seasonData.overview || (isEnglish ? "No synopsis available for this season." : "Le synopsis de cette saison n'est pas encore disponible.")}
              </p>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-sm font-bold tracking-widest text-textGray uppercase mb-4">
                  {isEnglish ? "Episode List" : "Liste des épisodes"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {seasonData.episodes?.map((ep: any) => (
                    <div 
                      key={ep.id} 
                      onClick={() => handleEpisodePlay(ep.episode_number)}
                      className="flex gap-4 p-3 bg-deepBlack/50 rounded-xl border border-white/5 hover:border-accentPink hover:bg-accentPink/10 transition-colors cursor-pointer group"
                    >
                      <div className="w-24 h-16 flex-shrink-0 relative rounded-md overflow-hidden bg-black flex items-center justify-center">
                        {ep.still_path ? (
                          <Image src={`https://image.tmdb.org/t/p/w200${ep.still_path}`} alt={ep.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <span className="text-[10px] absolute inset-0 flex items-center justify-center text-textGray">N/A</span>
                        )}
                        {/* Icône de lecture au survol */}
                        <svg className="absolute w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5.14v14l11-7-11-7z"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm truncate">{ep.episode_number}. {ep.name}</p>
                        <p className="text-xs text-textGray mt-1">⭐ {ep.vote_average?.toFixed(1)} • {ep.runtime || "?"} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Le Lecteur Vidéo (affiché si on clique sur un épisode) */}
      {playerOpen && activeSeason && selectedEpisode && (
        <VideoPlayerModal 
          mediaType="tv" 
          mediaId={tvId} 
          season={activeSeason}
          episode={selectedEpisode}
          onClose={() => setPlayerOpen(false)} 
        />
      )}
    </section>
  );
}