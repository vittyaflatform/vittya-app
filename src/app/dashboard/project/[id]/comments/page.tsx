"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/lib/use-debounce";
import {
  Loader2,
  MessageSquare,
  Trash2,
  Search,
  UserCheck,
  UserX,
  HelpCircle,
  Heart,
  Reply,
  Send,
  Sparkles,
  Quote,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { id as ind } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  name: string;
  message: string;
  attendance: string;
  created_at: string;
  likes: number;
  reply?: string;
  is_liked_by_owner: boolean;
}

export default function CommentsPage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const projectId = params?.id as string;

  // --- States ---
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [stats, setStats] = useState({ total: 0, hadir: 0, tidakHadir: 0, ragu: 0 });

  const debouncedSearch = useDebounce(search, 500);

  // --- Reply & AI States ---
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // --- Handlers ---
  const fetchComments = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);

    try {
      // 1. Fetch Stats
      const { data: allData } = await supabase
        .from("comments")
        .select("attendance")
        .eq("invitation_id", projectId);

      if (allData) {
        setStats({
          total: allData.length,
          hadir: allData.filter((c) => c.attendance === "Hadir").length,
          tidakHadir: allData.filter((c) => c.attendance === "Tidak Hadir").length,
          ragu: allData.filter((c) => c.attendance === "Masih Ragu").length,
        });
      }

      // 2. Fetch Comments with Filters
      let query = supabase
        .from("comments")
        .select("*")
        .eq("invitation_id", projectId)
        .order("created_at", { ascending: false });

      if (debouncedSearch) {
        query = query.or(`name.ilike.%${debouncedSearch}%,message.ilike.%${debouncedSearch}%`);
      }

      if (filter !== "Semua") {
        query = query.eq("attendance", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setComments(data || []);
    } catch (err: any) {
      toast.error("Gagal sinkronisasi data: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, debouncedSearch, filter, supabase]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const openReply = (id: string, existingReply?: string) => {
    setActiveReplyId(id);
    setReplyText(existingReply || "");
  };

  const handleLike = async (id: string, currentLikes: number, isLiked: boolean) => {
    const newLikes = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
    const newStatus = !isLiked;

    // Optimistic Update
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: newLikes, is_liked_by_owner: newStatus } : c))
    );

    const { error } = await supabase
      .from("comments")
      .update({ likes: newLikes, is_liked_by_owner: newStatus })
      .eq("id", id);

    if (error) toast.error("Gagal menyukai ucapan.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus ucapan ini selamanya?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Ucapan telah dihapus.");
    }
  };

  const generateAIReply = async (commentName: string, commentMessage: string) => {
    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/ai/polish-quote", {
        method: "POST",
        body: JSON.stringify({ 
          draft: `Balas ucapan selamat dari ${commentName}: "${commentMessage}". Buat balasan terima kasih yang sangat elegan, singkat, dan hangat.` 
        }),
      });
      const data = await res.json();
      if (data.polishedText) setReplyText(data.polishedText);
    } catch (err) {
      toast.error("AI sedang beristirahat.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const submitReply = async (id: string) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    const { error } = await supabase.from("comments").update({ reply: replyText }).eq("id", id);
    if (!error) {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, reply: replyText } : c)));
      setActiveReplyId(null);
      toast.success("Balasan terkirim.");
    }
    setSendingReply(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12 pt-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#E8DFD3] pb-10">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif italic font-bold text-[#1A4D2E]">
              Guest <span className="text-[#C5A371]">Wishes</span>
            </h1>
            <p className="text-[#A9907E] font-black uppercase tracking-[0.3em] text-[10px]">
              Curating love and prayers from your loved ones
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 bg-white/50 p-1.5 rounded-2xl border border-[#E8DFD3] backdrop-blur-sm">
            {["Semua", "Hadir", "Tidak Hadir", "Masih Ragu"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  filter === item ? "bg-[#1A4D2E] text-white shadow-md" : "text-[#A9907E] hover:bg-white"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total", val: stats.total, icon: <MessageSquare size={16}/>, bg: "bg-white" },
            { label: "Attending", val: stats.hadir, icon: <UserCheck size={16}/>, bg: "bg-green-50/50" },
            { label: "Absent", val: stats.tidakHadir, icon: <UserX size={16}/>, bg: "bg-red-50/50" },
            { label: "Undecided", val: stats.ragu, icon: <HelpCircle size={16}/>, bg: "bg-yellow-50/50" },
          ].map((s, i) => (
            <div key={i} className={cn("p-6 rounded-3xl border border-[#E8DFD3] shadow-sm flex flex-col justify-between h-32 transition-transform hover:scale-[1.02]", s.bg)}>
              <div className="flex justify-between text-[#A9907E]">
                <span className="text-[9px] font-black uppercase tracking-widest">{s.label}</span>
                {s.icon}
              </div>
              <div className="text-3xl font-serif italic font-bold text-[#1A4D2E]">{s.val}</div>
            </div>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#A9907E] group-focus-within:text-[#C5A371] transition-colors" size={20} />
          <Input
            placeholder="Search through the memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-16 pl-16 pr-8 rounded-full border-none shadow-xl bg-white text-lg font-serif italic text-[#1A4D2E] focus-visible:ring-2 focus-visible:ring-[#C5A371]"
          />
        </div>

        {/* Comments Grid/List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
              <Loader2 className="animate-spin text-[#C5A371]" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest">Refreshing Wishes...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-32 text-center bg-white/30 rounded-[3rem] border-2 border-dashed border-[#E8DFD3]">
               <p className="font-serif italic text-[#A9907E]">No wishes match your criteria.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="group bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-[#E8DFD3] hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                
                {/* Decorative Quote Icon */}
                <Quote className="absolute -right-4 -top-4 w-24 h-24 text-[#FDF8F3] group-hover:text-[#F8EFE6] transition-colors" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8">
                  {/* Left Side: Initial & Badge */}
                  <div className="flex flex-row md:flex-col items-center gap-4">
                    <div className={cn(
                      "w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-bold shadow-inner transition-transform group-hover:rotate-3",
                      comment.attendance === "Hadir" ? "bg-green-100 text-green-700" : comment.attendance === "Tidak Hadir" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter bg-white/80">{comment.attendance}</Badge>
                  </div>

                  {/* Right Side: Message & Actions */}
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-2xl font-serif font-bold text-[#1A4D2E]">{comment.name}</h4>
                        <p className="text-[9px] text-[#A9907E] font-black uppercase tracking-widest mt-1">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ind })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleLike(comment.id, comment.likes, comment.is_liked_by_owner)}
                          className={cn("p-3 rounded-2xl transition-all", comment.is_liked_by_owner ? "bg-pink-50 text-pink-600 shadow-inner" : "bg-slate-50 text-slate-300 hover:text-pink-400")}
                        >
                          <Heart size={20} fill={comment.is_liked_by_owner ? "currentColor" : "none"} />
                        </button>
                        <button 
                          onClick={() => handleDelete(comment.id)}
                          className="p-3 rounded-2xl bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <p className="text-[#3A3A3A] font-serif italic text-xl leading-relaxed">"{comment.message}"</p>

                    {/* Action Bar */}
                    {!comment.reply && activeReplyId !== comment.id && (
                      <button 
                        onClick={() => openReply(comment.id)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#C5A371] hover:text-[#1A4D2E] transition-colors group/btn"
                      >
                        <Reply size={16} className="group-hover/btn:-translate-x-1 transition-transform"/> 
                        Give Gratitude
                      </button>
                    )}

                    {/* Reply Form */}
                    {activeReplyId === comment.id && (
                      <div className="mt-8 p-6 md:p-8 bg-[#FDF8F3] rounded-4xl border border-[#C5A371]/20 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black uppercase text-[#1A4D2E]">Respond to {comment.name}</span>
                          <Button 
                            onClick={() => generateAIReply(comment.name, comment.message)} 
                            disabled={isAiGenerating} 
                            variant="ghost" 
                            className="h-8 text-[9px] font-black uppercase bg-white border border-[#C5A371]/20 rounded-full px-4 hover:shadow-md transition-all text-[#C5A371]"
                          >
                            {isAiGenerating ? <Loader2 size={12} className="animate-spin mr-2" /> : <Sparkles size={12} className="mr-2" />}
                            Write for me
                          </Button>
                        </div>
                        <Textarea 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Your beautiful reply here..."
                          className="bg-white border-none rounded-2xl min-h-25 font-serif italic text-lg p-4 focus-visible:ring-1 focus-visible:ring-[#C5A371]"
                        />
                        <div className="flex justify-end gap-3 mt-6">
                          <Button onClick={() => setActiveReplyId(null)} variant="ghost" className="text-[10px] font-black uppercase tracking-widest px-6 h-12">Cancel</Button>
                          <Button 
                            onClick={() => submitReply(comment.id)} 
                            disabled={sendingReply}
                            className="bg-[#1A4D2E] text-white rounded-full px-10 h-12 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#123520] transition-all"
                          >
                            {sendingReply ? <Loader2 className="animate-spin" /> : <Send size={16} className="mr-2"/>} Sync Reply
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Admin Reply Display */}
                    {comment.reply && activeReplyId !== comment.id && (
                      <div className="mt-6 p-8 bg-[#1A4D2E]/5 border-l-4 border-[#C5A371] rounded-r-[2.5rem] relative overflow-hidden group/reply">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#C5A371]"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-[#1A4D2E]">Your Gratitude</span>
                          </div>
                          <button onClick={() => openReply(comment.id, comment.reply)} className="text-[9px] font-black uppercase text-[#C5A371] hover:underline opacity-0 group-hover/reply:opacity-100 transition-opacity">Edit Response</button>
                        </div>
                        <p className="text-[#1A4D2E] font-serif italic text-lg leading-relaxed">"{comment.reply}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}