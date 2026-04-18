import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const lang = searchParams.get("lang") === "en" ? "en-US" : "fr-FR";
  const token = process.env.TMDB_API_KEY;

  if (!query) return NextResponse.json({ results: [] });
  if (!token) return NextResponse.json({ error: "Clé TMDB manquante" }, { status: 500 });

  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&language=${lang}&page=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    
    // On nettoie la recherche des images vides et des acteurs
    const filteredResults = data.results.filter(
      (item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path && item.backdrop_path
    );
    return NextResponse.json({ results: filteredResults });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}