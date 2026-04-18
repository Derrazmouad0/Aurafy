import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "../../../lib/mongodb";
import Review from "../../../models/Review";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mediaId = searchParams.get("mediaId");
  if (!mediaId) return NextResponse.json({ reviews: [] });
  
  await connectToDatabase();
  const reviews = await Review.find({ mediaId: String(mediaId) }).sort({ createdAt: -1 });
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { mediaId, rating, comment } = await req.json();
  await connectToDatabase();
  
  const newReview = new Review({
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