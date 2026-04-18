import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { username, image } = await req.json();
  await connectToDatabase();
  
  // CORRECTION : On ajoute (User as any) pour calmer TypeScript
  await (User as any).findOneAndUpdate(
    { email: session.user.email },
    { username, image }
  );

  return NextResponse.json({ message: "Succès" });
}