"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  Plus,
  LogOut,
  LayoutDashboard,
  QrCode,
  TicketPercent,
  Search,
  ExternalLink,
  Trash2,
  TrendingUp,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SafeHydration from "@/components/system/SafeHydration";
import { toast } from "sonner";

interface Project {
  id: string;
  groom_name: string;
  bride_name: string;
  slug: string;
  akad_date: string;
  groom_photo: string | null;
  created_at: string;
}

export default function Dashboard() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      const { data: invitations } = await supabase
        .from("invitations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (invitations) {
        setProjects(invitations.map((inv: any) => ({
          id: inv.id,
          groom_name: inv.groom_name || "Pria",
          bride_name: inv.bride_name || "Wanita",
          slug: inv.slug || inv.id,
          akad_date: inv.akad_date,
          groom_photo: inv.groom_photo,
          created_at: inv.created_at,
        })));
      }
      setLoading(false);
    };
    initData();
  }, [supabase]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      toast.error("Logout failed");
      setLoggingOut(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("PERINGATAN: Hapus total project ini? Semua foto di storage dan data tamu akan lenyap selamanya!")) return;
    setDeletingId(projectId);
    try {
      const res = await fetch("/api/project/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal hapus total");
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success("Storage & Database Vittya dibersihkan!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfd]">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-24 rounded-full border-4 border-indigo-50 border-t-indigo-600 animate-spin" />
        <Image 
          src="/logo-Vittya.png" 
          width={40} 
          height={40} 
          alt="Vittya" 
          className="animate-pulse" 
          priority // Prioritas tinggi karena ini loader utama
        />
      </div>
      <p className="mt-12 font-bold text-slate-400 tracking-widest text-xs uppercase">Initializing Experience</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-indigo-100">
      {/* --- PRESTIGE NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative size-11 flex items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200 transition-transform group-hover:rotate-6">
                <Image 
                  src="/logo-Vittya.png" 
                  fill 
                  sizes="44px" // Nav icon fix
                  className="object-cover p-1.5 invert" 
                  alt="Logo" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">VITTYA</span>
                <span className="text-[10px] font-black text-indigo-600 tracking-[0.2em] uppercase">Digital Excellence</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                </p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Verified Partner</p>
              </div>
              <div className="size-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md">
                {(user?.user_metadata?.full_name || user?.email)?.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-50"
            >
              {loggingOut ? <Loader2 size={22} className="animate-spin text-red-600" /> : <LogOut size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="animate-in fade-in slide-in-from-left-6 duration-1000">
            <h2 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
              Hello, <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500">{user?.user_metadata?.full_name?.split(" ")[0] || "Chief"}</span>!
            </h2>
            <p className="mt-4 text-slate-500 font-medium text-lg">Kelola setiap detail momen bahagia dengan standar nomor satu.</p>
          </div>
          <Link href="/dashboard/create">
            <Button className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-sm tracking-widest transition-all hover:-translate-y-1 shadow-2xl shadow-indigo-100 active:scale-95 uppercase">
              <Plus className="mr-3" size={20} /> New Creation
            </Button>
          </Link>
        </div>

        {/* --- ANALYTICS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          {[
            { label: "Active Project", val: projects.length, icon: LayoutDashboard, color: "bg-indigo-600" },
            { label: "Guest Check-in", val: "0", icon: QrCode, color: "bg-purple-600" },
            { label: "Referral Valid", val: "0", icon: TicketPercent, color: "bg-pink-600" }
          ].map((stat, i) => (
            <div key={i} className="group relative bg-white p-8 rounded-4xl border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-indigo-500/5">
              <div className={`size-14 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <stat.icon size={26} />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <div className="flex items-center gap-3">
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stat.val}</h3>
                <div className="h-6 px-2 bg-emerald-50 rounded-lg flex items-center gap-1 text-emerald-600 text-[10px] font-black">
                  <TrendingUp size={12} /> 0%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- PROJECT LISTING --- */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic">Recent Project</h3>
            <div className="hidden sm:flex items-center gap-4">
               <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input className="h-12 w-64 bg-slate-100 rounded-2xl pl-12 pr-4 border-none text-sm font-medium focus:ring-2 focus:ring-indigo-600 transition-all" placeholder="Find project..." />
               </div>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[40px] bg-white/50 animate-in fade-in zoom-in-95">
              <div className="size-24 bg-white rounded-4xl flex items-center justify-center shadow-xl mb-8">
                <Plus size={40} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm text-center">Belum ada mahakarya.<br/><Link href="/dashboard/create" className="text-indigo-600 hover:underline">Mulai sekarang.</Link></p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((p, idx) => (
                <div key={p.id} className="group relative bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
                  <div className="aspect-4/5 relative overflow-hidden">
                    {p.groom_photo ? (
                      <Image 
                        src={p.groom_photo} 
                        alt="Hero" 
                        fill 
                        priority={idx === 0} // Fix LCP: Prioritaskan item pertama
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Fix missing sizes
                        className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <Image 
                          src="/logo-Vittya.png" 
                          width={80} 
                          height={80} 
                          alt="Vittya" 
                          className="grayscale opacity-10" 
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/95 via-slate-900/20 to-transparent" />
                    <div className="absolute top-6 right-6">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl text-white">
                        <Settings size={18} className="animate-[spin_4s_linear_infinite]" />
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Status: Published</span>
                      </div>
                      <h4 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter mb-1">
                        {p.groom_name} <span className="text-indigo-400">&</span> {p.bride_name}
                      </h4>
                      <p className="text-slate-400 text-xs font-bold flex items-center gap-1 uppercase tracking-widest">
                        <ExternalLink size={12} /> vittya.com/{p.slug}
                      </p>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex flex-col">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Date</p>
                        <SafeHydration
                          fallback={
                            <p className="text-sm font-bold text-slate-900">
                              ...
                            </p>
                          }
                        >
                          <p className="text-sm font-bold text-slate-900">
                            {p.akad_date
                              ? new Date(p.akad_date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )
                              : "Not Set"}
                          </p>
                        </SafeHydration>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteProject(p.id)}
                        disabled={deletingId === p.id}
                        className="size-12 rounded-2xl text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {deletingId === p.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={20} />}
                      </Button>
                    </div>
                    <Link href={`/dashboard/project/${p.id}`}>
                      <Button className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-xs transition-all group/btn shadow-xl shadow-slate-100">
                        Manage Invitation <ChevronRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-30 grayscale">
          <Image 
            src="/logo-Vittya.png" 
            width={24} 
            height={24} 
            alt="Logo" 
          />
          <span className="text-xs font-black tracking-widest">VITTYA CORE SYSTEM v1.0</span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">© 2026 Vittya Digital | DWI Excellence #1</p>
      </footer>
    </div>
  );
}
