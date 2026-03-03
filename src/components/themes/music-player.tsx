"use client";

import { useState, useRef, useEffect } from "react";
import { Disc, Music, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MusicPlayerProps {
  url: string;
  startTime?: number; // Detik mulai
  endTime?: number; // Detik selesai
  autoPlay?: boolean; // Trigger dari tombol "Buka Undangan"
}

export default function MusicPlayer({
  url,
  startTime = 0,
  endTime = 0,
  autoPlay = false,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // LOGGING: Cek apakah URL masuk?
  useEffect(() => {
    if (url) {
      console.log("🎵 Music Player Loaded. URL:", url);
      console.log("🎵 AutoPlay Status:", autoPlay);
    } else {
      console.warn("⚠️ Music URL is EMPTY!");
    }
  }, [url, autoPlay]);

  // --- LOGIC 1: PLAY OTOMATIS SAAT TOMBOL "BUKA" DIKLIK ---
  useEffect(() => {
    if (autoPlay && url && audioRef.current) {
      console.log("▶️ Mencoba AutoPlay...");

      // Set Start Time
      if (audioRef.current.currentTime === 0 && startTime > 0) {
        audioRef.current.currentTime = startTime;
      }

      // Force Play
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("✅ Audio Playing!");
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("❌ AutoPlay Blocked by Browser:", error);
            // Browser memblokir karena dianggap belum ada interaksi user
          });
      }
    }
  }, [autoPlay, url, startTime]);

  // --- LOGIC 2: HANDLE LOOPING (End Time) ---
  const handleTimeUpdate = () => {
    if (endTime > 0 && audioRef.current) {
      if (audioRef.current.currentTime >= endTime) {
        // Balik ke start time
        audioRef.current.currentTime = startTime;
        audioRef.current.play();
      }
    }
  };

  // --- LOGIC 3: TOGGLE MANUAL ---
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!url) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* HTML AUDIO TAG (HIDDEN) */}
      <audio
        ref={audioRef}
        src={url}
        loop={endTime === 0} // Loop native kalau gak ada end time custom
        onTimeUpdate={handleTimeUpdate}
        preload="auto"
      />

      {/* TOMBOL PIRINGAN HITAM */}
      <Button
        onClick={togglePlay}
        size="icon"
        className={cn(
          "rounded-full w-12 h-12 shadow-xl border-2 border-white transition-all duration-500 flex items-center justify-center",
          isPlaying
            ? "bg-amber-500 hover:bg-amber-600 animate-spin-slow"
            : "bg-slate-800 hover:bg-slate-700",
        )}
        style={{ animationDuration: "3s" }}
      >
        {isPlaying ? (
          <Disc
            size={24}
            className={cn("text-white", isPlaying && "animate-spin")}
          />
        ) : (
          <Music size={20} className="text-white" />
        )}
      </Button>
    </div>
  );
}
