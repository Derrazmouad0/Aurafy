"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning empêche les extensions (mots de passe, traducteurs) de faire planter le site
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-deepBlack" suppressHydrationWarning>
        <SessionProvider>
          <Navbar />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}