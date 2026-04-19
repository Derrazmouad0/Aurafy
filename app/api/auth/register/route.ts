import { NextResponse } from "next/server";
// CORRECTION ICI : On utilise "* as" pour importer bcryptjs proprement en TypeScript
import * as bcrypt from "bcryptjs"; 
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    const { name, username, email, password, image } = await req.json();
    
    if (!name || !username || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    await connectToDatabase();
    
    // CORRECTION : On force TypeScript à accepter findOne
    const existingUser = await (User as any).findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ error: "Cet email ou nom d'utilisateur est déjà pris." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // CORRECTION : On force TypeScript à accepter la création (new)
    const newUser = new (User as any)({
      name,
      username,
      email,
      password: hashedPassword,
      image: image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      provider: "credentials"
    });

    await newUser.save();
    
    return NextResponse.json({ message: "Compte créé avec succès !" }, { status: 201 });
  } catch (error) {
    console.error("Erreur Inscription:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création du compte." }, { status: 500 });
  }
}