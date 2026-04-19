"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// 6 Avatars dynamiques parfaits pour Aurafy
const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lola&backgroundColor=ffb8b8",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=b6e3f4"
];

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // États du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isLogin) {
      // LOGIQUE DE CONNEXION
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Email ou mot de passe incorrect.");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh(); // Actualise la barre de nav pour montrer l'avatar
      }
    } else {
      // LOGIQUE D'INSCRIPTION
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, username, email, password, image: selectedAvatar }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || "Une erreur est survenue.");
          setIsLoading(false);
        } else {
          // Si inscription réussie, on connecte l'utilisateur automatiquement
          await signIn("credentials", { redirect: false, email, password });
          router.push("/");
          router.refresh();
        }
      } catch (err) {
        setError("Erreur de connexion au serveur.");
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="min-h-screen bg-deepBlack flex relative overflow-hidden">
      {/* Background Image (Style Netflix) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg" // L'image de Dune qu'on a sur l'accueil
          alt="Background" 
          fill 
          className="object-cover opacity-30"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deepBlack via-deepBlack/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-deepBlack via-deepBlack/50 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center px-6 py-12">
        {/* Logo */}
        <Link href="/" className="mb-8 flex justify-center">
          <span className="text-4xl font-black tracking-tighter text-white drop-shadow-lg">
            AURA<span className="text-signaturePurple glow-purple">FY</span>
          </span>
        </Link>

        {/* Formulaire Glassmorphism */}
        <div className="glass-panel p-8 md:p-10 rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-xl bg-deepBlack/60">
          <h2 className="text-3xl font-bold text-white mb-6">
            {isLogin ? "Bon retour" : "Créer un univers"}
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-4 animate-fade-in">
                {/* Choix de l'avatar */}
                <div>
                  <label className="block text-sm font-bold text-textGray mb-3">Choisissez votre Avatar</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {AVATARS.map((avatar, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`relative w-14 h-14 flex-shrink-0 rounded-full cursor-pointer transition-all duration-300 ${selectedAvatar === avatar ? 'ring-4 ring-signaturePurple scale-110' : 'opacity-50 hover:opacity-100'}`}
                      >
                        <Image src={avatar} alt={`Avatar ${idx}`} fill className="rounded-full" unoptimized />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-textGray uppercase tracking-widest mb-1">Prénom / Nom</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-uiGray/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-signaturePurple focus:outline-none transition-colors" placeholder="Alexandre" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textGray uppercase tracking-widest mb-1">Pseudo</label>
                    <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-uiGray/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-signaturePurple focus:outline-none transition-colors" placeholder="Alex_99" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-textGray uppercase tracking-widest mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-uiGray/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-signaturePurple focus:outline-none transition-colors" placeholder="nom@exemple.com" />
            </div>

            <div>
              <label className="block text-xs font-bold text-textGray uppercase tracking-widest mb-1">Mot de passe</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-uiGray/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-signaturePurple focus:outline-none transition-colors" placeholder="••••••••" />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 mt-6 bg-signaturePurple text-white font-bold rounded-xl glow-purple hover:bg-signaturePurple/80 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : (isLogin ? "Se connecter" : "S'inscrire")}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs font-bold text-textGray uppercase tracking-widest">OU</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Bouton Google */}
          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            className="w-full mt-6 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex justify-center items-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuer avec Google
          </button>

          <div className="mt-8 text-center">
            <p className="text-textGray text-sm">
              {isLogin ? "Nouveau sur Aurafy ?" : "Déjà un compte ?"}
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-white font-bold hover:text-signaturePurple transition-colors">
                {isLogin ? "Inscrivez-vous" : "Connectez-vous"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}