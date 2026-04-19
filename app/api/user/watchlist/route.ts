import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";

// Récupérer la Watchlist de l'utilisateur
export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ watchlist: [] });
  
  await connectToDatabase();
  const user = await (User as any).findOne({ email: session.user.email });
  return NextResponse.json({ watchlist: user?.watchlist || [] });
}

// Ajouter ou Retirer un film de la Watchlist
export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { mediaId } = await req.json();
  await connectToDatabase();
  
  const user = await (User as any).findOne({ email: session.user.email });
  const inWatchlist = user.watchlist.includes(String(mediaId));

  if (inWatchlist) {
    user.watchlist = user.watchlist.filter((id: string) => id !== String(mediaId));
  } else {
    user.watchlist.push(String(mediaId));
  }
  
  await user.save();
  return NextResponse.json({ inWatchlist: !inWatchlist });
}