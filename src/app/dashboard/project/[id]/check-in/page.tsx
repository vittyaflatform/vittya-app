"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import {
  Loader2,
  QrCode,
  Copy,
  ShieldCheck,
  ExternalLink,
  Users,
  Smartphone,
  RefreshCw,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import QRCode from "react-qr-code";
import { cn } from "@/lib/utils";

// ✅ 1. INTERFACE SOLID
interface Guest {
  id: string;
  name: string;
  category: string;
  has_attended: boolean;
  attended_at: string;
}

interface ProjectData {
  id: string;
  slug: string;
  checkin_pin: string;
  groom_name: string;
}

export default function CheckInDashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [stats, setStats] = useState({ total: 0, present: 0 });
  const [recentGuests, setRecentGuests] = useState<Guest[]>([]);
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [newPin, setNewPin] = useState("");

  // ✅ 2. LOGIKA FETCH & STATS (useCallback)
  const updateStats = useCallback((guests: Guest[]) => {
    setStats({
      total: guests.length,
      present: guests.filter((g) => g.has_attended).length,
    });
    const attended = guests
      .filter((g) => g.has_attended)
      .sort(
        (a, b) =>
          new Date(b.attended_at).getTime() - new Date(a.attended_at).getTime(),
      );
    setRecentGuests(attended.slice(0, 5));
  }, []);

  const fetchData = useCallback(async () => {
    if (!projectId) return;

    const [projectRes, guestsRes] = await Promise.all([
      supabase
        .from("invitations")
        .select("id, slug, checkin_pin, groom_name")
        .eq("id", projectId)
        .single(),
      supabase
        .from("guests")
        .select("id, name, category, has_attended, attended_at")
        .eq("invitation_id", projectId),
    ]);

    if (projectRes.data) {
      setProjectData(projectRes.data as ProjectData);
      setNewPin(projectRes.data.checkin_pin || "123456");
    }

    if (guestsRes.data) {
      updateStats(guestsRes.data as Guest[]);
    }
    setLoading(false);
  }, [projectId, supabase, updateStats]);

  // ✅ 3. REALTIME SYNC
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("checkin-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "guests",
          filter: `invitation_id=eq.${projectId}`,
        },
        () => {
          fetchData(); // Refresh data saat ada update
          toast.info("Update Kehadiran!", {
            icon: <Users className="w-4 h-4 text-emerald-500" />,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, projectId, supabase]);

  const handleUpdatePin = async () => {
    if (newPin.length < 4) return toast.error("PIN minimal 4 digit");
    const { error } = await supabase
      .from("invitations")
      .update({ checkin_pin: newPin })
      .eq("id", projectId);
    if (!error) {
      toast.success("PIN Diupdate!");
      setProjectData((prev) =>
        prev ? { ...prev, checkin_pin: newPin } : null,
      );
      setIsEditingPin(false);
    }
  };

  const staffLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/scan/${projectId}`
      : "";

  if (loading)
    return (
      <div className="h-60 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
            Manajemen Absensi
          </h1>
          <p className="text-slate-500 font-medium">
            Monitoring arus tamu undangan secara real-time.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border px-6 py-2 rounded-2xl shadow-sm text-center">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Terdaftar
            </p>
            <p className="text-xl font-black">{stats.total}</p>
          </div>
          <div className="bg-emerald-600 text-white px-6 py-2 rounded-2xl shadow-xl shadow-emerald-100 text-center animate-pulse">
            <p className="text-[10px] font-black uppercase text-emerald-200">
              Hadir
            </p>
            <p className="text-xl font-black">{stats.present}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* ACCESS CARD */}
          <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-40 bg-indigo-600 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
            <CardHeader className="relative z-10 pb-0">
              <div className="flex items-center gap-3 text-indigo-300 mb-4 bg-indigo-500/10 w-fit px-4 py-1.5 rounded-full border border-indigo-500/20">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Portal Keamanan WO
                </span>
              </div>
              <CardTitle className="text-3xl font-black tracking-tighter">
                Akses Scanner Panitia
              </CardTitle>
              <CardDescription className="text-slate-400 font-medium">
                Gunakan link ini pada perangkat petugas di lokasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8 relative z-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Scanner Endpoint URL
                </Label>
                <div className="flex gap-3">
                  <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 flex-1 text-sm font-mono truncate text-indigo-300 select-all font-bold tracking-tight">
                    {staffLink}
                  </div>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(staffLink);
                      toast.success("Link Tersalin!");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 h-14 w-14 rounded-xl"
                  >
                    <Copy size={20} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    PIN Otorisasi (6 Digit)
                  </Label>
                  <button
                    onClick={() => setIsEditingPin(true)}
                    className="text-[10px] font-black uppercase text-indigo-400 hover:text-white transition-colors"
                  >
                    Ubah PIN
                  </button>
                </div>
                {isEditingPin ? (
                  <div className="flex gap-3 items-center animate-in slide-in-from-right-2">
                    <Input
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white w-40 text-2xl h-14 font-black tracking-[0.3em] text-center"
                      maxLength={6}
                    />
                    <Button
                      onClick={handleUpdatePin}
                      className="bg-emerald-600 h-14 rounded-xl font-bold px-6"
                    >
                      SIMPAN
                    </Button>
                    <Button
                      onClick={() => setIsEditingPin(false)}
                      variant="ghost"
                      className="text-slate-400 h-14"
                    >
                      BATAL
                    </Button>
                  </div>
                ) : (
                  <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-2xl px-10 py-4 text-4xl font-black tracking-[0.4em] text-emerald-400 w-fit">
                    {projectData?.checkin_pin || "123456"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* LIVE FEED */}
          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                <RefreshCw
                  size={20}
                  className="text-indigo-600 animate-spin-slow"
                />{" "}
                Real-time Presence Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {recentGuests.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs opacity-40 italic">
                  Menunggu kedatangan tamu...
                </div>
              ) : (
                recentGuests.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-slate-100/80 animate-in slide-in-from-left-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shadow-inner">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none">
                          {g.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">
                          {new Date(g.attended_at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          WIB • {g.category}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-white text-emerald-600 border-emerald-200 shadow-sm font-bold">
                      TERVERIFIKASI
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* PRINT CARD */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border-2 border-indigo-100 shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-indigo-50/50 text-center pb-6">
              <CardTitle className="text-indigo-900 font-black tracking-tight">
                QR Meja Petugas
              </CardTitle>
              <CardDescription className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">
                Letakkan di Meja Penerima Tamu
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-8 pb-8 space-y-8 text-center">
              <div className="p-6 bg-white border-4 border-slate-900 rounded-4xl shadow-2xl">
                <QRCode value={staffLink} size={180} />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Security Pin Access
                </p>
                <p className="text-3xl font-black tracking-[0.2em] text-slate-900">
                  {projectData?.checkin_pin || "123456"}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-slate-300 font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white"
                onClick={() => window.print()}
              >
                PRINT QR PANITIA
              </Button>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-4xl space-y-2">
            <div className="flex items-center gap-2 text-amber-700 font-black text-xs uppercase tracking-tighter">
              <Smartphone size={16} /> Operational Tip
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed font-medium italic">
              Pastikan tim Wedding Organizer telah login menggunakan PIN di atas
              sebelum acara dimulai untuk kelancaran check-in tamu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
