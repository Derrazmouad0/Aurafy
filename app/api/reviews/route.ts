import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "../../../lib/mongodb";
import Review from "../../../models/Review";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mediaId = searchParams.get("mediaId");
  if (!mediaId) return NextResponse.json({ reviews: [] });
  
  await connectToDatabase();
  // CORRECTION : On force TypeScript à accepter find
  const reviews = await (Review as any).find({ mediaId: String(mediaId) }).sort({ createdAt: -1 });
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { mediaId, rating, comment } = await req.json();
  await connectToDatabase();
  
  // CORRECTION : On force TypeScript à accepter la création (new)
  const newReview = new (Review as any)({
    userEmail: session.user.email,
    userName: session.user.name,
    userImage: session.user.image,
    mediaId: String(mediaId),
    rating,
    comment
  });
  
  await newReview.save();
  return NextResponse.json(newReview);
}