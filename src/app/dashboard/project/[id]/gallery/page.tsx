"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  UploadCloud,
  Trash2,
  Image as ImageIcon,
  Plus,
  PlayCircle,
  GripVertical,
  Sparkles,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression";

// --- DND KIT ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryItem {
  id: string;
  photo_url: string;
  media_type: "image" | "video";
  position: number;
  isTemp?: boolean; // Untuk Skeleton saat upload
}

const getPreviewUrl = (url: string, type: "image" | "video") => {
  if (!url || !url.includes("cloudinary.com")) return url;
  const params = "w_800,q_auto:best,f_auto,c_fill,g_auto";
  return type === "video" 
    ? url.replace(/\.[^/.]+$/, ".jpg").replace("/upload/", `/upload/so_1,${params}/`)
    : url.replace("/upload/", `/upload/${params}/`);
};

// --- SORTABLE CARD ---
function SortablePhoto({ item, onDelete, isOverlay = false }: { item: GalleryItem; onDelete?: (item: GalleryItem) => void; isOverlay?: boolean; }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: item.isTemp });
  
  const style = { transform: CSS.Transform.toString(transform), transition };

  if (item.isTemp) {
    return (
      <div className="aspect-3/4 rounded-[2.5rem] bg-white border-4 border-dashed border-[#E8DFD3] flex flex-col items-center justify-center gap-3 animate-pulse">
        <Loader2 className="animate-spin text-[#C5A371]" size={32} />
        <span className="text-[10px] font-black text-[#A9907E] uppercase tracking-widest">Processing...</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-3/4 bg-white rounded-[2.5rem] overflow-hidden shadow-xl transition-all border-4",
        isDragging ? "opacity-30 scale-95 border-transparent" : "border-transparent hover:border-[#1A4D2E]/10 hover:shadow-2xl hover:-translate-y-1",
        isOverlay && "opacity-100 scale-105 shadow-2xl border-[#C5A371] rotate-2 z-[100]"
      )}
    >
      <div {...attributes} {...listeners} className="absolute top-5 left-5 z-30 bg-[#1A4D2E] text-white p-3 rounded-2xl cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all shadow-lg">
        <GripVertical size={20} />
      </div>
      <Image src={getPreviewUrl(item.photo_url, item.media_type)} alt="Vittya Gallery" fill className="object-cover" unoptimized />
      {item.media_type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="bg-white/20 p-5 rounded-full backdrop-blur-md border border-white/30"><PlayCircle size={40} className="text-white fill-white/20" /></div>
        </div>
      )}
      {!isOverlay && onDelete && (
        <div className="absolute inset-0 bg-linear-to-t from-[#1A4D2E]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center pb-10">
          <Button variant="destructive" size="sm" className="rounded-full h-12 px-8 shadow-2xl bg-red-500 hover:bg-red-600 border-2 border-white/20 font-black tracking-[0.2em] text-[10px]" onClick={(e) => { e.stopPropagation(); onDelete(item); }}>
            <Trash2 size={16} className="mr-2" /> REMOVE
          </Button>
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [userId, setUserId] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 12 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchGallery = useCallback(async () => {
    if (!projectId) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: invite } = await supabase
      .from("invitations")
      .select("user_id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();
    const { data: photos } = await supabase.from("gallery_photos").select("*").eq("invitation_id", projectId).order("position", { ascending: true });
    if (invite) setUserId(invite.user_id);
    if (photos) setGallery(photos as GalleryItem[]);
    setLoading(false);
  }, [projectId, supabase]);

  useEffect(() => { fetchGallery(); }, [fetchGallery]);

  const processUpload = async (file: File) => {
    if (!userId) return;
    
    // 1. Tambah Skeleton (Placeholder) ke UI
    const tempId = Math.random().toString(36).substr(2, 9);
    setGallery(prev => [...prev, { id: tempId, photo_url: '', media_type: file.type.startsWith('video') ? 'video' : 'image', position: prev.length, isTemp: true }]);

    try {
      let fileToUpload = file;
      if (!file.type.startsWith("video")) {
        fileToUpload = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("userId", userId);
      formData.append("invitationId", projectId);
      formData.append("assetType", "gallery");

      const res = await fetch("/api/cloudinary/upload", { method: "POST", body: formData });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error);

      const { data: newItem, error: dbError } = await supabase.from("gallery_photos").insert({
        invitation_id: projectId, photo_url: resData.url, media_type: file.type.startsWith('video') ? 'video' : 'image', position: gallery.length
      }).select().single();

      if (dbError) throw dbError;

      // 2. Ganti Skeleton dengan data asli
      setGallery(prev => prev.map(item => item.id === tempId ? (newItem as GalleryItem) : item));
    } catch (err) {
      setGallery(prev => prev.filter(item => item.id !== tempId));
      toast.error(`Failed to upload ${file.name}`);
    }
  };

  const handleNativeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => processUpload(file));
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    if (over && active.id !== over.id) {
      const oldIndex = gallery.findIndex((i) => i.id === active.id);
      const newIndex = gallery.findIndex((i) => i.id === over.id);
      const newArray = arrayMove(gallery, oldIndex, newIndex);
      setGallery(newArray);
      
      const updates = newArray.map((item, index) => ({ id: item.id, position: index, invitation_id: projectId }));
      await supabase.from("gallery_photos").upsert(updates);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#FDF8F3]"><Loader2 className="animate-spin text-[#1A4D2E]" size={48} /></div>;

  return (
    <div 
      className={cn("min-h-screen transition-all duration-500 pb-40 px-6", isDragOver ? "bg-[#1A4D2E]/5 scale-[0.995]" : "bg-[#FDF8F3]/40")}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleNativeDrop}
    >
      {/* NATIVE DROP OVERLAY */}
      {isDragOver && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none p-10">
          <div className="w-full h-full border-8 border-dashed border-[#C5A371] rounded-[5rem] bg-[#1A4D2E]/90 flex flex-col items-center justify-center gap-6 animate-in zoom-in duration-300">
            <div className="bg-white p-8 rounded-full shadow-2xl animate-bounce">
              <UploadCloud size={64} className="text-[#1A4D2E]" />
            </div>
            <h2 className="text-4xl font-serif italic text-white">Unleash your Masterpieces</h2>
            <p className="text-[#C5A371] font-black uppercase tracking-[0.3em]">Drop anywhere to start curating</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-7xl mx-auto py-12 flex flex-col md:flex-row justify-between items-center gap-8 border-b border-[#E8DFD3] mb-12">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 bg-[#1A4D2E] rounded-2xl text-[#C5A371]"><Camera size={24} /></div>
            <h1 className="text-5xl font-serif italic font-bold text-[#1A4D2E]">Gallery <span className="text-[#C5A371]">CURATION</span></h1>
          </div>
          <p className="text-[#A9907E] font-bold text-[10px] tracking-[0.4em] uppercase mt-2">The art of visual storytelling</p>
        </div>
        <label className="flex items-center gap-4 bg-[#1A4D2E] text-white px-12 py-6 rounded-full font-serif italic text-2xl cursor-pointer shadow-2xl hover:scale-105 active:scale-95 transition-all group">
          <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={(e) => e.target.files && Array.from(e.target.files).forEach(processUpload)} />
          <UploadCloud size={28} className="text-[#C5A371] group-hover:rotate-12 transition-transform" /> Add Media
        </label>
      </div>

      <div className="max-w-7xl mx-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={(e) => setActiveItem(gallery.find(i => i.id === e.active.id) || null)} onDragEnd={onDragEnd}>
          <SortableContext items={gallery.map((g) => g.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {gallery.map((item) => (
                <SortablePhoto key={item.id} item={item} onDelete={(item) => {
                  setGallery(prev => prev.filter(p => p.id !== item.id));
                  supabase.from("gallery_photos").delete().eq("id", item.id).then(() => toast.success("Removed"));
                }} />
              ))}
              
              {/* ADD MORE CARD AS DROPZONE */}
              <label className="flex flex-col items-center justify-center aspect-3/4 rounded-[2.5rem] border-4 border-dashed border-[#E8DFD3] bg-white/40 hover:bg-white hover:border-[#1A4D2E] text-[#A9907E] cursor-pointer transition-all group shadow-sm hover:shadow-2xl">
                <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={(e) => e.target.files && Array.from(e.target.files).forEach(processUpload)} />
                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-5 group-hover:bg-[#1A4D2E] group-hover:text-white transition-all duration-500"><Plus size={36} /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Drop / Click</span>
              </label>
            </div>
          </SortableContext>
          <DragOverlay adjustScale>{activeItem ? <SortablePhoto item={activeItem} isOverlay /> : null}</DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
