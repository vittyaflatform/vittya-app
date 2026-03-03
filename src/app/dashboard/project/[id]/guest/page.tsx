"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { useDebounce } from "@/lib/use-debounce";
import { cn } from "@/lib/utils";
import {
  Copy,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  QrCode,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  Utensils,
  XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

interface Guest {
  id: string;
  name: string;
  category: string;
  pax: number;
  table_number: string;
  has_attended: boolean;
  created_at: string;
}

const PREDEFINED_CATEGORIES = [
  "Reguler",
  "VIP",
  "Keluarga",
  "Teman Kantor",
  "VVIP",
];

export default function GuestPage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [projectSlug, setProjectSlug] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryMode, setCategoryMode] = useState("Reguler");
  const [newGuest, setNewGuest] = useState({
    name: "",
    category: "Reguler",
    pax: "1",
    table_number: "",
  });
  const [selectedGuestQR, setSelectedGuestQR] = useState<Guest | null>(null);

  const fetchGuests = useCallback(async () => {
    if (!projectId) return;
    try {
      const [inviteRes, guestsRes] = await Promise.all([
        supabase
          .from("invitations")
          .select("slug")
          .eq("id", projectId)
          .single(),
        supabase
          .from("guests")
          .select("*")
          .eq("invitation_id", projectId)
          .order("name", { ascending: true }),
      ]);
      if (inviteRes.data) setProjectSlug(inviteRes.data.slug);
      if (guestsRes.data) setGuests(guestsRes.data as Guest[]);
    } catch (err) {
      toast.error("Database sync failed.");
    } finally {
      setLoading(false);
    }
  }, [projectId, supabase]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const handleAddGuest = async () => {
    if (!newGuest.name.trim()) return toast.error("Guest name is required!");
    setIsSubmitting(true);

    // Memastikan kategori yang dikirim benar (handle custom mode)
    const finalCategory =
      categoryMode === "Custom" ? newGuest.category : categoryMode;

    const { data, error } = await supabase
      .from("guests")
      .insert({
        invitation_id: projectId,
        name: newGuest.name,
        category: finalCategory || "Reguler",
        pax: parseInt(newGuest.pax) || 1,
        table_number: newGuest.table_number || "-",
      })
      .select()
      .single();

    if (!error && data) {
      setGuests((prev) =>
        [...prev, data as Guest].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setIsAddOpen(false);
      setNewGuest({
        name: "",
        category: "Reguler",
        pax: "1",
        table_number: "",
      });
      setCategoryMode("Reguler");
      toast.success("Guest added successfully!");
    } else {
      toast.error("Failed to add guest.");
    }
    setIsSubmitting(false);
  };

  const getInvitationLink = (guestName: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/invitation/${projectSlug}?to=${encodeURIComponent(guestName)}`;
  };

  const shareWhatsApp = (guestName: string) => {
    const link = getInvitationLink(guestName);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Pagi" : hour < 18 ? "Siang" : "Sore/Malam";

    const message = `Selamat ${greeting}, Yth. *${guestName}*.\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di acara spesial kami. Silakan buka tautan di bawah ini untuk melihat undangan digital Anda:\n\n${link}\n\nTerima kasih.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchName = g.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchCat =
        filterCategory === "all" || g.category === filterCategory;
      return matchName && matchCat;
    });
  }, [guests, debouncedSearch, filterCategory]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FDF8F3]">
        <div className="relative">
          <Loader2 className="animate-spin text-[#1A4D2E] w-14 h-14" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#C5A371] rounded-full"></div>
          </div>
        </div>
        <p className="mt-6 text-[#A9907E] font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
          Initializing Database
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDF8F3] pb-40 px-4 md:px-10 selection:bg-[#C5A371] selection:text-white">
      <div className="max-w-7xl mx-auto pt-16 space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#1A4D2E]/5 border border-[#1A4D2E]/10 rounded-full mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A4D2E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A4D2E]"></span>
              </span>
              <span className="text-[10px] font-bold text-[#1A4D2E] uppercase tracking-widest">
                Live Cloud Sync
              </span>
            </div>
            <h1 className="text-6xl font-serif italic font-bold text-[#1A4D2E] leading-tight">
              Guest{" "}
              <span className="text-[#C5A371] not-italic font-light">
                Directory
              </span>
            </h1>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="group rounded-2xl bg-[#1A4D2E] text-white hover:bg-[#123520] h-16 px-10 shadow-2xl border-b-4 border-[#0d2717] active:border-b-0 active:translate-y-1 transition-all">
                <UserPlus
                  size={20}
                  className="mr-3 text-[#C5A371] group-hover:scale-110 transition-transform"
                />
                <span className="font-bold tracking-tight text-white">
                  Add New Guest
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white border-none rounded-[2.5rem] shadow-3xl p-0 overflow-hidden">
              <div className="bg-[#1A4D2E] p-8 text-white">
                <DialogHeader className="sr-only">
                  <DialogTitle>Guest Registration</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col">
                  <h2 className="text-3xl font-serif italic font-bold text-white">
                    Guest Registration
                  </h2>
                  <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase mt-1">
                    Input VIP guest credentials
                  </p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Full Name Section */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#1A4D2E]">
                    Full Name
                  </label>
                  <Input
                    placeholder="e.g. Jonathan Doe"
                    value={newGuest.name}
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, name: e.target.value })
                    }
                    className="h-14 bg-[#FDF8F3] border-2 border-[#E8DFD3] rounded-xl focus:border-[#C5A371] focus:ring-0 transition-all text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>

                {/* Form Row: Classification & Pax */}
                {/* Pakai grid-cols-[1fr_100px] supaya Kolom Pax lebarnya tetap (fixed) & Classification yang fleksibel */}
                <div className="grid grid-cols-[1fr_110px] gap-4">
                  <div className="space-y-2 min-w-0">
                    {" "}
                    {/* min-w-0 penting untuk truncate child */}
                    <label className="text-[11px] font-black uppercase tracking-wider text-[#1A4D2E]">
                      Classification
                    </label>
                    <Select
                      value={categoryMode}
                      onValueChange={(val) => setCategoryMode(val)}
                    >
                      <SelectTrigger className="h-14 bg-[#FDF8F3] border-2 border-[#E8DFD3] rounded-xl text-slate-900 font-bold focus:ring-0 focus:border-[#C5A371] transition-all overflow-hidden">
                        {/* Truncate di sini supaya kalau text panjang gak dorong layout */}
                        <div className="truncate text-left pr-2">
                          <SelectValue />
                        </div>
                      </SelectTrigger>

                      <SelectContent className="rounded-2xl border-2 border-[#E8DFD3] bg-white shadow-2xl overflow-hidden">
                        {PREDEFINED_CATEGORIES.map((c) => (
                          <SelectItem
                            key={c}
                            value={c}
                            className="font-bold text-slate-900 py-3 focus:bg-[#1A4D2E] focus:text-white transition-colors cursor-pointer"
                          >
                            {c.toUpperCase()}
                          </SelectItem>
                        ))}
                        <SelectItem
                          value="Custom"
                          className="text-[#C5A371] font-black italic py-3 border-t border-[#E8DFD3] focus:bg-[#C5A371] focus:text-white transition-colors cursor-pointer"
                        >
                          + CUSTOM CATEGORY
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-[#1A4D2E]">
                      Total Pax
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={newGuest.pax}
                      onChange={(e) =>
                        setNewGuest({ ...newGuest, pax: e.target.value })
                      }
                      className="h-14 bg-[#FDF8F3] border-2 border-[#E8DFD3] rounded-xl text-slate-900 font-bold focus:ring-0 focus:border-[#C5A371] text-center"
                    />
                  </div>
                </div>

                {/* Custom Input Section */}
                {categoryMode === "Custom" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[11px] font-black uppercase tracking-wider text-[#C5A371]">
                      Specify Custom Label
                    </label>
                    <Input
                      placeholder="Enter category name..."
                      value={newGuest.category}
                      onChange={(e) =>
                        setNewGuest({ ...newGuest, category: e.target.value })
                      }
                      className="h-14 bg-white border-2 border-[#C5A371] rounded-xl text-slate-900 font-bold shadow-sm"
                    />
                  </div>
                )}

                <Button
                  onClick={handleAddGuest}
                  disabled={isSubmitting}
                  className="w-full h-16 bg-[#1A4D2E] hover:bg-[#123520] text-white rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    "Confirm & Save to Cloud"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* --- STATS AREA --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "Total Invitations",
              val: guests.length,
              icon: <Users size={20} />,
              bg: "bg-white text-[#1A4D2E]",
            },
            {
              label: "Checked In",
              val: guests.filter((g) => g.has_attended).length,
              icon: <UserCheck size={20} />,
              bg: "bg-[#1A4D2E] text-white",
            },
            {
              label: "Total Pax Capacity",
              val: guests.reduce((s, g) => s + g.pax, 0),
              icon: <Utensils size={20} />,
              bg: "bg-white text-[#1A4D2E]",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={cn(
                "p-10 rounded-[3rem] shadow-sm border border-[#E8DFD3] flex items-center justify-between group hover:shadow-xl transition-all duration-500",
                card.bg,
              )}
            >
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  {card.label}
                </p>
                <p className="text-5xl font-serif italic font-bold leading-none">
                  {card.val}
                </p>
              </div>
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-500",
                  card.bg.includes("white")
                    ? "bg-[#FDF8F3] text-[#1A4D2E]"
                    : "bg-white/10 text-[#C5A371]",
                )}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-7 top-1/2 -translate-y-1/2 text-[#1A4D2E]/40"
              size={22}
            />
            <Input
              placeholder="Search guest database..."
              className="h-20 pl-16 pr-8 rounded-3xl border-2 border-[#E8DFD3] shadow-sm bg-white text-xl font-serif italic focus-visible:ring-2 focus-visible:ring-[#1A4D2E] transition-all placeholder:text-slate-300"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="bg-white p-2 rounded-4xl shadow-sm border-2 border-[#E8DFD3] flex items-center">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-64 h-14 bg-[#FDF8F3] border-none rounded-2xl focus:ring-2 focus:ring-[#1A4D2E]/20 text-[11px] font-black uppercase tracking-[0.2em] text-[#1A4D2E] px-5 transition-all hover:bg-[#E8DFD3]/30 group">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[#C5A371] rounded-full ring-4 ring-[#C5A371]/20" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[8px] text-[#A9907E] mb-1 opacity-60">
                      Filter by
                    </span>
                    <SelectValue placeholder="All Categories" />
                  </div>
                </div>
              </SelectTrigger>

              <SelectContent className="rounded-2xl border-2 border-[#E8DFD3] bg-white shadow-2xl p-2 min-w-65 animate-in fade-in zoom-in-95 duration-200">
                <SelectItem
                  value="all"
                  className="rounded-xl mb-1 font-black text-[#1A4D2E] py-3 focus:bg-[#1A4D2E] focus:text-white transition-all cursor-pointer"
                >
                  <span className="text-[10px] tracking-widest">
                    ALL CATEGORIES
                  </span>
                </SelectItem>

                <div className="h-px bg-[#E8DFD3] my-2 mx-2" />

                {PREDEFINED_CATEGORIES.map((c) => (
                  <SelectItem
                    key={c}
                    value={c}
                    className="rounded-xl mb-1 font-bold text-slate-700 py-3 focus:bg-[#1A4D2E] focus:text-white transition-all cursor-pointer"
                  >
                    <span className="text-[10px] tracking-widest">
                      {c.toUpperCase()}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-[3rem] border-2 border-[#E8DFD3] shadow-sm overflow-hidden pb-4">
          <Table>
            <TableHeader className="bg-[#FDF8F3] h-20">
              <TableRow className="hover:bg-transparent border-b-2 border-[#E8DFD3]">
                <TableHead className="pl-12 text-[11px] font-black uppercase tracking-[0.2em] text-[#1A4D2E]">
                  Guest Identity
                </TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1A4D2E]">
                  Classification
                </TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1A4D2E]">
                  Presence Status
                </TableHead>
                <TableHead className="pr-12 text-right text-[11px] font-black uppercase tracking-[0.2em] text-[#1A4D2E]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                      <XCircle
                        size={64}
                        strokeWidth={1}
                        className="text-[#1A4D2E]"
                      />
                      <p className="font-serif italic text-2xl text-[#1A4D2E]">
                        No matches found in database
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredGuests.map((g) => (
                  <TableRow
                    key={g.id}
                    className="group hover:bg-[#FDF8F3]/80 transition-all border-b border-[#E8DFD3]/50"
                  >
                    <TableCell className="pl-12 py-7">
                      <div className="font-serif italic font-bold text-[#1A4D2E] text-2xl mb-1 group-hover:text-[#C5A371] transition-colors leading-tight">
                        {g.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#A9907E] uppercase tracking-tighter bg-white px-2 py-0.5 rounded border border-[#E8DFD3] shadow-sm">
                          {g.pax} SEATS
                        </span>
                        {g.table_number !== "-" && (
                          <span className="text-[10px] font-black text-[#1A4D2E] uppercase tracking-tighter bg-[#1A4D2E]/10 px-2 py-0.5 rounded border border-[#1A4D2E]/20">
                            TABLE {g.table_number}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#1A4D2E] text-[#C5A371] border border-[#C5A371]/30 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm group-hover:bg-[#123520] transition-colors">
                        {g.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {g.has_attended ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white w-fit rounded-full shadow-md">
                          <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
                          <span className="text-[9px] font-black uppercase tracking-wider">
                            Checked In
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 w-fit rounded-full border border-slate-200">
                          <div className="h-1.5 w-1.5 bg-slate-400 rounded-full"></div>
                          <span className="text-[9px] font-black uppercase tracking-wider">
                            Awaiting Arrival
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="pr-12 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-11 h-11 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          onClick={() => shareWhatsApp(g.name)}
                          title="Share to WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-11 h-11 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          onClick={() => setSelectedGuestQR(g)}
                          title="View QR Entry"
                        >
                          <QrCode size={18} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-11 h-11 rounded-xl bg-slate-50 hover:bg-black hover:text-white transition-all border border-slate-100"
                            >
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-64 p-2 rounded-2xl border-2 border-[#E8DFD3] shadow-3xl"
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  getInvitationLink(g.name),
                                );
                                toast.success("Invitation link copied!");
                              }}
                              className="p-3 rounded-xl cursor-pointer font-bold text-xs text-[#1A4D2E] focus:bg-[#FDF8F3]"
                            >
                              <Copy size={16} className="mr-3 text-[#C5A371]" />{" "}
                              Copy Secret Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#E8DFD3]" />
                            <DropdownMenuItem
                              onClick={() => {
                                if (
                                  confirm(
                                    "Permanently remove this guest from the database?",
                                  )
                                ) {
                                  supabase
                                    .from("guests")
                                    .delete()
                                    .eq("id", g.id)
                                    .then(() => {
                                      setGuests((prev) =>
                                        prev.filter((pg) => pg.id !== g.id),
                                      );
                                      toast.success("Guest entry purged.");
                                    });
                                }
                              }}
                              className="p-3 rounded-xl text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer font-bold text-xs"
                            >
                              <Trash2 size={16} className="mr-3" /> Purge Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- LUXURY QR ENTRY PASS --- */}
        {/* --- LUXURY QR ENTRY PASS --- */}
        <Dialog
          open={!!selectedGuestQR}
          onOpenChange={() => setSelectedGuestQR(null)}
        >
          <DialogContent className="max-w-105 bg-white border-none rounded-[3.5rem] p-0 overflow-hidden shadow-3xl">
            {/* Fix Accessibility Error: Menambahkan Title yang hanya dibaca oleh Screen Reader */}
            <DialogHeader className="sr-only">
              <DialogTitle>
                Guest Entry Pass - {selectedGuestQR?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="bg-[#1A4D2E] p-10 text-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A371]/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                  <QrCode size={32} className="text-[#C5A371]" />
                </div>
                <h3 className="text-3xl font-serif italic font-bold text-white tracking-tight leading-tight">
                  {selectedGuestQR?.name}
                </h3>
                <Badge className="bg-[#C5A371] text-[#1A4D2E] font-black px-4 py-1 rounded-full uppercase text-[10px] tracking-[0.2em] border-none">
                  {selectedGuestQR?.category} PASS
                </Badge>
              </div>
            </div>
            <div className="p-12 flex flex-col items-center bg-white relative">
              <div className="p-6 bg-[#FDF8F3] rounded-[3rem] border-4 border-[#C5A371]/20 shadow-inner group overflow-hidden">
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl transition-transform group-hover:scale-105 duration-700">
                  {selectedGuestQR && (
                    <QRCode
                      value={selectedGuestQR.id}
                      size={180}
                      fgColor="#1A4D2E"
                      level="H"
                    />
                  )}
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-[10px] font-black text-[#A9907E] uppercase tracking-[0.4em]">
                  Checkpoint Passport
                </p>
                <p className="text-[9px] font-mono text-slate-300 mt-1 uppercase tracking-tighter">
                  UID: {selectedGuestQR?.id.split("-")[0]}
                </p>
              </div>
              <Button
                onClick={() => setSelectedGuestQR(null)}
                className="mt-10 w-full h-14 bg-[#FDF8F3] hover:bg-[#1A4D2E] hover:text-white text-[#1A4D2E] rounded-xl font-bold uppercase text-[10px] tracking-widest border border-[#E8DFD3] transition-all"
              >
                Dismiss Entry Card
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
