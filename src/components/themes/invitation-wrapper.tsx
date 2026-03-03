"use client";

import { useState } from "react";
import MusicPlayer from "./music-player"; // Pastikan path benar
import OpeningModal from "./opening-modal"; // Pastikan path benar
import { InvitationData } from "@/lib/types"; // <--- Import Tipe Data Baru

interface WrapperProps {
  data: InvitationData;
  guestName?: string;
  children: React.ReactNode;
}

export default function InvitationWrapper({
  data,
  guestName,
  children,
}: WrapperProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      {/* 1. GLOBAL MUSIC PLAYER */}
      {/* Otomatis baca url, start, end dari database */}
      <MusicPlayer
        url={data.music_url || ""}
        startTime={data.music_start || 0}
        endTime={data.music_end || 0}
        autoPlay={isOpened}
      />

      {/* 2. GLOBAL OPENING MODAL */}
      {!isOpened && (
        <OpeningModal
          groomName={data.groom_name}
          brideName={data.bride_name}
          coverImage={data.groom_photo || data.bride_photo} // Default cover foto cowok/cewek
          guestName={guestName}
          // Casting tipe string ke tipe spesifik tema
          theme={data.theme as "luxury" | "minimalist"}
          onOpen={() => setIsOpened(true)}
        />
      )}

      {/* 3. KONTEN VISUAL (Tema yang dipilih) */}
      <div
        className={
          isOpened
            ? "animate-in fade-in duration-1000"
            : "h-screen overflow-hidden filter blur-sm"
        }
      >
        {children}
      </div>
    </>
  );
}
