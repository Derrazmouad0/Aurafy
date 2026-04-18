"use client";

import { useState } from "react";
import VideoPlayerModal from "./VideoPlayerModal";

export default function PlayButton({ 
  mediaType, 
  mediaId, 
  isEnglish 
}: { 
  mediaType: string, 
  mediaId: string, 
  isEnglish: boolean 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="px-8 py-4 bg-signaturePurple text-white font-bold rounded-2xl flex items-center gap-3 glow-purple hover:scale-105 active:scale-95 transition-all shadow-lg"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5.14v14l11-7-11-7z"/>
        </svg>
        {isEnglish ? "Play" : "Lecture"}
      </button>

      {isOpen && (
        <VideoPlayerModal 
          mediaType={mediaType} 
          mediaId={mediaId} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}