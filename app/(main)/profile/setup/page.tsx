"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lola&backgroundColor=ffb8b8",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=b6e3f4"
];

// COMPOSANT ENFANT : Caché aux yeux de Vercel pendant l'installation
function SetupForm() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [isEnglish, setIsEnglish] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [loading, setLoading] = useState(false);

  // On lit l'URL manuellement et en toute sécurité
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEnglish(params.get("lang") === "en");
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch("/api/user/update-profile", {
      method: "POST",
      body: JSON.stringify({ username, image: selectedAvatar }),
    });

    if (res.ok) {
      await update({ image: selectedAvatar, username }); 
      router.push(isEnglish ? "/?lang=en" : "/");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-deepBlack flex items-center justify-center pt-20">
      <div className="glass-panel p-10 rounded-[32px] max-w-md w-full text-center border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-2">{isEnglish ? "Welcome!" : "Bienvenue !"}</h1>
        <p className="text-textGray mb-8">{isEnglish ? "Personalize your universe" : "Personnalisez votre univers"}</p>

        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {AVATARS.map((av, i) => (
            <button key={i} onClick={() => setSelectedAvatar(av)} className={`relative w-16 h-16 rounded-full overflow-hidden border-4 transition-all ${selectedAvatar === av ? 'border-signaturePurple scale-110 glow-purple' : 'border-transparent opacity-50'}`}>
              <Image src={av} alt="avatar" fill unoptimized />
            </button>
          ))}
        </div>

        <input 
          type="text" 
          placeholder={isEnglish ? "Your Username" : "Votre pseudo"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-uiGray border border-white/10 rounded-xl px-4 py-3 text-white mb-6 focus:border-signaturePurple outline-none"
        />

        <button 
          onClick={handleSave}
          disabled={loading || !username}
          className="w-full py-4 bg-signaturePurple text-white font-bold rounded-xl glow-purple disabled:opacity-50"
        >
          {loading ? "..." : (isEnglish ? "Start Exploring" : "Commencer l'exploration")}
        </button>
      </div>
    </main>
  );
}

// COMPOSANT PARENT : Celui que Vercel voit
export default function ProfileSetup() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Vercel ne lira QUE cette ligne et ignorera tout le reste du fichier !
  if (!isMounted) return <div className="min-h-screen bg-deepBlack" />;

  return <SetupForm />;
}