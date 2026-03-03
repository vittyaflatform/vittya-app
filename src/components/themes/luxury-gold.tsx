"use client";

import Image from "next/image";
import {
  MapPin,
  Calendar,
  Clock,
  HeartHandshake,
  PartyPopper,
  Instagram,
  Facebook,
  Music,
  Heart,
  MessageSquare,
  Image as ImageIcon,
  Users, // Tambahkan import ini biar gak error lagi
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GallerySection from "./gallery-section";
import CommentSection from "@/components/invitation/CommentSection";
import { ThemeProps } from "@/lib/types";

export default function LuxuryGold({ data, guestName }: ThemeProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const safeImage = (url: string | undefined) => url || "/logo-Vittya.png";

  const galleryItems =
    data.gallery_photos?.map((p: any) => ({
      id: p.id,
      url: p.photo_url,
      type: p.media_type || "image",
    })) || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-serif overflow-x-hidden pb-24">
      {/* ================= FLOATING NAVBAR ================= */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-white/80 backdrop-blur-lg border border-amber-100 px-6 py-3 rounded-full shadow-2xl flex items-center gap-8 text-amber-700">
        <a href="#home" className="hover:scale-110 transition-transform">
          <Heart size={20} />
        </a>
        <a href="#couple" className="hover:scale-110 transition-transform">
          <Users size={20} />
        </a>
        <a href="#event" className="hover:scale-110 transition-transform">
          <Calendar size={20} />
        </a>
        <a href="#gallery" className="hover:scale-110 transition-transform">
          <ImageIcon size={20} />
        </a>
        <a href="#wishes" className="hover:scale-110 transition-transform">
          <MessageSquare size={20} />
        </a>
      </nav>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative"
      >
        <div className="absolute inset-0 border-[15px] md:border-[30px] border-amber-50 pointer-events-none z-10"></div>

        <p className="text-amber-600 tracking-[0.3em] uppercase text-sm mb-6 animate-in fade-in slide-in-from-top-10 duration-1000">
          The Wedding Of
        </p>

        <h1 className="text-6xl md:text-8xl font-bold text-slate-800 mb-6 drop-shadow-sm">
          {data.groom_name?.split(" ")[0]}{" "}
          <span className="text-amber-500">&</span>{" "}
          {data.bride_name?.split(" ")[0]}
        </h1>

        <p className="text-xl text-slate-600 mb-12 tracking-widest uppercase">
          {formatDate(data.akad_date)}
        </p>

        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-white shadow-2xl overflow-hidden animate-in zoom-in duration-1000">
          <Image
            src={safeImage(data.groom_photo || data.bride_photo)}
            alt="Couple Hero"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* ================= MEMPELAI ================= */}
      <section id="couple" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-bold text-slate-800">Mempelai</h2>
            <div className="w-20 h-1 bg-amber-200 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-20">
            {/* PRIA */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-amber-100 shadow-xl relative">
                <Image
                  src={safeImage(data.groom_photo)}
                  alt="Groom"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">
                {data.groom_name}
              </h3>
              <p className="text-amber-600 font-bold text-sm tracking-widest uppercase">
                {data.groom_order || "Putra"}
              </p>
              <div className="text-slate-500 text-sm">
                <p>Putra dari Bapak {data.groom_father || "..."}</p>
                <p>& Ibu {data.groom_mother || "..."}</p>
              </div>
              <div className="flex gap-4 pt-2">
                {data.groom_ig && (
                  <a
                    href={`https://instagram.com/${data.groom_ig}`}
                    target="_blank"
                  >
                    <Instagram size={18} className="text-slate-400" />
                  </a>
                )}
              </div>
            </div>

            {/* WANITA */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-amber-100 shadow-xl relative">
                <Image
                  src={safeImage(data.bride_photo)}
                  alt="Bride"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">
                {data.bride_name}
              </h3>
              <p className="text-amber-600 font-bold text-sm tracking-widest uppercase">
                {data.bride_order || "Putri"}
              </p>
              <div className="text-slate-500 text-sm">
                <p>Putri dari Bapak {data.bride_father || "..."}</p>
                <p>& Ibu {data.bride_mother || "..."}</p>
              </div>
              <div className="flex gap-4 pt-2">
                {data.bride_ig && (
                  <a
                    href={`https://instagram.com/${data.bride_ig}`}
                    target="_blank"
                  >
                    <Instagram size={18} className="text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ACARA ================= */}
      <section id="event" className="py-24 px-6 bg-amber-50/50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* AKAD */}
          <div className="bg-white p-10 rounded-3xl border border-amber-100 shadow-xl text-center space-y-4">
            <HeartHandshake className="mx-auto text-amber-500" size={40} />
            <h3 className="text-2xl font-bold">Akad Nikah</h3>
            <p className="text-amber-700 font-bold">
              {formatDate(data.akad_date)}
            </p>
            <p className="text-slate-500 text-sm">
              {data.akad_start_time} - Selesai
            </p>
            <div className="pt-4">
              <p className="font-bold text-slate-800">{data.akad_place}</p>
              <p className="text-xs text-slate-400 italic">
                {data.akad_address}
              </p>
            </div>
          </div>
          {/* RESEPSI */}
          <div className="bg-white p-10 rounded-3xl border border-amber-100 shadow-xl text-center space-y-4">
            <PartyPopper className="mx-auto text-amber-500" size={40} />
            <h3 className="text-2xl font-bold">Resepsi</h3>
            <p className="text-amber-700 font-bold">
              {formatDate(data.reception_date)}
            </p>
            <p className="text-slate-500 text-sm">
              {data.reception_start_time} - Selesai
            </p>
            <div className="pt-4">
              <p className="font-bold text-slate-800">{data.reception_place}</p>
              <p className="text-xs text-slate-400 italic">
                {data.reception_address}
              </p>
            </div>
          </div>
        </div>
      </section>

      <GallerySection items={galleryItems} />

      <section id="wishes" className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <CommentSection invitationId={data.id} />
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-white text-center">
        <p className="text-sm opacity-50">© 2026 Vittya Platform</p>
      </footer>
    </div>
  );
}
