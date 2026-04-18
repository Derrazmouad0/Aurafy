import { NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const season = searchParams.get("season");
  const token = process.env.TMDB_API_KEY;

  if (!id || !season || !token) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  try {
    // On récupère les détails de la saison + ses vidéos (trailers)
    const res = await fetch(`${TMDB_BASE_URL}/tv/${id}/season/${season}?language=fr-FR&append_to_response=videos`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json'
      }
    });
    
    if (!res.ok) throw new Error("Erreur TMDB");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}