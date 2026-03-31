"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProjectSchema } from "@/lib/types";
import { Loader2, ArrowLeft, Sparkles, Link as LinkIcon } from "lucide-react";

export default function CreateProject() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Form State
  const [groom, setGroom] = useState("");
  const [bride, setBride] = useState("");
  const [slug, setSlug] = useState("");
  const [isManualSlug, setIsManualSlug] = useState(false); // Deteksi kalau user udah edit slug sendiri

  // --- 🛠️ FUNGSI PEMBERSIH URL (SMART SLUG) ---
  const formatSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase() // Ubah ke huruf kecil
      .trim()
      .replace(/\s+/g, "-") // Ganti spasi jadi strip
      .replace(/[&]/g, "-and-") // Ganti simbol & jadi '-and-'
      .replace(/[^\w\-]+/g, "") // Hapus karakter aneh (selain huruf, angka, strip)
      .replace(/\-\-+/g, "-") // Hapus strip ganda (misal -- jadi -)
      .replace(/^-+/, "") // Hapus strip di awal
      .replace(/-+$/, ""); // Hapus strip di akhir
  };

  // Auto-fill link saat nama diketik (Realtime)
  const handleNameChange = (g: string, b: string) => {
    // Kalau user belum pernah edit slug manual, kita buatin otomatis
    if (!isManualSlug) {
      if (g && b) {
        setSlug(formatSlug(`${g}-${b}`));
      } else if (g) {
        setSlug(formatSlug(g));
      } else if (b) {
        setSlug(formatSlug(b));
      } else {
        setSlug("");
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    // Pastikan slug final benar-benar bersih sebelum dikirim
    const parsed = createProjectSchema.safeParse({
      groom,
      bride,
      slug: formatSlug(slug),
    });

    if (!parsed.success) {
      setMsg({
        type: "error",
        text:
          parsed.error.issues[0]?.message ?? "Data project tidak valid.",
      });
      setLoading(false);
      return;
    }

    const finalSlug = parsed.data.slug;

    if (finalSlug.length < 3) {
      setMsg({
        type: "error",
        text: "Link URL terlalu pendek, minimal 3 karakter.",
      });
      setLoading(false);
      return;
    }

    // 1. Cek User
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // 2. Simpan ke Database
    const { error } = await supabase.from("invitations").insert({
      user_id: user.id,
      groom_name: groom,
      bride_name: bride,
      slug: finalSlug, // Pakai slug yang sudah bersih
      views: 0,
      membership_type: "free",
      theme: "luxury", // Default theme langsung set
    });

    if (error) {
      if (error.code === "23505") {
        setMsg({
          type: "error",
          text: `Link "vittya.com/${finalSlug}" sudah dipakai orang lain. Coba ganti ya!`,
        });
      } else {
        setMsg({ type: "error", text: "Gagal membuat: " + error.message });
      }
      setLoading(false);
    } else {
      setMsg({
        type: "success",
        text: "Berhasil! Mengalihkan ke dashboard...",
      });
      router.refresh();
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/dashboard"
          className="flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors w-fit group"
        >
          <ArrowLeft
            size={16}
            className="mr-1 group-hover:-translate-x-1 transition-transform"
          />{" "}
          Kembali ke Dashboard
        </Link>

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Project Baru ✨
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Mulai buat undangan digital profesionalmu.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 sm:px-10">
          {msg && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${msg.type === "error" ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}
            >
              <span className="mt-0.5">
                {msg.type === "error" ? "🚫" : "✅"}
              </span>
              {msg.text}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleCreate}>
            {/* Input Nama */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">
                  Nama Pria
                </Label>
                <Input
                  required
                  placeholder="Adam"
                  className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  value={groom}
                  onChange={(e) => {
                    setGroom(e.target.value);
                    handleNameChange(e.target.value, bride);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">
                  Nama Wanita
                </Label>
                <Input
                  required
                  placeholder="Hawa"
                  className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  value={bride}
                  onChange={(e) => {
                    setBride(e.target.value);
                    handleNameChange(groom, e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Input Slug (Link) */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold flex items-center justify-between">
                Link Undangan
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                  Otomatis
                </span>
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={16} className="text-slate-400" />
                </div>
                <div className="flex rounded-xl shadow-sm overflow-hidden border border-slate-200 group-focus-within:ring-2 group-focus-within:ring-indigo-100 group-focus-within:border-indigo-400 transition-all">
                  <span className="inline-flex items-center px-3 bg-slate-50 text-slate-500 text-sm font-medium border-r border-slate-200">
                    vittya.com/
                  </span>
                  <input
                    type="text"
                    required
                    className="flex-1 min-w-0 block w-full px-3 py-3 text-slate-900 placeholder-slate-300 focus:outline-none text-sm font-medium"
                    placeholder="adam-hawa"
                    value={slug}
                    onChange={(e) => {
                      setSlug(formatSlug(e.target.value)); // Langsung format pas ngetik
                      setIsManualSlug(true); // Tandai user mau custom sendiri
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Gunakan huruf kecil dan tanda strip (-). Contoh:{" "}
                <span className="font-mono text-indigo-500">romeo-juliet</span>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={18} className="mr-2" /> Buat Undangan Sekarang
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
