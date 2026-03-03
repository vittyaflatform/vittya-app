import { Button } from "@/components/ui/button";
import { ThemeProps } from "@/lib/types"; // <--- Pakai Type Global
import { ArrowRight, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import GalleryGrid from "./gallery-grid";
import GuestBook from "./guest-book";

export default function MinimalistWhite({ data, guestName }: ThemeProps) {
  // Helper Format Tanggal
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper Fallback Image
  const safeImage = (url: string) => url || "/logo-Vittya.png";

  // Ambil URL Galeri
  const galleryUrls = data.gallery_photos?.map((p) => p.photo_url) || [];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-200">
      {/* TIDAK PERLU OPENING MODAL DI SINI (Sudah di Wrapper) */}

      {/* === HERO SECTION === */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-20 max-w-6xl mx-auto relative">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 z-10">
          <p className="text-sm font-medium tracking-widest text-slate-500 uppercase">
            The Wedding Of
          </p>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
            {data.groom_name?.split(" ")[0] || "Groom"} <br />
            <span className="text-slate-300">&</span>{" "}
            {data.bride_name?.split(" ")[0] || "Bride"}
          </h1>

          <div className="h-1 w-20 bg-slate-900 my-8" />

          <p className="text-xl md:text-2xl font-light text-slate-600">
            {formatDate(data.akad_date)}
          </p>
        </div>

        {/* Gambar Samping (Absolute di Desktop) */}
        <div className="mt-12 md:absolute md:right-0 md:top-0 md:h-screen md:w-1/3 bg-slate-100 relative overflow-hidden h-[50vh]">
          <Image
            src={safeImage(data.bride_photo || data.groom_photo)} // Pakai salah satu foto buat cover
            alt="Couple"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            priority
          />
        </div>
      </section>

      {/* === MEMPELAI === */}
      <section className="py-24 px-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Pria */}
          <div className="space-y-4 text-center md:text-left">
            <div className="aspect-3/4 relative bg-slate-100 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
              <Image
                src={safeImage(data.groom_photo)}
                alt="Groom"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight">
                {data.groom_name}
              </h3>
              <p className="text-slate-500 mt-2 text-sm">
                Putra Bapak Fulan & Ibu Fulanah
              </p>
            </div>
          </div>

          {/* Wanita */}
          <div className="space-y-4 md:mt-24 text-center md:text-left">
            <div className="aspect-3/4 relative bg-slate-100 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
              <Image
                src={safeImage(data.bride_photo)}
                alt="Bride"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight">
                {data.bride_name}
              </h3>
              <p className="text-slate-500 mt-2 text-sm">
                Putri Bapak Fulan & Ibu Fulanah
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === ACARA === */}
      <section className="py-24 bg-slate-50 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Akad */}
          <div className="space-y-6 border-l-2 border-slate-900 pl-8 hover:pl-10 transition-all duration-300">
            <h3 className="text-4xl font-bold tracking-tighter">Akad Nikah</h3>
            <div className="space-y-1">
              <p className="text-xl text-slate-600 font-medium">
                {formatDate(data.akad_date)}
              </p>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock size={16} />
                <p>
                  {data.akad_start_time} - {data.akad_end_time || "Selesai"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <MapPin size={16} />
                <p>{data.akad_place}</p>
              </div>
              <p className="text-sm text-slate-500">{data.akad_address}</p>
            </div>

            <Button
              variant="outline"
              className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-none"
              asChild
            >
              <a href={data.akad_map_link} target="_blank">
                Lihat Lokasi <ArrowRight className="ml-2" size={16} />
              </a>
            </Button>
          </div>

          {/* Resepsi */}
          <div className="space-y-6 border-l-2 border-slate-900 pl-8 hover:pl-10 transition-all duration-300">
            <h3 className="text-4xl font-bold tracking-tighter">Resepsi</h3>
            <div className="space-y-1">
              <p className="text-xl text-slate-600 font-medium">
                {formatDate(data.reception_date)}
              </p>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock size={16} />
                <p>
                  {data.reception_start_time} -{" "}
                  {data.reception_end_time || "Selesai"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <MapPin size={16} />
                <p>{data.reception_place}</p>
              </div>
              <p className="text-sm text-slate-500">{data.reception_address}</p>
            </div>

            <Button
              variant="outline"
              className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-none"
              asChild
            >
              <a href={data.reception_map_link} target="_blank">
                Lihat Lokasi <ArrowRight className="ml-2" size={16} />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* === GALERI & BUKU TAMU === */}
      {/* Menggunakan theme='minimalist' agar stylingnya menyesuaikan */}
      <GalleryGrid photos={galleryUrls} theme="minimalist" />
      <GuestBook
        invitationId={data.id}
        defaultName={guestName}
        theme="minimalist"
      />

      <footer className="py-12 text-center text-xs tracking-widest text-slate-300 uppercase">
        Created with Vittya Platform
      </footer>
    </div>
  );
}
