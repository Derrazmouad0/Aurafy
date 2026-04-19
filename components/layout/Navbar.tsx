"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

function NavbarContent() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const isEnglish = searchParams?.get("lang") === "en";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    isEnglish ? params.delete("lang") : params.set("lang", "en");
    router.push(`${pathname}?${params.toString()}`);
  };

  const langQuery = isEnglish ? "?lang=en" : "";

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? "bg-deepBlack/80 backdrop-blur-lg border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        
        <Link href={`/${langQuery}`} className="flex items-center gap-2 group">
          <span className="text-3xl font-black tracking-tighter text-white">AURA<span className="text-signaturePurple group-hover:glow-purple transition-all">FY</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium text-sm">
          {['/', '/movies', '/series', '/anime', '/watchlist'].map((path) => (
            <Link key={path} href={`${path}${langQuery}`} className={`relative transition-colors ${pathname === path ? "text-white" : "text-textGray hover:text-white"}`}>
              {path === '/' ? (isEnglish ? 'Home' : 'Accueil') : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
              {pathname === path && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-signaturePurple rounded-full glow-purple" />}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 relative">
          <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-textGray">
            <span className={!isEnglish ? "text-white" : ""}>FR</span>|<span className={isEnglish ? "text-white" : ""}>EN</span>
          </button>

          <Link href={`/search${langQuery}`} className="p-2 text-white hover:text-signaturePurple transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </Link>
          
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="relative w-10 h-10 rounded-full border-2 border-signaturePurple/30 hover:border-signaturePurple transition-all overflow-hidden"
              >
                <Image src={session.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" fill className="object-cover" unoptimized />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-4 w-48 bg-uiGray border border-white/10 rounded-2xl shadow-2xl py-2 animate-fade-in backdrop-blur-xl">
                  <div className="px-4 py-2 border-b border-white/5 mb-2">
                    <p className="text-white font-bold text-sm truncate">{session.user?.name}</p>
                    <p className="text-textGray text-[10px] truncate">@{(session.user as any)?.username || 'user'}</p>
                  </div>
                  <Link href={`/profile${langQuery}`} className="block px-4 py-2 text-sm text-textGray hover:text-white hover:bg-white/5 transition-colors">
                    {isEnglish ? 'My Profile' : 'Mon Profil'}
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    {isEnglish ? 'Logout' : 'Déconnexion'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href={`/login${langQuery}`} className="px-6 py-2.5 bg-signaturePurple text-white text-sm font-bold rounded-full glow-purple hover:scale-105 transition-all">
              {isEnglish ? 'Login' : 'Connexion'}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<nav className="fixed top-0 w-full z-[100] bg-transparent py-6" />}>
      <NavbarContent />
    </Suspense>
  );
}