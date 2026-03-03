"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Send,
  MessageSquare,
  CheckCircle,
  XCircle,
  HelpCircle,
  Heart,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as ind } from "date-fns/locale";
import { toast } from "sonner";

// Tipe Data Komentar Lengkap
interface Comment {
  id: string;
  name: string;
  message: string;
  attendance: string;
  created_at: string;
  likes: number;
  reply?: string; // Kolom Balasan (Nullable)
}

export default function CommentSection({
  invitationId,
}: {
  invitationId: string;
}) {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState("Hadir");
  const [isSending, setIsSending] = useState(false);

  // Local state untuk tracking Like di sesi ini (biar user gak spam like)
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // ==========================================
  // 1. FETCH DATA (DENGAN DEBUGGING)
  // ==========================================
  const fetchComments = async () => {
    // Debugging: Cek apakah ID Project terbaca
    // console.log("Fetching for Project ID:", invitationId);

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ ERROR SUPABASE:", error.message);
      toast.error("Gagal memuat komentar.");
    }

    if (data) {
      // Debugging: Cek apakah kolom 'reply' dan 'likes' ada isinya?
      console.log("✅ DATA DITERIMA (Cek kolom reply & likes):", data);
      setComments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (invitationId) fetchComments();
  }, [invitationId]);

  // ==========================================
  // 2. KIRIM KOMENTAR BARU
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim())
      return toast.error("Nama dan Pesan wajib diisi!");

    setIsSending(true);

    const { error } = await supabase.from("comments").insert({
      invitation_id: invitationId,
      name,
      message,
      attendance,
    });

    if (!error) {
      setName("");
      setMessage("");
      fetchComments(); // Refresh list otomatis
      toast.success("Terima kasih atas ucapannya!");
    } else {
      toast.error("Gagal mengirim: " + error.message);
    }
    setIsSending(false);
  };

  // ==========================================
  // 3. HANDLE LIKE (OPTIMISTIC UPDATE)
  // ==========================================
  const handleLike = async (id: string, currentLikes: number) => {
    // Cegah user like berkali-kali di sesi yang sama (UX Protection)
    if (likedComments.has(id)) {
      toast("Kamu sudah menyukai ucapan ini 😊");
      return;
    }

    // 1. Update UI DULUAN (Optimistic) biar terasa cepat
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: (c.likes || 0) + 1 } : c)),
    );
    setLikedComments(new Set(likedComments).add(id));

    // 2. Kirim ke Server (Background Process)
    const { error } = await supabase.rpc("like_comment", { comment_id: id });

    if (error) {
      console.error("Gagal Like:", error);
      // Kalau gagal, balikin UI (Rollback - Opsional)
      // Tapi biasanya jarang gagal kalau RPC udah bener
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white rounded-3xl shadow-xl my-10 border border-slate-100">
      {/* JUDUL SECTION */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">
          Doa & Ucapan
        </h2>
        <p className="text-slate-500">
          Kirimkan doa terbaik untuk kedua mempelai
        </p>
      </div>

      {/* FORM INPUT */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100"
      >
        <div className="space-y-1">
          <Input
            placeholder="Nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white border-slate-200 h-12 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <Textarea
            placeholder="Tuliskan ucapan & doa..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white border-slate-200 min-h-[100px] focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {["Hadir", "Masih Ragu", "Tidak Hadir"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setAttendance(opt)}
              className={`py-2 px-1 text-xs md:text-sm rounded-lg border transition-all font-bold flex items-center justify-center gap-1 ${
                attendance === opt
                  ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-105"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:bg-slate-100"
              }`}
            >
              {opt === "Hadir" && <CheckCircle size={14} />}
              {opt === "Masih Ragu" && <HelpCircle size={14} />}
              {opt === "Tidak Hadir" && <XCircle size={14} />}
              {opt}
            </button>
          ))}
        </div>

        <Button
          type="submit"
          disabled={isSending}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          {isSending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Send size={18} className="mr-2" />
          )}
          Kirim Ucapan
        </Button>
      </form>

      {/* LIST KOMENTAR */}
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="animate-spin mx-auto text-indigo-600" />
            <p className="text-xs text-slate-400 mt-2">Memuat ucapan...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
            <p className="font-medium">Belum ada ucapan.</p>
            <p className="text-xs">Jadilah yang pertama mengirim doa!</p>
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="group animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="flex gap-4">
                {/* AVATAR */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-sm border-2 border-white ring-1 ring-slate-100 ${
                    c.attendance === "Hadir"
                      ? "bg-green-500"
                      : c.attendance === "Tidak Hadir"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>

                {/* KONTEN */}
                <div className="flex-1">
                  {/* Bubble Tamu */}
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">
                        {c.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(c.created_at), {
                          addSuffix: true,
                          locale: ind,
                        })}
                      </span>
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed mb-3">
                      "{c.message}"
                    </p>

                    {/* Footer Kartu (Badge & Like) */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                      {/* Status Kehadiran */}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                        {c.attendance === "Hadir" && (
                          <CheckCircle size={12} className="text-green-500" />
                        )}
                        {c.attendance === "Tidak Hadir" && (
                          <XCircle size={12} className="text-red-500" />
                        )}
                        {c.attendance === "Masih Ragu" && (
                          <HelpCircle size={12} className="text-yellow-500" />
                        )}
                        {c.attendance}
                      </div>

                      {/* TOMBOL LIKE */}
                      <button
                        onClick={() => handleLike(c.id, c.likes || 0)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-all px-3 py-1.5 rounded-full ${
                          likedComments.has(c.id)
                            ? "text-pink-600 bg-pink-50 border border-pink-100"
                            : "text-slate-400 hover:text-pink-600 hover:bg-slate-50"
                        }`}
                      >
                        <Heart
                          size={14}
                          className={
                            likedComments.has(c.id)
                              ? "fill-pink-600 animate-pulse"
                              : ""
                          }
                        />
                        <span>{c.likes || 0}</span>
                      </button>
                    </div>
                  </div>

                  {/* 🔥 BALASAN ADMIN / MEMPELAI */}
                  {/* Bagian ini HANYA MUNCUL kalau c.reply tidak null/kosong */}
                  {c.reply && (
                    <div className="mt-2 ml-4 flex justify-end animate-in fade-in slide-in-from-top-2">
                      <div className="relative max-w-[90%]">
                        {/* Garis Konektor Visual */}
                        <div className="absolute -left-4 -top-4 w-4 h-8 border-l-2 border-b-2 border-indigo-100 rounded-bl-xl"></div>

                        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-3 rounded-2xl rounded-tr-none shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              <User size={10} /> Mempelai
                            </span>
                          </div>
                          <p className="text-sm text-slate-800 italic leading-relaxed">
                            "{c.reply}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
