import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import * as bcrypt from "bcryptjs"; 
// CORRECTION DES CHEMINS ICI (4 niveaux au lieu de 5)
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }
        
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        
        if (!user || !user.password) {
          throw new Error("Email ou mot de passe incorrect");
        }
        
        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) {
          throw new Error("Email ou mot de passe incorrect");
        }
        
        return user;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        
        // Si c'est la première connexion Google, on crée le compte dans MongoDB
        if (!existingUser) {
          const newUser = new User({
            name: user.name,
            username: user.email?.split('@')[0], 
            email: user.email,
            image: user.image,
            provider: "google"
          });
          await newUser.save();
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        await connectToDatabase();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.image = dbUser.image;
          token.username = dbUser.username;
        }
      }
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.image = token.image as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" } 
});

export { handler as GET, handler as POST };