"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function ProfileContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEnglish = searchParams ? searchParams.get("lang") === "en" : false;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(isEnglish ? "/?lang=en" : "/");
    }
  }, [status, router, isEnglish]);

  const handleDeleteAccount = async () => {
    const confirmMessage = isEnglish 
      ? "Are you sure? This action is irreversible and all your data will be deleted." 
      : "Êtes-vous sûr ? Cette action est irréversible et toutes vos données (Watchlist, Avis) seront effacées.";
      
    if (window.confirm(confirmMessage)) {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        signOut({ callbackUrl: '/' }); 
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deepBlack">
        <div className="w-10 h-10 border-4 border-signaturePurple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <main className="min-h-screen bg-deepBlack pt-32 pb-24 text-white">
      <div className="max-w-[800px] mx-auto px-6 animate-fade-in">
        
        <div className="glass-panel rounded-[32px] p-10 md:p-16 border border-white/10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-signaturePurple/20 to-accentBlue/20"></div>

          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-deepBlack mb-6 overflow-hidden shadow-[0_0_30px_rgba(155,34,214,0.5)] z-10 bg-uiGray">
            <Image 
              src={session.user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
              alt="Avatar" 
              fill 
              className="object-cover" 
              unoptimized 
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight z-10">
            {session.user.name}
          </h1>
          
          <p className="text-signaturePurple font-bold text-lg mb-2 z-10">
            @{(session.user as any)?.username || "utilisateur"}
          </p>
          
          <p className="text-textGray mb-10 z-10 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            {session.user.email}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
            <Link 
              href={`/profile/setup${isEnglish ? '?lang=en' : ''}`} 
              className="px-8 py-4 bg-uiGray hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              {isEnglish ? "Edit Avatar" : "Modifier mon avatar"}
            </Link>
            
            <Link 
              href={`/watchlist${isEnglish ? '?lang=en' : ''}`} 
              className="px-8 py-4 bg-signaturePurple hover:bg-signaturePurple/80 rounded-2xl font-bold transition-all glow-purple hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {isEnglish ? "My Watchlist" : "Ma Watchlist"}
            </Link>
          </div>

          <button 
            onClick={handleDeleteAccount}
            className="mt-12 z-10 px-6 py-3 border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl text-sm font-bold transition-colors"
          >
            {isEnglish ? "Delete my account" : "Supprimer mon compte définitivement"}
          </button>

        </div>
      </div>
    </main>
  );
}

// Composant principal parfaitement propre et standardisé
export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-deepBlack" />;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-deepBlack" />}>
      <ProfileContent />
    </Suspense>
  );
}