"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  Map as MapIcon,
  MapPin,
  Save,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Reusable Input Style untuk Luxury Look
const luxuryInputClass =
  "h-14 rounded-2xl border-2 border-[#E8DFD3] bg-[#FDF8F3] font-bold text-[#1A4D2E] focus-visible:ring-[#1A4D2E] focus-visible:border-[#1A4D2E] transition-all duration-300 placeholder:text-[#A9907E]/50";
const luxuryTextareaClass =
  "rounded-2xl border-2 border-[#E8DFD3] bg-[#FDF8F3] font-medium text-[#1A4D2E] focus-visible:ring-[#1A4D2E] focus-visible:border-[#1A4D2E] transition-all duration-300 placeholder:text-[#A9907E]/50 p-4 min-h-[120px]";

export default function EventPage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [akad, setAkad] = useState({
    date: "",
    start: "",
    end: "",
    untilFinish: false,
    place: "",
    address: "",
    map: "",
  });
  const [reception, setReception] = useState({
    date: "",
    start: "",
    end: "",
    untilFinish: false,
    place: "",
    address: "",
    map: "",
  });

  const getData = useCallback(async () => {
    if (!projectId) return;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", user.id)
        .single();
      if (!error && data) {
        const formatDate = (dateStr: string | null) =>
          dateStr ? dateStr.substring(0, 10) : "";
        setAkad({
          date: formatDate(data.akad_date),
          start: data.akad_start_time || "",
          end: data.akad_end_time || "",
          untilFinish: !!(data.akad_start_time && !data.akad_end_time),
          place: data.akad_place || "",
          address: data.akad_address || "",
          map: data.akad_map_link || "",
        });
        setReception({
          date: formatDate(data.reception_date),
          start: data.reception_start_time || "",
          end: data.reception_end_time || "",
          untilFinish: !!(
            data.reception_start_time && !data.reception_end_time
          ),
          place: data.reception_place || "",
          address: data.reception_address || "",
          map: data.reception_map_link || "",
        });
      }
    } finally {
      setFetching(false);
    }
  }, [projectId, supabase]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const { error } = await supabase
        .from("invitations")
        .update({
          akad_date: akad.date || null,
          akad_start_time: akad.start,
          akad_end_time: akad.untilFinish ? null : akad.end,
          akad_place: akad.place,
          akad_address: akad.address,
          akad_map_link: akad.map,
          reception_date: reception.date || null,
          reception_start_time: reception.start,
          reception_end_time: reception.untilFinish ? null : reception.end,
          reception_place: reception.place,
          reception_address: reception.address,
          reception_map_link: reception.map,
        })
        .eq("id", projectId)
        .eq("user_id", user.id);

      if (!error) {
        toast.success("Schedule Synchronized!", {
          description: "Data acara berhasil diperbarui secara premium.",
        });
      } else throw error;
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FDF8F3]">
        <Image
          src="/logo-Vittya.png"
          alt="Loading"
          width={60}
          height={60}
          className="animate-pulse"
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#3E3E3E] pb-44">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-[#E8DFD3] pb-12 gap-8">
          <div className="flex items-center gap-5">
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-[#E8DFD3]">
              <Image
                src="/logo-Vittya.png"
                alt="Vittya"
                width={45}
                height={45}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-serif italic font-bold text-[#1A4D2E]">
                  Event Schedule
                </h1>
                <Badge className="bg-[#C5A371] text-white rounded-full text-[9px] uppercase tracking-widest px-3 border-none">
                  Timeline
                </Badge>
              </div>
              <p className="text-[#A9907E] font-black uppercase tracking-[0.3em] text-[10px]">
                Ceremony Logistics v2.1
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#E8DFD3]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-[#1A4D2E] uppercase tracking-widest">
              Cloud Sync Active
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mt-12">
          {/* AKAD CARD */}
          <EventCard
            title="Akad Nikah"
            accentColor="bg-[#1A4D2E]"
            icon={<CheckCircle2 className="text-white" size={20} />}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                  Wedding Date
                </Label>
                <div className="relative group">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A4D2E] z-10"
                    size={18}
                  />
                  <Input
                    type="date"
                    className={cn(luxuryInputClass, "pl-12")}
                    value={akad.date}
                    onChange={(e) => setAkad({ ...akad, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    className={luxuryInputClass}
                    value={akad.start}
                    onChange={(e) =>
                      setAkad({ ...akad, start: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                    End Time
                  </Label>
                  <Input
                    type="time"
                    disabled={akad.untilFinish}
                    className={cn(
                      luxuryInputClass,
                      akad.untilFinish &&
                        "bg-[#E8DFD3]/30 border-dashed opacity-60 text-[#A9907E]",
                    )}
                    value={akad.end}
                    onChange={(e) => setAkad({ ...akad, end: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-5 bg-white rounded-2xl border-2 border-[#E8DFD3] shadow-sm">
                <Checkbox
                  id="akad-finish"
                  checked={akad.untilFinish}
                  onCheckedChange={(c) =>
                    setAkad({
                      ...akad,
                      untilFinish: c as boolean,
                      end: c ? "" : akad.end,
                    })
                  }
                  className="w-5 h-5 data-[state=checked]:bg-[#1A4D2E] border-2 border-[#1A4D2E] rounded-md"
                />
                <label
                  htmlFor="akad-finish"
                  className="text-[11px] font-bold text-[#1A4D2E] uppercase cursor-pointer tracking-wider"
                >
                  Set as "Sampai Selesai"
                </label>
              </div>

              <div className="space-y-5 pt-8 mt-4 border-t-2 border-dashed border-[#E8DFD3]">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                    Venue Name
                  </Label>
                  <Input
                    placeholder="Example: Grand Al-Azhar Mosque"
                    className={luxuryInputClass}
                    value={akad.place}
                    onChange={(e) =>
                      setAkad({ ...akad, place: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                    Full Address
                  </Label>
                  <Textarea
                    placeholder="Enter the complete physical address..."
                    className={luxuryTextareaClass}
                    value={akad.address}
                    onChange={(e) =>
                      setAkad({ ...akad, address: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                    Google Maps Link
                  </Label>
                  <div className="relative group">
                    <MapIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A4D2E] z-10"
                      size={18}
                    />
                    <Input
                      className={cn(
                        luxuryInputClass,
                        "pl-12 font-medium text-xs",
                      )}
                      placeholder="https://maps.google.com/..."
                      value={akad.map}
                      onChange={(e) =>
                        setAkad({ ...akad, map: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </EventCard>

          {/* RECEPTION CARD */}
          <EventCard
            title="Resepsi"
            accentColor="bg-[#C5A371]"
            icon={<Sparkles className="text-white" size={20} />}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                  Reception Date
                </Label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A371] z-10"
                    size={18}
                  />
                  <Input
                    type="date"
                    className={cn(
                      luxuryInputClass,
                      "pl-12 text-[#C5A371] focus-visible:ring-[#C5A371] focus-visible:border-[#C5A371]",
                    )}
                    value={reception.date}
                    onChange={(e) =>
                      setReception({ ...reception, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    className={cn(
                      luxuryInputClass,
                      "text-[#C5A371] focus-visible:ring-[#C5A371] focus-visible:border-[#C5A371]",
                    )}
                    value={reception.start}
                    onChange={(e) =>
                      setReception({ ...reception, start: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                    End Time
                  </Label>
                  <Input
                    type="time"
                    disabled={reception.untilFinish}
                    className={cn(
                      luxuryInputClass,
                      "text-[#C5A371] focus-visible:ring-[#C5A371] focus-visible:border-[#C5A371]",
                      reception.untilFinish &&
                        "bg-[#E8DFD3]/30 border-dashed opacity-60",
                    )}
                    value={reception.end}
                    onChange={(e) =>
                      setReception({ ...reception, end: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-5 bg-white rounded-2xl border-2 border-[#E8DFD3] shadow-sm">
                <Checkbox
                  id="recep-finish"
                  checked={reception.untilFinish}
                  onCheckedChange={(c) =>
                    setReception({
                      ...reception,
                      untilFinish: c as boolean,
                      end: c ? "" : reception.end,
                    })
                  }
                  className="w-5 h-5 data-[state=checked]:bg-[#C5A371] border-2 border-[#C5A371] rounded-md"
                />
                <label
                  htmlFor="recep-finish"
                  className="text-[11px] font-bold text-[#C5A371] uppercase cursor-pointer tracking-wider"
                >
                  Set as "Sampai Selesai"
                </label>
              </div>

              <div className="space-y-5 pt-8 mt-4 border-t-2 border-dashed border-[#E8DFD3]">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                    Venue / Ballroom
                  </Label>
                  <Input
                    placeholder="Example: The Ritz-Carlton Ballroom"
                    className={cn(
                      luxuryInputClass,
                      "text-[#C5A371] focus-visible:ring-[#C5A371] focus-visible:border-[#C5A371]",
                    )}
                    value={reception.place}
                    onChange={(e) =>
                      setReception({ ...reception, place: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                    Location Address
                  </Label>
                  <Textarea
                    placeholder="Detailed hotel or hall address..."
                    className={cn(
                      luxuryTextareaClass,
                      "text-[#C5A371] focus-visible:ring-[#C5A371] focus-visible:border-[#C5A371]",
                    )}
                    value={reception.address}
                    onChange={(e) =>
                      setReception({ ...reception, address: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-[#A9907E]">
                    Maps URL
                  </Label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A371] z-10"
                      size={18}
                    />
                    <Input
                      className={cn(
                        luxuryInputClass,
                        "pl-12 font-medium text-xs text-[#C5A371] focus-visible:ring-[#C5A371] focus-visible:border-[#C5A371]",
                      )}
                      placeholder="https://maps.google.com/..."
                      value={reception.map}
                      onChange={(e) =>
                        setReception({ ...reception, map: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </EventCard>
        </div>

        {/* SAVE BAR */}
        <div className="fixed bottom-10 left-1/2 z-[100] w-full max-w-lg -translate-x-1/2 px-6">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full h-20 rounded-[2.5rem] bg-[#1A4D2E] hover:bg-[#123520] text-white shadow-[0_25px_60px_-15px_rgba(26,77,46,0.5)] font-serif italic text-2xl border-4 border-white transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-3" />
            ) : (
              <Save size={24} className="mr-4 text-[#C5A371]" />
            )}
            Save & Update Events
          </Button>
        </div>
      </div>
    </div>
  );
}

function EventCard({ title, accentColor, icon, children }: any) {
  return (
    <div className="bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden border border-[#E8DFD3]/50 transition-all duration-500 hover:shadow-2xl">
      <div
        className={cn("p-10 flex items-center justify-between", accentColor)}
      >
        <div className="flex items-center gap-5">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/30">
            {icon}
          </div>
          <h3 className="font-serif italic text-3xl text-white tracking-tight">
            {title}
          </h3>
        </div>
        <div className="w-12 h-1 bg-white/30 rounded-full" />
      </div>
      <div className="p-12 bg-white">{children}</div>
    </div>
  );
}
