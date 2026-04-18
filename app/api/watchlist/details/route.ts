import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ movies: [] });

  // Récupérer la langue depuis l'URL (pour que la Watchlist soit bilingue !)
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") === "en" ? "en-US" : "fr-FR";

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  
  if (!user || !user.watchlist || user.watchlist.length === 0) {
    return NextResponse.json({ movies: [] });
  }

  try {
    const token = process.env.TMDB_API_KEY;
    
    const moviePromises = user.watchlist.map(async (itemKey: string) => {
      let type = 'movie';
      let id = itemKey;

      // Décodage de notre nouvelle clé parfaite (tv_123 -> type: tv, id: 123)
      if (itemKey.includes('_')) {
        [type, id] = itemKey.split('_');
      }

      const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?language=${lang}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        data.media_type = type; // On force le type pour que la carte réagisse bien
        return data;
      }
      return null;
    });

    const results = await Promise.all(moviePromises);
    // On enlève les null (au cas où un film aurait été supprimé par TMDB)
    const filteredResults = results.filter(m => m !== null);

    return NextResponse.json({ movies: filteredResults });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}