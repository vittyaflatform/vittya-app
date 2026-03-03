"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  photos: string[]; // Array URL Foto
  theme?: "luxury" | "minimalist";
}

export default function GalleryGrid({
  photos,
  theme = "luxury",
}: GalleryGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Jika tidak ada foto, tidak perlu render section ini
  if (!photos || photos.length === 0) return null;

  return (
    <section
      className={cn(
        "py-20 px-6",
        theme === "luxury" ? "bg-white" : "bg-slate-50",
      )}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* JUDUL SECTION */}
        <div className="text-center space-y-2 animate-in slide-in-from-bottom-4 duration-700">
          <h2
            className={cn(
              "text-3xl font-bold",
              theme === "luxury"
                ? "font-serif text-amber-700"
                : "font-sans text-slate-900",
            )}
          >
            Momen Bahagia
          </h2>
          <p className="text-slate-500 text-sm tracking-wide uppercase">
            Our Pre-wedding Gallery
          </p>
        </div>

        {/* GRID LAYOUT */}
        {/* Menggunakan CSS Grid dengan variasi kolom sesuai layar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {photos.map((url, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(url)}
              className={cn(
                "group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500",
                // Opsi: Foto pertama dibuat besar (Featured) agar tidak monoton
                // Hapus baris di bawah ini jika ingin semua kotak sama ukurannya
                idx === 0 && photos.length > 2 ? "col-span-2 row-span-2" : "",
              )}
            >
              <Image
                src={url}
                alt={`Gallery photo ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              {/* Overlay Hover Effect */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 p-3 rounded-full text-slate-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <ZoomIn size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL (ZOOM FOTO) */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedPhoto(null)} // Klik luar buat close
        >
          {/* Tombol Close */}
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
            onClick={() => setSelectedPhoto(null)}
          >
            <X size={32} />
          </button>

          {/* Container Gambar */}
          <div
            className="relative w-full max-w-5xl h-[85vh] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // Biar klik gambar gak close
          >
            <Image
              src={selectedPhoto}
              alt="Full Preview"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
