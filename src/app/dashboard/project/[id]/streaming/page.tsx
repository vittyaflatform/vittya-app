"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Pastikan sudah install shadcn switch
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  Camera,
  Instagram,
  Loader2,
  MonitorPlay,
  PlayCircle,
  Plus,
  Power,
  PowerOff,
  Save,
  Trash2,
  Video,
  Youtube,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PLATFORM_OPTIONS = [
  {
    id: "youtube",
    label: "YouTube Live",
    icon: <Youtube className="text-red-500" />,
  },
  {
    id: "instagram",
    label: "Instagram Live",
    icon: <Instagram className="text-pink-500" />,
  },
  {
    id: "zoom",
    label: "Zoom / G-Meet",
    icon: <Video className="text-blue-500" />,
  },
  {
    id: "other",
    label: "Other Platform",
    icon: <Camera className="text-[#C5A371]" />,
  },
];

export default function MultiStreamingPage() {
  const supabase = createClient();
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(false); // State untuk Toggle On/Off
  const [streams, setStreams] = useState<{ platform: string; url: string }[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("invitations")
        .select("streaming_links, is_streaming_active")
        .eq("id", projectId)
        .single();

      if (data) {
        setStreams(data.streaming_links || [{ platform: "youtube", url: "" }]);
        setIsActive(data.is_streaming_active || false);
      }
      setLoading(false);
    };
    fetchData();
  }, [projectId, supabase]);

  const addStream = () => {
    if (streams.length >= 3) return toast.error("Maksimal 3 channel, Bro!");
    setStreams([...streams, { platform: "youtube", url: "" }]);
  };

  const removeStream = (index: number) => {
    const newStreams = streams.filter((_, i) => i !== index);
    setStreams(newStreams);
  };

  const updateStream = (
    index: number,
    field: "platform" | "url",
    value: string,
  ) => {
    const newStreams = [...streams];
    newStreams[index][field] = value;
    setStreams(newStreams);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("invitations")
      .update({
        streaming_links: streams,
        is_streaming_active: isActive,
      })
      .eq("id", projectId);

    if (!error) toast.success("Broadcast status updated!");
    else toast.error("Error: " + error.message);
    setSaving(false);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDF8F3]">
        <Loader2 className="animate-spin text-[#1A4D2E]" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDF8F3] pb-40 px-6">
      <div className="max-w-6xl mx-auto pt-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#E8DFD3] pb-12 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1A4D2E] rounded-xl text-[#C5A371]">
                <MonitorPlay size={24} />
              </div>
              <h1 className="text-5xl font-serif italic font-bold text-[#1A4D2E]">
                Broadcast <span className="text-[#C5A371]">CENTER</span>
              </h1>
            </div>
            <p className="text-[#A9907E] font-black uppercase tracking-[0.4em] text-[10px]">
              Control your virtual wedding visibility
            </p>
          </div>

          {/* TOGGLE SWITCH AREA */}
          <div
            className={cn(
              "flex items-center gap-4 p-4 rounded-3xl transition-all border-2",
              isActive
                ? "bg-[#1A4D2E] border-[#1A4D2E] shadow-lg shadow-[#1A4D2E]/20"
                : "bg-white border-[#E8DFD3]",
            )}
          >
            <div
              className={cn(
                "p-2 rounded-full",
                isActive
                  ? "bg-[#C5A371] text-[#1A4D2E]"
                  : "bg-slate-100 text-slate-400",
              )}
            >
              {isActive ? <Power size={20} /> : <PowerOff size={20} />}
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  isActive ? "text-white" : "text-[#A9907E]",
                )}
              >
                {isActive ? "Feature Active" : "Feature Disabled"}
              </span>
              <span
                className={cn(
                  "text-[9px] font-serif italic",
                  isActive ? "text-white/60" : "text-slate-400",
                )}
              >
                {isActive ? "Visible on invitation" : "Hidden from guests"}
              </span>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              className="data-[state=checked]:bg-[#C5A371]"
            />
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="grid lg:grid-cols-12 gap-12 mt-12"
        >
          <div
            className={cn(
              "lg:col-span-7 space-y-6 transition-all duration-500",
              !isActive && "opacity-50 pointer-events-none grayscale-[0.5]",
            )}
          >
            <div className="flex justify-between items-center px-4">
              <h3 className="font-serif italic text-[#1A4D2E] text-xl">
                Channel Configuration
              </h3>
              <Button
                type="button"
                onClick={addStream}
                variant="ghost"
                className="text-[#1A4D2E] hover:bg-[#1A4D2E]/5 rounded-full text-xs font-bold uppercase tracking-widest"
              >
                <Plus size={16} className="mr-2" /> Add Channel
              </Button>
            </div>

            {streams.map((stream, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#E8DFD3] relative animate-in slide-in-from-bottom-2"
              >
                {streams.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStream(index)}
                    className="absolute top-6 right-6 text-red-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#A9907E]">
                      Platform
                    </Label>
                    <select
                      value={stream.platform}
                      onChange={(e) =>
                        updateStream(index, "platform", e.target.value)
                      }
                      className="w-full h-12 bg-[#FDF8F3] border-none rounded-xl px-4 text-xs font-bold text-[#1A4D2E]"
                    >
                      {PLATFORM_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#A9907E]">
                      URL
                    </Label>
                    <Input
                      value={stream.url}
                      onChange={(e) =>
                        updateStream(index, "url", e.target.value)
                      }
                      className="h-12 bg-[#FDF8F3] border-none rounded-xl px-4 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1A4D2E] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
              <div className="relative z-10">
                <PlayCircle className="text-[#C5A371] mb-6" size={48} />
                <h3 className="text-3xl font-serif italic mb-4">
                  Final Master Switch
                </h3>
                <p className="text-sm opacity-70 font-serif italic leading-relaxed">
                  "Meskipun link sudah diisi, fitur tidak akan muncul di
                  undangan jika tombol toggle di atas dalam posisi OFF. Gunakan
                  ini untuk mengontrol kapan live streaming mulai
                  dipublikasikan."
                </p>
              </div>

              <div className="mt-12 relative z-10">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full h-16 rounded-full bg-[#C5A371] hover:bg-[#B39260] text-[#1A4D2E] shadow-xl font-serif italic text-xl border-4 border-[#1A4D2E] transition-all"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Save size={20} className="mr-3" /> Sync All Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
