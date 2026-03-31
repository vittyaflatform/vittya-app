"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Save,
  Quote as QuoteIcon,
  Sparkles,
  Search,
  CheckCircle2,
  Heart,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const QUOTE_TEMPLATES = [
  { category: "Muslim", source: "QS. Ar-Rum: 21", text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang." },
  { category: "Muslim", source: "QS. Az-Zariyat: 49", text: "Dan segala sesuatu Kami ciptakan berpasang-pasangan supaya kamu mengingat kebesaran Allah." },
  { category: "Kristen", source: "Matius 19:6", text: "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia." },
  { category: "Romantis", source: "BJ Habibie", text: "Masa lalu saya adalah milik saya, masa lalu kamu adalah milik kamu, tapi masa depan adalah milik kita." },
  { category: "Puitis", source: "Sapardi Djoko Damono", text: "Aku ingin mencintaimu dengan sederhana: dengan kata yang tak sempat diucapkan kayu kepada api yang menjadikannya abu." },
];

const categories = ["Semua", "Muslim", "Kristen", "Romantis", "Puitis"];

export default function QuotePage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [polishing, setPolishing] = useState(false); // Loading state khusus AI
  const [quoteText, setQuoteText] = useState("");
  const [quoteSource, setQuoteSource] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("invitations")
        .select("quote_text, quote_source")
        .eq("id", projectId)
        .eq("user_id", user.id)
        .single();
      if (data) {
        setQuoteText(data.quote_text || "");
        setQuoteSource(data.quote_source || "");
      }
      setLoading(false);
    };
    fetchData();
  }, [projectId, supabase]);

  // FUNGSI AI POLISH (Langsung moles teks yang ada di editor)
  const handleAIPolish = async () => {
    if (!quoteText || quoteText.length < 5) {
      return toast.error("Ketik dulu idenya di box editor, Bro!");
    }
    
    setPolishing(true);
    try {
      const res = await fetch("/api/ai/polish-quote", {
        method: "POST",
        body: JSON.stringify({ draft: quoteText }),
      });
      const data = await res.json();
      
      if (data.polishedText) {
        setQuoteText(data.polishedText);
        setQuoteSource("Vittya AI Wisdom"); // Otomatis set sumber jika dipoles AI
        toast.success("AI telah memoles kata-katamu!", {
          icon: <Sparkles className="text-[#C5A371]" />,
        });
      }
    } catch (err) {
      toast.error("Gagal memoles teks. Pastikan API AI sudah terpasang.");
    } finally {
      setPolishing(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("invitations")
      .update({ quote_text: quoteText, quote_source: quoteSource })
      .eq("id", projectId)
      .eq("user_id", user.id);
    if (!error) toast.success("Spiritual words synchronized!");
    setSaving(false);
  };

  const filteredQuotes = QUOTE_TEMPLATES.filter(q => 
    (filter === "Semua" || q.category === filter) &&
    (q.text.toLowerCase().includes(search.toLowerCase()) || q.source.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDF8F3]">
      <Loader2 className="animate-spin text-[#1A4D2E]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F3] pb-40 px-6">
      <div className="max-w-7xl mx-auto pt-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#E8DFD3] pb-12 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1A4D2E] rounded-xl text-[#C5A371]"><QuoteIcon size={20} /></div>
              <h1 className="text-5xl font-serif italic font-bold text-[#1A4D2E]">Poetic <span className="text-[#C5A371]">WISDOM</span></h1>
            </div>
            <p className="text-[#A9907E] font-black uppercase tracking-[0.4em] text-[10px]">Curation of Sacred and Romantic Words</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-[#E8DFD3]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === cat ? "bg-[#1A4D2E] text-white shadow-lg" : "text-[#A9907E] hover:bg-[#FDF8F3]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mt-12">
          
          {/* LEFT: THE EDITOR (INTEGRATED WITH AI) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-[#E8DFD3] sticky top-12">
              <div className="flex items-center justify-between mb-8">
                <Badge className="bg-[#1A4D2E]/10 text-[#1A4D2E] border-none px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Editor Mode</Badge>
                
                {/* AI POLISH TRIGGER - DISATUIN DI SINI */}
                <Button
                  variant="ghost"
                  onClick={handleAIPolish}
                  disabled={polishing || !quoteText}
                  className="h-9 px-4 rounded-full bg-[#FDF8F3] hover:bg-[#1A4D2E] hover:text-white text-[#1A4D2E] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-[#1A4D2E]/10 transition-all shadow-sm"
                >
                  {polishing ? <Loader2 className="animate-spin w-3 h-3" /> : <Wand2 size={14} className="text-[#C5A371]" />}
                  {polishing ? "Polishing..." : "Polish with AI"}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A9907E]">Your Message / Verse</Label>
                  <div className="relative group">
                    <Textarea
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      placeholder="Write your soul or references here..."
                      className="min-h-55 rounded-4xl border-2 border-[#FDF8F3] bg-[#FDF8F3] text-xl font-serif italic text-[#1A4D2E] p-8 focus-visible:ring-[#C5A371] transition-all placeholder:text-[#A9907E]/30"
                    />
                    {/* Floating Sparkle Icon pas ngetik */}
                    <div className="absolute top-4 right-4 text-[#C5A371]/20 group-focus-within:text-[#C5A371] transition-colors">
                        <Sparkles size={20} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A9907E]">Attribution / Source</Label>
                  <Input
                    value={quoteSource}
                    onChange={(e) => setQuoteSource(e.target.value)}
                    placeholder="e.g. QS. Ar-Rum: 21"
                    className="h-14 rounded-full border-2 border-[#FDF8F3] bg-[#FDF8F3] px-8 font-bold text-[#1A4D2E] focus-visible:ring-[#C5A371]"
                  />
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={saving || polishing}
                  className="w-full h-16 rounded-full bg-[#1A4D2E] hover:bg-[#123520] text-white shadow-2xl font-serif italic text-xl border-4 border-white transition-all"
                >
                  {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} className="mr-3 text-[#C5A371]" /> Update Wisdom</>}
                </Button>
                
                <p className="text-[9px] text-[#A9907E] text-center font-bold uppercase tracking-widest opacity-60">
                    Tips: Ketik draft kasar lo & klik "Polish with AI" untuk hasil puitis.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: THE LIBRARY & PREVIEW (Tetap sama) */}
          <div className="lg:col-span-7 space-y-10">
            {/* ... (Search Box, Quote Grid, & Preview Card tetap sama seperti kode sebelumnya) ... */}
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#A9907E]" size={20} />
              <Input 
                placeholder="Search inspirations..." 
                className="w-full h-16 rounded-full border-none shadow-sm bg-white pl-16 text-sm font-bold text-[#1A4D2E]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredQuotes.map((t, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    setQuoteText(t.text);
                    setQuoteSource(t.source);
                    toast.success("Wisdom Applied");
                  }}
                  className="group bg-white p-8 rounded-[2.5rem] border-2 border-transparent hover:border-[#C5A371] transition-all cursor-pointer shadow-sm hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 text-[#FDF8F3] group-hover:text-[#C5A371]/10 transition-colors">
                    <QuoteIcon size={120} />
                  </div>
                  <Badge className="mb-4 bg-[#FDF8F3] text-[#A9907E] border-none text-[9px] uppercase tracking-tighter">{t.category}</Badge>
                  <p className="text-sm font-serif italic text-[#1A4D2E] leading-relaxed mb-6 relative z-10">"{t.text}"</p>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-black text-[#C5A371] uppercase tracking-widest">— {t.source}</span>
                    <div className="w-8 h-8 rounded-full bg-[#1A4D2E] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-12 rounded-[4rem] bg-[#1A4D2E] text-center space-y-6 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}></div>
               <Heart className="mx-auto text-[#C5A371]" fill="#C5A371" size={32} />
               <p className="text-2xl md:text-3xl font-serif italic text-white leading-loose max-w-2xl mx-auto">
                "{quoteText || "Choose a wisdom to preview your invitation style..."}"
               </p>
               <div className="h-0.5 w-20 bg-[#C5A371] mx-auto opacity-50"></div>
               <p className="text-[#C5A371] font-black uppercase tracking-[0.4em] text-xs">{quoteSource || "Source"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
