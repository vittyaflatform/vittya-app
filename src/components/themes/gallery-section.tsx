"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  PlayCircle,
  Video,
  Grid,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- TIPE DATA ---
export interface GalleryItem {
  id: string;
  url: string;
  type: "image" | "video";
}

interface GallerySectionProps {
  items: GalleryItem[];
}

// --- HELPER: CLOUDINARY OPTIMIZER (LOGIC NETFLIX) ---
const getOptimizedUrl = (
  url: string,
  type: "image" | "video",
  mode: "thumbnail_static" | "thumbnail_hover" | "fullscreen",
) => {
  if (!url || !url.includes("cloudinary.com")) return url;

  let transformation = "";

  if (type === "video") {
    if (mode === "thumbnail_static") {
      // 1. STATIS (GAMBAR): Ambil frame detik ke-0, jadiin JPG. Ringan banget!
      transformation = "f_jpg,so_0,w_500,q_auto,c_limit";
    } else if (mode === "thumbnail_hover") {
      // 2. HOVER (PREVIEW): MP4 Kecil (400px), Tanpa Suara, Quality Eco. Instan Play!
      transformation = "f_mp4,w_400,q_auto:eco,ac_none,vc_auto,c_limit";
    } else {
      // 3. FULLSCREEN (NONTON): MP4 HD (720p), Quality Good.
      transformation = "f_mp4,w_1280,q_auto:good,vc_auto,c_limit";
    }
  } else {
    // FOTO BIASA
    if (mode === "fullscreen") transformation = "f_auto,q_auto,w_1920,c_limit";
    else transformation = "f_auto,q_auto,w_600,c_limit";
  }

  // Hack: Kalau minta gambar statis dari video, ganti ekstensi file jadi .jpg
  // Biar Cloudinary/Browser gak bingung cache-nya.
  let cleanUrl = url;
  if (type === "video" && mode === "thumbnail_static") {
    cleanUrl = cleanUrl.replace(/\.[^/.]+$/, ".jpg");
  }

  return cleanUrl.replace("/upload/", `/upload/${transformation}/`);
};

// --- SUB-COMPONENT: VIDEO THUMBNAIL (HOVER EFFECT) ---
// Kita pisah komponen ini biar state 'isHovered' gak bikin re-render satu halaman
const VideoThumbnail = ({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // URL Gambar Diam (Ringan)
  const staticUrl = getOptimizedUrl(item.url, "video", "thumbnail_static");
  // URL Video Preview (Resolusi Kecil untuk Hover)
  const hoverUrl = getOptimizedUrl(item.url, "video", "thumbnail_hover");

  return (
    <div
      className="relative w-full h-full bg-slate-900 cursor-pointer group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* LAYER 1: GAMBAR STATIS (Selalu ada di bawah) */}
      <Image
        src={staticUrl}
        alt="Video Thumb"
        fill
        className={cn(
          "object-cover transition-opacity duration-500",
          isHovered ? "opacity-0" : "opacity-100", // Fade out pas video play
        )}
        unoptimized
      />

      {/* LAYER 2: VIDEO HOVER (Muncul & Play pas di-hover) */}
      {isHovered && (
        <div className="absolute inset-0 bg-black animate-in fade-in duration-300">
          <video
            src={hoverUrl}
            className="w-full h-full object-cover opacity-90"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      )}

      {/* ICON & BADGE (Hilang pas di-hover biar bersih) */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          isHovered ? "opacity-0 scale-110" : "opacity-100 scale-100",
        )}
      >
        <div className="bg-black/30 p-3 rounded-full backdrop-blur-sm border border-white/20">
          <PlayCircle size={32} className="text-white drop-shadow-md" />
        </div>
      </div>

      <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded flex items-center gap-1 font-bold pointer-events-none backdrop-blur-sm z-10 border border-white/10">
        <Video size={10} /> VIDEO
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function GallerySection({ items }: GallerySectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayItems = items && items.length > 0 ? items : [];

  const nextItem = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  }, [displayItems.length]);

  const prevItem = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayItems.length) % displayItems.length,
    );
  }, [displayItems.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextItem, prevItem]);

  return (
    <section className="py-20 px-4 bg-white" id="gallery">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-2">
          <p className="text-amber-600 tracking-[0.2em] uppercase text-xs font-bold animate-in slide-in-from-bottom-2">
            Captured Moments
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-800">
            Galeri Foto & Video
          </h2>
          <div className="w-20 h-0.5 bg-amber-200 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* --- GRID MASONRY --- */}
        {displayItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            <Grid size={48} className="mx-auto mb-2 opacity-20" />
            <p>Belum ada momen yang dibagikan.</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {displayItems.map((item, idx) => (
              <div
                key={item.id}
                className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden bg-slate-100 mb-4 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                {item.type === "video" ? (
                  // PAKE COMPONENT VIDEO BARU (HOVER EFFECT)
                  <div className="aspect-[3/4] relative bg-slate-900">
                    <VideoThumbnail
                      item={item}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsOpen(true);
                      }}
                    />
                  </div>
                ) : (
                  // IMAGE BIASA
                  <div
                    className="relative"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsOpen(true);
                    }}
                  >
                    <Image
                      src={getOptimizedUrl(
                        item.url,
                        "image",
                        "thumbnail_static",
                      )}
                      alt={`Gallery ${idx}`}
                      width={600}
                      height={800}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ZoomIn className="text-white drop-shadow-md" size={24} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- FULLSCREEN MODAL --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50 backdrop-blur-sm"
          >
            <X size={24} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-10">
            {(() => {
              const currentItem = displayItems[currentIndex];
              // URL FULLSCREEN (Video Beneran)
              const fullUrl = getOptimizedUrl(
                currentItem.url,
                currentItem.type,
                "fullscreen",
              );

              return currentItem.type === "video" ? (
                <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl flex items-center justify-center border border-white/10">
                  <video
                    src={fullUrl}
                    className="w-full h-full max-h-[80vh]"
                    controls
                    autoPlay
                    playsInline
                  />
                </div>
              ) : (
                <div className="relative w-full h-full max-h-[85vh] aspect-[3/4] md:aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={fullUrl}
                    alt="Gallery Full"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
              );
            })()}

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevItem();
              }}
              className="absolute left-2 md:left-8 text-white p-3 bg-black/20 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm z-50"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextItem();
              }}
              className="absolute right-2 md:right-8 text-white p-3 bg-black/20 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm z-50"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Thumbnail Strip (Bawah) */}
          <div className="absolute bottom-6 left-0 right-0 h-20 flex justify-center items-center gap-3 overflow-x-auto px-4 hide-scrollbar z-50">
            {displayItems.map((item, i) => {
              // Strip pakai gambar statis biar enteng
              const stripUrl = getOptimizedUrl(
                item.url,
                item.type,
                "thumbnail_static",
              );
              return (
                <div
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "relative w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all bg-slate-900 shadow-lg",
                    i === currentIndex
                      ? "border-amber-500 opacity-100 scale-110 shadow-amber-500/20"
                      : "border-transparent opacity-50 hover:opacity-100 grayscale hover:grayscale-0",
                  )}
                >
                  <Image
                    src={stripUrl}
                    alt="thumb"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <PlayCircle size={16} className="text-white/80" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
