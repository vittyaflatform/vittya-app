"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Check, LayoutTemplate, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan punya utils ini (bawaan shadcn)

// DAFTAR TEMA (Nanti bisa ditambah)
const THEMES = [
  {
    id: "luxury",
    name: "Luxury Gold",
    description: "Elegan, mewah, dengan sentuhan emas.",
    color: "bg-amber-100", // Ganti jadi url gambar nanti
    border: "border-amber-500",
  },
  {
    id: "minimalist",
    name: "Minimalist White",
    description: "Bersih, simpel, dan modern.",
    color: "bg-slate-100",
    border: "border-slate-800",
  },
  {
    id: "rustic",
    name: "Rustic Wood",
    description: "Hangat, natural, bernuansa kayu & daun.",
    color: "bg-orange-100",
    border: "border-orange-600",
  },
  {
    id: "floral",
    name: "Floral Pink",
    description: "Romantis dengan hiasan bunga lembut.",
    color: "bg-pink-100",
    border: "border-pink-500",
  },
];

export default function ThemePage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("");
  const [fetching, setFetching] = useState(true);

  // 1. CEK TEMA SAAT INI
  useEffect(() => {
    const getData = async () => {
      if (!projectId) return;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("invitations")
        .select("theme")
        .eq("id", projectId)
        .eq("user_id", user.id)
        .single();

      if (data) {
        setCurrentTheme(data.theme || "luxury"); // Default Luxury kalau belum pilih
      }
      setFetching(false);
    };
    getData();
  }, [projectId, supabase]);

  // 2. FUNGSI GANTI TEMA
  const handleSelectTheme = async (themeId: string) => {
    setLoading(true);
    // Optimistic UI (Langsung ubah di layar biar cepet rasanya)
    setCurrentTheme(themeId);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("invitations")
      .update({ theme: themeId })
      .eq("id", projectId)
      .eq("user_id", user.id);

    if (!error) {
      router.refresh();
      // Gak perlu alert biar UX-nya smooth kayak ganti baju
    } else {
      alert("Gagal mengganti tema: " + error.message);
    }
    setLoading(false);
  };

  if (fetching)
    return (
      <div className="h-60 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900">Pilih Tema</h1>
        <p className="text-slate-500 mt-2">
          Sesuaikan tampilan undangan dengan konsep pernikahanmu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEMES.map((theme) => {
          const isSelected = currentTheme === theme.id;

          return (
            <div
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              className={cn(
                "group relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden hover:shadow-xl",
                isSelected
                  ? `ring-4 ring-indigo-100 ${theme.border}`
                  : "border-slate-200 hover:border-indigo-300",
              )}
            >
              {/* STATUS AKTIF */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg animate-in zoom-in">
                  <Check size={16} strokeWidth={3} />
                </div>
              )}

              {/* THUMBNAIL (Sementara Warna Dulu) */}
              <div
                className={`h-48 w-full ${theme.color} flex items-center justify-center relative`}
              >
                <LayoutTemplate className="text-black/10 w-20 h-20 group-hover:scale-110 transition-transform duration-500" />

                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>

              {/* INFO */}
              <div className="p-5 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-lg text-slate-900">
                    {theme.name}
                  </h3>
                  {theme.id === "luxury" && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={10} /> PREMIUM
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>

                <div className="mt-4">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full h-10 rounded-lg text-sm font-semibold transition-all ${isSelected ? "bg-slate-900 hover:bg-slate-800" : "border-slate-300 hover:border-indigo-600 hover:text-indigo-600"}`}
                    disabled={loading}
                  >
                    {isSelected ? "Tema Aktif" : "Pakai Tema Ini"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
