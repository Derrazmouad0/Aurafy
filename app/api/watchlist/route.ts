import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ watchlist: [] });
  
  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  return NextResponse.json({ watchlist: user?.watchlist || [] });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const { mediaId, mediaType } = await req.json();
    if (!mediaId || !mediaType) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });

    // Création de la clé unique parfaite (ex: tv_1234)
    const itemKey = `${mediaType}_${mediaId}`;
    const legacyKey = String(mediaId); // Au cas où l'ancien bug soit encore en base

    const isPresent = user.watchlist.includes(itemKey) || user.watchlist.includes(legacyKey);

    if (isPresent) {
      // On retire la bonne clé ET l'ancienne clé buggée pour nettoyer la base
      await (User as any).updateOne(
        { email: session.user.email },
        { $pull: { watchlist: { $in: [itemKey, legacyKey] } } }
      );
    } else {
      await (User as any).updateOne(
        { email: session.user.email },
        { $addToSet: { watchlist: itemKey } }
      );
    }

    return NextResponse.json({ success: true, removed: isPresent });
  } catch (error) {
    console.error("Erreur Watchlist API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}