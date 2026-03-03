"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Disc,
  Loader2,
  Music,
  PlayCircle,
  Save,
  Trash2,
  Upload,
  Youtube,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// KONFIGURASI CLOUDINARY
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// --- DATABASE LAGU PREMIUM (USER CURATED LINKS - FIXED) ---
const VIRAL_SONGS = [
  // INDONESIA POP
  {
    id: "id1",
    category: "Indo Pop",
    title: "Komang",
    artist: "Raim Laode (Official Lyric)",
    url: "https://www.youtube.com/watch?v=fKRtnMYMW08&list=RDfKRtnMYMW08&start_radio=1",
  },
  {
    id: "id2",
    category: "Indo Pop",
    title: "Kisah Sempurna",
    artist: "Mahalini (Official Lyric)",
    url: "https://www.youtube.com/watch?v=dI8wmyIoIfE",
  },
  {
    id: "id3",
    category: "Indo Pop",
    title: "Teman Hidup",
    artist: "Tulus (Official Lyric)",
    // Note: Gue benerin typo 'https://www.yhttps://' jadi 'https://' biar jalan
    url: "https://www.youtube.com/watch?v=dt4Ueda_h6Y&list=RDdt4Ueda_h6Y&start_radio=1",
  },
  {
    id: "id4",
    category: "Indo Pop",
    title: "Akad",
    artist: "Payung Teduh (Official Audio)",
    url: "https://www.youtube.com/watch?v=viW0M5R2BLo",
  },
  {
    id: "id5",
    category: "Indo Pop",
    title: "Dunia Tipu-Tipu",
    artist: "Yura Yunita (Official Lyric)",
    url: "https://www.youtube.com/watch?v=Jdj13fGMmmA&list=RDJdj13fGMmmA&start_radio=1",
  },

  // WESTERN ROMANTIC
  {
    id: "ws1",
    category: "Western",
    title: "Beautiful In White",
    artist: "Shane Filan (Lyric Video)",
    url: "https://www.youtube.com/watch?v=MfHAt5F2uhk",
  },
  {
    id: "ws2",
    category: "Western",
    title: "Perfect",
    artist: "Ed Sheeran (Official Lyric)",
    url: "https://www.youtube.com/watch?v=hEHmg1VLz6o",
  },
  {
    id: "ws3",
    category: "Western",
    title: "A Thousand Years",
    artist: "Christina Perri (Official Lyric)",
    url: "https://www.youtube.com/watch?v=rtOvBOTyX00",
  },
  {
    id: "ws4",
    category: "Western",
    title: "Until I Found You",
    artist: "Stephen Sanchez (Official Lyric)",
    url: "https://www.youtube.com/watch?v=GxldQ9eX2wo&list=RDGxldQ9eX2wo&start_radio=1",
  },
  {
    id: "ws5",
    category: "Western",
    title: "Marry Your Daughter",
    artist: "Brian McKnight",
    url: "https://www.youtube.com/watch?v=jP6eEKrghGI&list=RDjP6eEKrghGI&start_radio=1",
  },

  // RELIGI / ISLAMI
  {
    id: "rl1",
    category: "Religi",
    title: "Barakallah",
    artist: "Maher Zain (Lyric Video)",
    url: "https://www.youtube.com/watch?v=hrOj44C0ZK4",
  },
  {
    id: "rl2",
    category: "Religi",
    title: "Ketika Cinta Bertasbih",
    artist: "Melly Goeslaw",
    url: "https://www.youtube.com/watch?v=cCw1fH1IwTM",
  },

  // INSTRUMENTAL / CLASSIC
  {
    id: "ins1",
    category: "Instrumental",
    title: "Canon in D",
    artist: "Pachelbel (Orchestra)",
    url: "https://www.youtube.com/watch?v=NlprozGcs80",
  },
  {
    id: "ins2",
    category: "Instrumental",
    title: "River Flows in You",
    artist: "Yiruma",
    url: "https://www.youtube.com/watch?v=7maJOI3QMu0",
  },
  {
    id: "ins3",
    category: "Instrumental",
    title: "Married Life (Up)",
    artist: "Michael Giacchino",
    url: "https://www.youtube.com/watch?v=npT_R6QvWvY&list=RDnpT_R6QvWvY&start_radio=1",
  },
];

export default function MusicPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false); // New State

  // Form State
  const [sourceType, setSourceType] = useState<"youtube" | "upload" | "preset">(
    "preset",
  );
  const [musicUrl, setMusicUrl] = useState("");
  const [agreed, setAgreed] = useState(false);

  // State Filter Kategori
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Slider State
  const [range, setRange] = useState([0, 0]);
  const [maxDuration, setMaxDuration] = useState(300);

  // Helper: Ambil YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const youtubeId = getYoutubeId(musicUrl);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 1. FETCH DATA
  useEffect(() => {
    const getData = async () => {
      if (!projectId) return;
      const { data } = await supabase
        .from("invitations")
        .select("music_url, music_start, music_end")
        .eq("id", projectId)
        .single();

      if (data) {
        setMusicUrl(data.music_url || "");
        const start = data.music_start || 0;
        const end = data.music_end || 0;
        setRange([start, end === 0 ? 300 : end]);

        if (data.music_url) {
          setAgreed(true);
          const isYt = getYoutubeId(data.music_url);
          const isPreset = VIRAL_SONGS.some((s) => s.url === data.music_url);

          if (isPreset) setSourceType("preset");
          else if (isYt) setSourceType("youtube");
          else setSourceType("upload");
        }
      }
      setFetching(false);
    };
    getData();
  }, [projectId, supabase]);

  // 2. AUTO DETECT DURATION (Untuk Upload)
  useEffect(() => {
    if (sourceType === "upload" && musicUrl) {
      const audio = new Audio(musicUrl);
      audio.onloadedmetadata = () => {
        if (audio.duration && audio.duration !== Infinity) {
          const dur = Math.floor(audio.duration);
          setMaxDuration(dur);
          setRange([0, dur]);
        }
      };
    }
  }, [musicUrl, sourceType]);

  // 3. PILIH PRESET
  const selectPreset = (song: (typeof VIRAL_SONGS)[0]) => {
    setMusicUrl(song.url);
    setRange([0, 300]);
    setMaxDuration(300);
    toast.success(`Lagu "${song.title}" dipilih!`);
  };

  // 4. HANDLE CLOUDINARY UPLOAD (PENGGANTI AudioUpload)
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast.error("Config Cloudinary hilang!");
      return;
    }
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];

    // Validasi: Harus Audio
    if (!file.type.startsWith("audio") && !file.type.startsWith("video")) {
      toast.error("Format file harus Audio (MP3/WAV/AAC)");
      setUploading(false);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      // Limit 20MB
      toast.error("File audio maksimal 20MB");
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", `vittya/${projectId}/music`);

      // Cloudinary: Audio pakai endpoint VIDEO
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        { method: "POST", body: formData },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Upload gagal");

      setMusicUrl(data.secure_url);
      toast.success("Audio berhasil diupload!");
    } catch (error: any) {
      console.error("Upload Error:", error);
      toast.error("Gagal: " + error.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // 5. FILTER LIST
  const filteredSongs =
    selectedCategory === "All"
      ? VIRAL_SONGS
      : VIRAL_SONGS.filter((s) => s.category === selectedCategory);

  // 6. SIMPAN DATA
  const handleSave = async () => {
    if (!agreed) return toast.error("Mohon setujui Syarat & Ketentuan dulu.");
    if ((sourceType === "youtube" || sourceType === "preset") && !youtubeId)
      return toast.error("Link Lagu tidak valid.");
    if (!musicUrl) return toast.error("Belum ada lagu yang dipilih.");

    setLoading(true);
    const finalEnd = range[1] >= maxDuration ? 0 : range[1];

    const { error } = await supabase
      .from("invitations")
      .update({
        music_url: musicUrl,
        music_start: range[0],
        music_end: finalEnd,
      })
      .eq("id", projectId);

    if (!error) {
      router.refresh();
      toast.success("Musik berhasil disimpan! 🎵");
    } else {
      toast.error("Gagal menyimpan: " + error.message);
    }
    setLoading(false);
  };

  if (fetching)
    return (
      <div className="h-60 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
          Music Library
        </h1>
        <p className="text-slate-500 mt-2">
          Koleksi lagu romantis pilihan yang aman untuk undanganmu.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* === KIRI: INPUT & LIBRARY === */}
        <div className="space-y-6">
          {/* TAB SWITCHER */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl shadow-inner border border-slate-200">
            <button
              onClick={() => setSourceType("preset")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all",
                sourceType === "preset"
                  ? "bg-white text-indigo-600 shadow-md transform scale-[1.02]"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              <Disc size={16} /> Top Chart
            </button>
            <button
              onClick={() => setSourceType("youtube")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all",
                sourceType === "youtube"
                  ? "bg-white text-red-600 shadow-md transform scale-[1.02]"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              <Youtube size={16} /> Custom Link
            </button>
            <button
              onClick={() => setSourceType("upload")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all",
                sourceType === "upload"
                  ? "bg-white text-green-600 shadow-md transform scale-[1.02]"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              <Upload size={16} /> Upload MP3
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg shadow-slate-100/50 space-y-8 min-h-125">
            {/* 1. LIBRARY MODE (PRESET) */}
            {sourceType === "preset" && (
              <div className="animate-in fade-in space-y-4">
                {/* FILTER KATEGORI */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {[
                      "All",
                      "Indo Pop",
                      "Western",
                      "Religi",
                      "Instrumental",
                    ].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "px-3 py-1 text-xs font-bold rounded-full border transition-all whitespace-nowrap",
                          selectedCategory === cat
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300",
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LIST LAGU */}
                <div className="grid gap-3 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredSongs.map((song) => {
                    const isSelected = musicUrl === song.url;
                    return (
                      <div
                        key={song.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md cursor-pointer group",
                          isSelected
                            ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                            : "border-slate-100 hover:border-indigo-200",
                        )}
                        onClick={() => selectPreset(song)}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600",
                          )}
                        >
                          {isSelected ? (
                            <PlayCircle size={24} className="animate-pulse" />
                          ) : (
                            <Music size={20} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-200 px-1.5 rounded">
                              {song.category}
                            </span>
                          </div>
                          <h4
                            className={cn(
                              "text-sm font-bold truncate mt-1",
                              isSelected ? "text-indigo-900" : "text-slate-800",
                            )}
                          >
                            {song.title}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">
                            {song.artist}
                          </p>
                        </div>

                        {isSelected && (
                          <CheckCircle
                            size={20}
                            className="text-indigo-600 shrink-0"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. CUSTOM YOUTUBE */}
            {sourceType === "youtube" && (
              <div className="animate-in fade-in space-y-4">
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm flex gap-3">
                  <Youtube className="shrink-0" size={20} />
                  <div className="space-y-1">
                    <p className="font-bold">Tips Anti Error:</p>
                    <p className="text-xs opacity-90">
                      Gunakan link <strong>Lyric Video</strong> atau{" "}
                      <strong>Official Audio</strong>. Hindari "Official Music
                      Video" (MV) karena sering diblokir untuk website.
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block font-semibold">
                    Link Lagu (YouTube)
                  </Label>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="h-11"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                  />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Label className="text-xs text-slate-500 uppercase font-bold mb-2 block">
                    Estimasi Durasi Video (Detik)
                  </Label>
                  <Input
                    type="number"
                    className="bg-white h-9 text-sm"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* 3. UPLOAD MODE (UPDATED TO CLOUDINARY) */}
            {sourceType === "upload" && (
              <div className="animate-in fade-in flex flex-col items-center justify-center h-60 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                {uploading ? (
                  <div className="text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                    <p>Mengupload ke Server...</p>
                  </div>
                ) : musicUrl && !youtubeId ? (
                  <div className="text-center w-full px-6">
                    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                        <Music size={20} />
                      </div>
                      <p className="text-sm text-slate-700 truncate flex-1">
                        {musicUrl.split("/").pop()}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => setMusicUrl("")}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                    <p className="text-xs text-green-600 font-bold">
                      File siap digunakan!
                    </p>
                  </div>
                ) : (
                  <>
                    <Input
                      type="file"
                      id="audio-upload"
                      className="hidden"
                      accept="audio/*,video/mp4"
                      onChange={handleAudioUpload}
                    />
                    <label
                      htmlFor="audio-upload"
                      className="cursor-pointer flex flex-col items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Upload size={48} className="opacity-20" />
                      <span className="font-bold">Klik untuk Upload MP3</span>
                      <span className="text-xs">Max 20MB (Cloudinary)</span>
                    </label>
                  </>
                )}
              </div>
            )}

            {/* === UNIVERSAL SLIDER (TRIMMER) === */}
            {musicUrl && (
              <div className="space-y-4 pt-6 border-t border-slate-100 animate-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <Label className="font-bold text-slate-700 flex items-center gap-2">
                    <Clock size={16} className="text-indigo-600" /> Trim Audio
                    (Mulai - Selesai)
                  </Label>
                  <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                    {formatTime(range[0])} -{" "}
                    {range[1] >= maxDuration ? "END" : formatTime(range[1])}
                  </span>
                </div>

                <div className="px-2">
                  <Slider
                    defaultValue={[0, maxDuration]}
                    value={range}
                    max={maxDuration}
                    step={1}
                    minStepsBetweenThumbs={5}
                    onValueChange={(val) => setRange(val)}
                    className="py-4 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* TERMS */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-600 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="shrink-0 mt-0.5 text-slate-400"
                size={18}
              />
              <p className="text-xs leading-relaxed">
                Dengan menyimpan, Anda menyetujui bahwa musik yang digunakan
                adalah tanggung jawab Anda sepenuhnya terkait hak cipta.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(c) => setAgreed(c as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-xs font-bold cursor-pointer select-none text-slate-700"
              >
                Saya Paham & Setuju
              </label>
            </div>
          </div>
        </div>

        {/* === KANAN: PREVIEW UTAMA === */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-6">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <PlayCircle size={18} className="text-indigo-600" /> Preview Player
          </h3>

          {/* LOGIC PLAYER */}
          {youtubeId ? (
            // YOUTUBE PLAYER
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner group relative">
              <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
                YouTube Embed
              </div>
              <iframe
                key={`${range[0]}-${range[1]}`}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}?start=${range[0]}&end=${range[1] >= maxDuration ? "" : range[1]}&autoplay=1`}
                title="Preview"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>

              {/* Fallback Message if broken */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center text-white/50 text-xs">
                Memuat Video...
              </div>
            </div>
          ) : // HTML5 AUDIO PLAYER
          musicUrl ? (
            <div className="w-full rounded-xl bg-linear-to-br from-green-50 to-white p-6 border border-green-100 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-100 opacity-20 animate-pulse"></div>
                <Music size={40} className="text-green-600" />
              </div>
              <p className="font-bold text-slate-900 mb-1 text-sm">
                File Audio Custom
              </p>
              <p className="text-xs text-slate-500 mb-6 font-mono bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                {formatTime(range[0])} —{" "}
                {range[1] >= maxDuration ? "END" : formatTime(range[1])}
              </p>
              <audio
                controls
                className="w-full h-10 accent-green-600"
                src={`${musicUrl}#t=${range[0]},${range[1] >= maxDuration ? "" : range[1]}`}
              >
                Browser tidak support audio.
              </audio>
            </div>
          ) : (
            <div className="aspect-video w-full rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
              <Music size={40} className="mb-2 opacity-30" />
              <p className="text-sm">Pilih lagu di sebelah kiri</p>
            </div>
          )}

          {/* ERROR MESSAGE HELPER */}
          {sourceType === "youtube" && youtubeId && (
            <div className="mt-4 text-xs text-slate-500 bg-red-50 p-3 rounded-lg border border-red-100">
              <p>
                ⚠️ <strong>Jika Video Error/Tidak Bisa Diputar:</strong>
              </p>
              <p className="mt-1">
                Itu artinya video tersebut{" "}
                <strong>dibatasi oleh pemiliknya (Label Musik)</strong>.
                Solusinya: Ganti dengan link{" "}
                <strong>"Official Lyric Video"</strong> atau{" "}
                <strong>Cover</strong> dari penyanyi lain.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="fixed bottom-6 right-6 md:right-10 z-40">
        <Button
          onClick={handleSave}
          disabled={loading || !agreed}
          className="bg-slate-900 hover:bg-slate-800 text-white h-14 px-8 rounded-full shadow-2xl hover:scale-105 transition-all text-lg font-bold disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" /> Menyimpan...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save size={20} /> SIMPAN MUSIK
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
