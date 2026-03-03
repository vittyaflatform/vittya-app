"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuestBookProps {
  invitationId: string;
  defaultName?: string; // Nama tamu dari URL (kalau ada)
  theme?: "luxury" | "minimalist";
}

// Sesuaikan dengan tabel 'comments' di database lo
interface Comment {
  id: string;
  name: string;
  message: string;
  attendance: string | null;
  created_at: string;
}

export default function GuestBook({
  invitationId,
  defaultName,
  theme = "luxury",
}: GuestBookProps) {
  const supabase = createClient();

  // State Form
  const [name, setName] = useState(defaultName || "");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState("Hadir");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Data
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // 1. FETCH COMMENTS (Tabel: comments)
  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments") // <--- NAMA TABEL SESUAI SQL LO
      .select("*")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false }); // Yg baru di atas

    if (data) setComments(data);
    setLoadingComments(false);
  };

  useEffect(() => {
    if (invitationId) fetchComments();
  }, [invitationId]);

  // 2. SUBMIT COMMENT (Tabel: comments)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim())
      return alert("Nama & Pesan wajib diisi!");

    setIsSubmitting(true);

    const { error } = await supabase.from("comments").insert({
      invitation_id: invitationId,
      name,
      message,
      attendance, // Kolom ini ada di SQL lo
    });

    if (!error) {
      setMessage("");
      // Kalau nama bukan dari URL, reset field nama
      if (!defaultName) setName("");
      fetchComments(); // Refresh list
      alert("Terima kasih atas ucapannya! 🎉");
    } else {
      alert("Gagal mengirim ucapan: " + error.message);
    }

    setIsSubmitting(false);
  };

  // Helper Format Waktu
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Baru saja";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  // Styling
  const isLuxury = theme === "luxury";
  const cardClass = isLuxury
    ? "bg-white border-amber-100 shadow-amber-50"
    : "bg-slate-50 border-slate-200 shadow-slate-100";

  const buttonClass = isLuxury
    ? "bg-amber-600 hover:bg-amber-700 text-white"
    : "bg-slate-900 hover:bg-slate-800 text-white";

  return (
    <section
      className={cn("py-20 px-6", isLuxury ? "bg-[#FDFBF7]" : "bg-white")}
    >
      <div className="max-w-3xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h2
            className={cn(
              "text-3xl font-bold",
              isLuxury
                ? "font-serif text-amber-700"
                : "font-sans text-slate-900",
            )}
          >
            Buku Tamu
          </h2>
          <p className="text-slate-500 text-sm">
            Berikan doa & ucapan untuk kami.
          </p>
        </div>

        {/* FORM INPUT */}
        <div
          className={cn("p-6 md:p-8 rounded-2xl border shadow-sm", cardClass)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Nama */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Nama
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap"
                className="bg-transparent"
                disabled={!!defaultName} // Lock nama kalau dari link personal
              />
            </div>

            {/* Input Ucapan */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Ucapan & Doa
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan sesuatu yang manis..."
                className="bg-transparent min-h-[100px]"
              />
            </div>

            {/* Pilihan Kehadiran */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Konfirmasi Kehadiran
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Hadir", "Masih Ragu", "Tidak Hadir"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAttendance(opt)}
                    className={cn(
                      "py-2 px-1 text-xs md:text-sm rounded-lg border transition-all font-medium",
                      attendance === opt
                        ? isLuxury
                          ? "bg-amber-100 border-amber-500 text-amber-700"
                          : "bg-slate-800 text-white border-slate-800"
                        : "bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full h-12 rounded-xl text-lg font-bold mt-4",
                buttonClass,
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Send className="mr-2" size={18} />
              )}
              Kirim Ucapan
            </Button>
          </form>
        </div>

        {/* LIST KOMENTAR */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2 text-slate-700">
            <MessageCircle size={20} /> {comments.length} Ucapan Masuk
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {loadingComments ? (
              <div className="text-center py-10 text-slate-400">
                <Loader2 className="animate-spin mx-auto mb-2" /> Memuat
                ucapan...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-10 text-slate-400 border-2 border-dashed rounded-xl">
                Jadilah yang pertama mengirim ucapan!
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2"
                >
                  {/* Avatar Inisial */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0",
                      comment.attendance === "Hadir"
                        ? "bg-green-500"
                        : comment.attendance === "Tidak Hadir"
                          ? "bg-red-400"
                          : "bg-slate-400",
                    )}
                  >
                    {comment.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 text-sm">
                        {comment.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {timeAgo(comment.created_at)}
                      </span>
                    </div>

                    {/* Badge Kehadiran */}
                    {comment.attendance && (
                      <div className="mb-1">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded border",
                            comment.attendance === "Hadir"
                              ? "bg-green-50 text-green-600 border-green-200"
                              : comment.attendance === "Tidak Hadir"
                                ? "bg-red-50 text-red-500 border-red-200"
                                : "bg-slate-50 text-slate-500 border-slate-200",
                          )}
                        >
                          {comment.attendance}
                        </span>
                      </div>
                    )}

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {comment.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
