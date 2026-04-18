import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

// Récupérer la Watchlist de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ watchlist: user.watchlist || [] });
  } catch (error) {
    console.error("Erreur Watchlist GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Ajouter/Supprimer de la Watchlist
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const { media } = await req.json();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!media || !media.id) {
      return NextResponse.json({ error: "Données média manquantes" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const isAlreadyInWatchlist = user.watchlist.some((item: any) => item.id === media.id);

    if (isAlreadyInWatchlist) {
      // Si déjà présent, on le retire
      user.watchlist = user.watchlist.filter((item: any) => item.id !== media.id);
    } else {
      // Sinon, on l'ajoute
      user.watchlist.push(media);
    }

    await user.save();

    return NextResponse.json({ 
      message: isAlreadyInWatchlist ? "Retiré de la watchlist" : "Ajouté à la watchlist",
      watchlist: user.watchlist 
    });
  } catch (error) {
    console.error("Erreur Watchlist POST:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}