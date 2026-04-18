import mongoose, { Schema, model, models, Document } from "mongoose";

// 1. On définit strictement la structure pour TypeScript
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password?: string;
  image?: string;
  provider: string;
  watchlist: string[];
}

// 2. On applique cette structure au schéma de la base de données
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, unique: true, sparse: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  image: { type: String, default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
  provider: { type: String, default: "credentials" }, 
  watchlist: [{ type: String }] 
}, { timestamps: true });

// 3. On exporte le modèle
const User = models.User || model<IUser>("User", UserSchema);
export default User;