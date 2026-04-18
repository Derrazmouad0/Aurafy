"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ReviewSection({ mediaId }: { mediaId: string }) {
  const { data: session } = useSession();
  const isEnglish = useSearchParams().get("lang") === "en";
  const [reviews, setReviews] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les commentaires au démarrage
  useEffect(() => {
    fetch(`/api/reviews?mediaId=${mediaId}`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []));
  }, [mediaId]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId, rating, comment })
    });
    
    if (res.ok) {
      const newReview = await res.json();
      setReviews([newReview, ...reviews]); // Ajoute le nouveau commentaire en haut
      setComment("");
    }
    setIsSubmitting(false);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
        <span className="w-1 h-6 bg-accentBlue rounded-full"></span>
        {isEnglish ? "Community Reviews" : "Avis de la communauté"}
      </h2>
      
      <div className="space-y-6">
        {/* Boîte de publication (Seulement si connecté) */}
        {session ? (
          <div className="glass-panel p-6 rounded-[24px] border border-white/5 shadow-lg bg-uiGray/50">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isEnglish ? "Share your thoughts..." : "Partagez votre avis sur ce contenu..."}
              className="w-full bg-deepBlack/80 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-signaturePurple transition-colors"
              rows={3}
            />
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRating(star)} className={`text-xl transition-colors ${star <= rating ? 'text-signaturePurple' : 'text-textGray'}`}>★</button>
                ))}
              </div>
              <button onClick={handleSubmit} disabled={isSubmitting || !comment.trim()} className="px-6 py-2 bg-signaturePurple rounded-full text-sm font-bold disabled:opacity-50 hover:bg-signaturePurple/80 transition-colors">
                {isSubmitting ? "..." : (isEnglish ? "Publish" : "Publier")}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-[24px] border border-white/5 bg-uiGray/30 text-center text-textGray text-sm">
            {isEnglish ? "Log in to leave a review." : "Connectez-vous pour laisser un avis."}
          </div>
        )}
        
        {/* Liste des avis sauvegardés */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
             <p className="text-textGray italic text-sm">{isEnglish ? "No reviews yet. Be the first!" : "Aucun avis pour l'instant. Soyez le premier !"}</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-6 border border-white/5 rounded-2xl bg-uiGray/20 flex gap-4 animate-fade-in">
                <div className="relative w-12 h-12 rounded-full flex-shrink-0 border border-signaturePurple/30 overflow-hidden bg-deepBlack">
                  <Image src={rev.userImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="avatar" fill unoptimized />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm text-white">{rev.userName || "Utilisateur"}</p>
                    <span className="text-textGray text-xs">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-signaturePurple text-xs mb-2">
                    {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                  </div>
                  <p className="text-textGray text-sm font-light leading-relaxed">{rev.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}