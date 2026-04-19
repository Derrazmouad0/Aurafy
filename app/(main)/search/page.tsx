"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MovieCard from "../../../components/movies/MovieCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const isEnglish = searchParams?.get("lang") === "en";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const langParam = isEnglish ? "&lang=en" : "";
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}${langParam}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {} finally { setIsLoading(false); }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query, isEnglish]);

  return (
    <main className="min-h-screen bg-deepBlack text-white pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="relative max-w-3xl mx-auto mb-16 animate-fade-in">
          <input
            type="text"
            placeholder={isEnglish ? "Movies, Series, Anime..." : "Films, Séries, Animes..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-uiGray/50 border border-white/10 rounded-full py-6 px-8 text-2xl text-white placeholder:text-textGray/50 focus:outline-none focus:border-signaturePurple focus:ring-1 focus:ring-signaturePurple transition-all glow-purple backdrop-blur-md"
            autoFocus
          />
        </div>
        {query.trim() !== "" && (
          <div>
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1 h-6 bg-signaturePurple rounded-full"></span>
              {isEnglish ? `Results for "${query}"` : `Résultats pour "${query}"`}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
              {results.map((item: any) => <MovieCard key={item.id} movie={item} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deepBlack"></div>}>
      <SearchContent />
    </Suspense>
  );
}