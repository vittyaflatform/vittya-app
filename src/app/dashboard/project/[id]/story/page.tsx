"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { 
  DndContext, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy, 
  useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Loader2, 
  Sparkles, 
  Trash2, 
  Pencil, 
  GripVertical, 
  BookHeart, 
  Wand2, 
  X, 
  RefreshCw 
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  title: string;
  year: string;
  story: string;
  image_url: string;
  sort_order: number;
}

function SortableStoryItem({ story, editingId, onEdit, onRemove }: { 
  story: Story, 
  editingId: string | null, 
  onEdit: (s: Story) => void, 
  onRemove: (id: string) => void 
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: story.id });
  
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition, 
    zIndex: isDragging ? 50 : 0 
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("relative group flex gap-4 pl-2", isDragging && "opacity-50")}>
      {/* Handle Drag */}
      <div {...attributes} {...listeners} className="mt-12 cursor-grab active:cursor-grabbing text-[#E8DFD3] hover:text-[#C5A371] transition-colors">
        <GripVertical size={24} />
      </div>

      {/* Card Content */}
      <div className={cn(
        "flex-1 bg-white p-6 rounded-[2.5rem] border transition-all duration-500 flex flex-col md:flex-row gap-6 relative shadow-sm", 
        editingId === story.id ? "border-[#C5A371] ring-4 ring-[#C5A371]/10" : "border-[#E8DFD3] hover:shadow-xl hover:border-[#C5A371]/30"
      )}>
        {/* Actions Menu */}
        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
          <button onClick={() => onEdit(story)} className="p-3 bg-[#FDF8F3] text-[#1A4D2E] rounded-2xl hover:bg-[#1A4D2E] hover:text-white transition-all shadow-sm">
            <Pencil size={14} />
          </button>
          <button onClick={() => onRemove(story.id)} className="p-3 bg-[#FDF8F3] text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
            <Trash2 size={14} />
          </button>
        </div>

        {/* Image Display */}
        <div className="w-full md:w-40 h-40 shrink-0 rounded-4xl overflow-hidden bg-[#FDF8F3] border border-[#E8DFD3]">
          {story.image_url ? (
            <img src={story.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={story.title} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#A9907E]">
              <BookHeart size={40} strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-3 py-2 text-left">
          <span className="inline-block px-4 py-1.5 bg-[#FDF8F3] text-[#1A4D2E] text-[10px] font-black rounded-full uppercase tracking-[0.2em] italic border border-[#E8DFD3]">
            {story.year || "The Moment"}
          </span>
          <h4 className="font-serif italic font-bold text-2xl text-[#1A4D2E] tracking-tight">
            {story.title}
          </h4>
          <p className="text-[#A9907E] text-sm leading-relaxed font-medium">
            {story.story}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StoryPage() {
  const supabase = createClient();
  const params = useParams();
  const projectId = params?.id as string;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [userId, setUserId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", year: "", story: "", image: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      
      const { data, error } = await supabase
        .from("love_stories")
        .select("*")
        .eq("invitation_id", projectId)
        .order("sort_order", { ascending: true });

      if (!error) setStories(data || []);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  }, [projectId, supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleMagicPolish = async () => {
    if (isPolishing || !form.story.trim()) return;
    setIsPolishing(true);
    try {
      const res = await fetch("/api/ai/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: form.story }),
      });
      const data = await res.json();
      if (data.text) {
        setForm(prev => ({ ...prev, story: data.text.trim() }));
        toast.success("✨ Story elegantly polished!");
      }
    } catch (e) {
      toast.error("AI Service temporarily unavailable");
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.story) return toast.error("Please fill title and story");
    
    setIsSubmitting(true);
    const payload = { 
      invitation_id: projectId, 
      title: form.title, 
      year: form.year, 
      story: form.story, 
      image_url: form.image 
    };

    const { error } = editingId 
      ? await supabase.from("love_stories").update(payload).eq("id", editingId)
      : await supabase.from("love_stories").insert([{ ...payload, sort_order: stories.length }]);

    if (!error) {
      toast.success("Journey preserved!");
      setForm({ title: "", year: "", story: "", image: "" });
      setEditingId(null);
      fetchData();
    } else {
      toast.error("Failed to save chapter.");
    }
    setIsSubmitting(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stories.findIndex((s) => s.id === active.id);
      const newIndex = stories.findIndex((s) => s.id === over.id);
      const newStories = arrayMove(stories, oldIndex, newIndex);
      setStories(newStories);
      
      const updates = newStories.map((s, i) => 
        supabase.from("love_stories").update({ sort_order: i }).eq("id", s.id)
      );
      await Promise.all(updates);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDF8F3]">
      <Image src="/logo-Vittya.png" alt="Vittya" width={80} height={80} className="animate-pulse mb-6" />
      <Loader2 className="animate-spin text-[#1A4D2E] w-8 h-8" />
      <p className="mt-4 font-serif italic text-[#A9907E]">Curating your memories...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F3] pb-32">
      {/* HEADER */}
      <header className="sticky top-0 z-100 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#E8DFD3] px-6 py-6 mb-12">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <Image src="/logo-Vittya.png" alt="Vittya" width={50} height={50} />
          <div className="h-10 w-px bg-[#E8DFD3]" />
          <div className="text-left">
            <h1 className="text-3xl font-serif italic font-bold text-[#1A4D2E] tracking-tighter">Love <span className="text-[#C5A371]">JOURNEY</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A9907E]">Memory Sequence Management</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-12">
        {/* FORM SECTION */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="p-8 bg-white rounded-[2.5rem] border-b-8 border-[#1A4D2E] shadow-2xl sticky top-28 space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-[#FDF8F3] pb-4">
              <h3 className="font-serif italic text-xl text-[#1A4D2E] flex items-center gap-2">
                {editingId ? <Pencil className="text-[#C5A371]" size={20} /> : <Wand2 className="text-[#1A4D2E]" size={20} />}
                {editingId ? "Edit Chapter" : "New Chapter"}
              </h3>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({title:"", year:"", story:"", image:""}) }}>
                  <X className="text-slate-300 hover:text-red-500 transition-colors" size={20} />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-[#A9907E] tracking-[0.2em]">Moment Title</Label>
              <Input 
                value={form.title ?? ""} 
                onChange={e => setForm({...form, title: e.target.value})} 
                placeholder="e.g. Under the stars" 
                className="rounded-xl bg-[#FDF8F3] border-[#E8DFD3] h-12 text-[#1A4D2E] placeholder:text-[#A9907E]/50 focus:border-[#C5A371] focus:ring-[#C5A371]" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-[#A9907E] tracking-[0.2em]">Year / Period</Label>
              <Input 
                value={form.year ?? ""} 
                onChange={e => setForm({...form, year: e.target.value})} 
                placeholder="2024" 
                className="rounded-xl bg-[#FDF8F3] border-[#E8DFD3] h-12 text-[#1A4D2E] placeholder:text-[#A9907E]/50 focus:border-[#C5A371] focus:ring-[#C5A371]" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <Label className="text-[10px] font-bold uppercase text-[#A9907E] tracking-[0.2em]">The Story</Label>
                <button 
                  type="button" 
                  onClick={handleMagicPolish} 
                  disabled={isPolishing} 
                  className="text-[10px] bg-[#1A4D2E] hover:bg-[#C5A371] text-white px-4 py-1.5 rounded-full flex gap-2 items-center transition-all shadow-md active:scale-95 disabled:bg-slate-200"
                >
                  {isPolishing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI POLISH
                </button>
              </div>
              <Textarea 
                value={form.story ?? ""} 
                onChange={e => setForm({...form, story: e.target.value})} 
                placeholder="Describe your beautiful memory..." 
                className="rounded-2xl bg-[#FDF8F3] border-[#E8DFD3] min-h-35 resize-none text-[#1A4D2E] placeholder:text-[#A9907E]/50 focus:border-[#C5A371] focus:ring-[#C5A371]" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-[#A9907E] tracking-[0.2em]">Visual Memory</Label>
              <div className="p-4 bg-[#FDF8F3] rounded-2xl border border-dashed border-[#E8DFD3]">
                <ImageUpload 
                  userId={userId} 
                  invitationId={projectId} 
                  assetType="stories" 
                  value={form.image} 
                  onChange={url => setForm({...form, image: url})} 
                  onRemove={() => setForm({...form, image: ""})} 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-[#1A4D2E] hover:bg-black text-white h-14 rounded-2xl font-black italic uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-[0.98]"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : editingId ? "UPDATE CHAPTER" : "PRESERVE MEMORY"}
            </Button>
          </form>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-4xl font-serif italic text-[#1A4D2E] border-l-4 border-[#C5A371] pl-6">
              Story <span className="font-sans font-black text-[#C5A371] uppercase text-2xl not-italic ml-2 tracking-tighter">Timeline</span>
            </h2>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stories.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {stories.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-[#E8DFD3] italic text-[#A9907E] font-serif text-xl">
                  Your timeline is a blank canvas... <br/>
                  <span className="text-sm font-sans not-italic uppercase tracking-[0.3em] text-[#C5A371]">Start writing your journey</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {stories.map((story) => (
                    <SortableStoryItem 
                      key={story.id} 
                      story={story} 
                      editingId={editingId} 
                      onEdit={(s) => { 
                        setEditingId(s.id); 
                        setForm({ 
                          title: s.title ?? "", 
                          year: s.year ?? "", 
                          story: s.story ?? "", 
                          image: s.image_url ?? "" 
                        }); 
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }} 
                      onRemove={async (id) => { 
                        if(confirm("Erase this chapter from history?")) { 
                          await supabase.from("love_stories").delete().eq("id", id); 
                          fetchData(); 
                        } 
                      }} 
                    />
                  ))}
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </main>

      {/* SYNC INDICATOR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 bg-[#1A4D2E] text-white rounded-full shadow-2xl flex items-center gap-4 z-100 border border-[#C5A371]/30">
        <RefreshCw size={14} className="animate-spin text-[#C5A371]" />
        <p className="text-[9px] font-black uppercase tracking-[0.3em] italic">Vittya Archive Synchronized</p>
      </div>
    </div>
  );
}