"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Loader2,
  Camera,
  ShieldCheck,
  UserCheck,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface GuestData {
  id: string;
  name: string;
  has_attended: boolean;
}

export default function QRScannerPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lastGuest, setLastGuest] = useState<GuestData | null>(null);

  // ✅ 1. VALIDASI PIN WO
  const handleAuth = async () => {
    setVerifying(true);
    const { data, error } = await supabase
      .from("invitations")
      .select("checkin_pin")
      .eq("id", projectId)
      .single();

    if (data?.checkin_pin === pin) {
      setIsAuthenticated(true);
      toast.success("Akses Diterima", {
        description: "Scanner siap digunakan.",
      });
    } else {
      toast.error("PIN Salah", {
        description: "Silakan hubungi admin pengantin.",
      });
    }
    setVerifying(false);
  };

  // ✅ 2. ENGINE SCANNER (Html5Qrcode)
  useEffect(() => {
    if (!isAuthenticated || !projectId) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    );

    const onScanSuccess = async (decodedText: string) => {
      // DecodeText adalah ID Tamu
      scanner.pause();
      setScanning(true);

      const { data: guest, error } = await supabase
        .from("guests")
        .update({ has_attended: true, attended_at: new Date().toISOString() })
        .eq("id", decodedText)
        .eq("invitation_id", projectId)
        .select("id, name, has_attended")
        .single();

      if (error) {
        toast.error("QR Tidak Valid", {
          description: "Data tamu tidak ditemukan di sistem.",
        });
      } else {
        setLastGuest(guest as GuestData);
        toast.success(`Berhasil!`, {
          description: `${guest.name} telah masuk.`,
        });
      }

      setScanning(false);
      setTimeout(() => scanner.resume(), 2000); // Resume setelah 2 detik
    };

    scanner.render(onScanSuccess, (err) => {});

    return () => {
      scanner.clear().catch((e) => console.error("Scanner Clear Error", e));
    };
  }, [isAuthenticated, projectId, supabase]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Portal Panitia
            </h1>
            <p className="text-slate-400 font-medium text-sm italic">
              Masukkan PIN keamanan untuk akses scanner.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="••••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="h-16 text-center text-3xl tracking-[0.5em] bg-slate-900 border-slate-800 focus:border-indigo-500 transition-all font-black"
              maxLength={6}
            />
            <Button
              onClick={handleAuth}
              disabled={verifying || pin.length < 4}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-lg font-black rounded-2xl transition-all active:scale-95"
            >
              {verifying ? (
                <Loader2 className="animate-spin" />
              ) : (
                "MASUK SCANNER"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <header className="flex items-center justify-between pb-4 border-b border-white/10">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2" size={18} /> Back
          </Button>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />{" "}
            Scanner Active
          </div>
        </header>

        <main className="space-y-6">
          <div
            id="reader"
            className="overflow-hidden rounded-[2.5rem] border-4 border-white/10 bg-slate-900 shadow-2xl"
          ></div>

          {lastGuest && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-indigo-600 border-none text-white overflow-hidden shadow-2xl shadow-indigo-500/20">
                <CardContent className="p-6 flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <UserCheck size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest leading-none mb-1">
                      Tamu Terakhir
                    </p>
                    <h3 className="text-xl font-black leading-tight">
                      {lastGuest.name}
                    </h3>
                    <p className="text-xs font-bold text-emerald-300 mt-1 uppercase">
                      Berhasil Check-in
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!lastGuest && (
            <div className="text-center py-10 opacity-30 border-2 border-dashed border-white/10 rounded-[2.5rem]">
              <Camera size={48} className="mx-auto mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">
                Arahkan ke QR Tamu
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
