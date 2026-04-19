"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function WatchlistButtonContent({ item }: { item: any }) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEnglish = searchParams?.get("lang") === "en";

  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const itemKey = `${mediaType}_${item.id}`;

  useEffect(() => {
    if (session && item?.id) {
      fetch("/api/watchlist")
        .then(res => res.json())
        .then(data => {
          const list = data.watchlist || [];
          setInWatchlist(list.includes(itemKey) || list.includes(String(item.id)));
        })
        .catch(err => console.error("Erreur chargement watchlist", err));
    }
  }, [session, item?.id, itemKey]);

  const toggleWatchlist = async () => {
    if (!session) {
      router.push(`/login${isEnglish ? '?lang=en' : ''}`);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId: item.id, mediaType })
      });

      if (res.ok) {
        const data = await res.json();
        setInWatchlist(!data.removed);
      }
    } catch (err) {
      console.error("Erreur action watchlist", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleWatchlist} 
      disabled={loading}
      className={`px-8 py-4 font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 border shadow-lg hover:scale-105 active:scale-95 ${
        inWatchlist 
          ? "bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md" 
          : "bg-uiGray text-white border-white/5 hover:bg-white/10"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {inWatchlist ? (
        <>
          <svg className="w-6 h-6 text-accentPink drop-shadow-[0_0_10px_rgba(255,77,166,0.8)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {isEnglish ? "In Watchlist" : "Dans ma Watchlist"}
        </>
      ) : (
        <>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {isEnglish ? "Add to Watchlist" : "Ajouter à ma Watchlist"}
        </>
      )}
    </button>
  );
}

export default function WatchlistButton(props: { item: any }) {
  return (
    <Suspense fallback={null}>
      <WatchlistButtonContent {...props} />
    </Suspense>
  );
}