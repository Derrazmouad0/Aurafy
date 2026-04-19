import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";
import Review from "../../../../models/Review";

export async function DELETE() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    
    // 1. Suppression du compte de la base de données (Avec protection TS)
    await (User as any).deleteOne({ email: session.user.email });
    
    // 2. Suppression de tous les commentaires laissés par cet utilisateur (Avec protection TS)
    await (Review as any).deleteMany({ userEmail: session.user.email });

    return NextResponse.json({ success: true, message: "Compte supprimé définitivement" });
  } catch (error) {
    console.error("Erreur Suppression de compte:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}