"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Check,
  X,
  ArrowRight,
  Eye,
  EyeOff,
  Star,
  Quote,
} from "lucide-react";

// --- DATA TESTIMONI ---
const testimonials = [
  {
    text: "Vittya mengubah cara kami memandang undangan. Bukan sekadar link, tapi pengalaman digital yang mewah bagi tamu kami.",
    name: "Raisa & Hamish",
    role: "Jakarta Selatan",
    date: "2026",
  },
  {
    text: "Fitur manajemen tamunya luar biasa. Desainnya elegan, tidak pasaran, dan sangat mudah disesuaikan.",
    name: "Sandra & Harvey",
    role: "Surabaya",
    date: "2025",
  },
  {
    text: "The best investment for our wedding! Tamu-tamu VIP kami sangat terkesan dengan tampilan undangannya di HP mereka.",
    name: "Michelle & James",
    role: "Bali Wedding",
    date: "2026",
  },
];

export default function Register() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [currentTesti, setCurrentTesti] = useState(0);

  // Password States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);

  // 1. Auto-Slide Testimonial
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTesti((prev) => (prev + 1) % testimonials.length);
    }, 6000); // Slide tiap 6 detik
    return () => clearInterval(interval);
  }, []);

  // 2. Strength Meter Logic
  useEffect(() => {
    if (!password) {
      setStrengthScore(0);
      return;
    }
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrengthScore(score);
  }, [password]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);

    if (password !== confirmPassword) {
      setMsg({ type: "error", text: "Password dan konfirmasi tidak cocok." });
      return;
    }
    if (strengthScore < 3) {
      setMsg({
        type: "error",
        text: "Password terlalu lemah. Gunakan kombinasi huruf besar, angka, & simbol.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: password,
      options: {
        data: {
          full_name: formData.get("fullName") as string,
          phone_number: formData.get("phone") as string,
        },
      },
    });

    if (error) {
      setMsg({ type: "error", text: error.message });
    } else {
      setMsg({
        type: "success",
        text: "Akun berhasil dibuat! Mengalihkan ke dashboard...",
      });
      setTimeout(() => router.refresh(), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-slate-50 lg:bg-white selection:bg-indigo-900 selection:text-white font-sans overflow-x-hidden">
      {/* ============================================================
          KIRI: BRANDING & EXPERIENCE (DESKTOP)
      ============================================================= */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0A0E17] text-white p-16 relative overflow-hidden group/brand">
        {/* --- AMBIENT LIVING BACKGROUND --- */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-200 h-200 bg-indigo-700/40 blur-[180px] rounded-full animate-[pulse_10s_ease-in-out_infinite]"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-175 h-175 bg-blue-600/30 blur-[150px] rounded-full animate-[pulse_15s_ease-in-out_infinite_reverse]"></div>
        </div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>{" "}
        {/* Optional Texture */}
        {/* --- PREMIUM LOGO LOCKUP (REVISI BARU DI SINI) --- */}
        <div className="z-20 relative animate-in fade-in slide-in-from-top-6 duration-1000">
          <Link
            href="/"
            className="group flex items-center gap-3 w-fit transition-all duration-300"
          >
            {/* 1. ICON DENGAN EFEK GLOW + PUTIH */}
            <div className="relative w-14 h-14 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <div className="absolute inset-0 bg-indigo-500/50 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-full"></div>
              <Image
                src="/logo-Vittya.png"
                alt="Vittya Icon"
                fill
                className="object-contain relative z-10 drop-shadow-lg grayscale brightness-[10]"
                priority
              />
            </div>

            {/* 2. TEXT BRAND NAME */}
            <div className="flex flex-col justify-center">
              <span className="text-4xl font-extrabold tracking-tighter text-white drop-shadow-md leading-none group-hover:text-slate-100 transition-colors">
                Vittya<span className="text-indigo-400">.</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-medium ml-1 group-hover:text-indigo-300 transition-colors">
                Official Platform
              </span>
            </div>
          </Link>
        </div>
        {/* --- CAROUSEL CONTENT --- */}
        <div className="z-20 relative max-w-lg my-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <div className="mb-10">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-5 drop-shadow-sm">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-blue-400 to-cyan-400">
                Elite Invitations.
              </span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
              Platform pilihan #1 bagi pasangan yang mengutamakan estetika dan
              teknologi.
            </p>
          </div>

          {/* Glass Testimonial Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-4xl shadow-2xl relative overflow-hidden hover:border-white/20 transition-colors duration-500 group/card">
            <div className="absolute top-0 right-0 p-6 opacity-20 transition-opacity group-hover/card:opacity-40">
              <Quote size={40} className="text-white" />
            </div>

            <div className="relative z-10 min-h-30 flex flex-col justify-center">
              <p
                key={currentTesti}
                className="text-slate-100 text-xl font-medium leading-relaxed italic animate-in fade-in slide-in-from-right-8 duration-700"
              >
                "{testimonials[currentTesti].text}"
              </p>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <div>
                <p className="font-bold text-white text-lg animate-in fade-in">
                  {testimonials[currentTesti].name}
                </p>
                <p className="text-sm text-indigo-300">
                  {testimonials[currentTesti].role} •{" "}
                  {testimonials[currentTesti].date}
                </p>
              </div>
              <div className="flex gap-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400 drop-shadow-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex gap-3 mt-8 pl-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTesti(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${idx === currentTesti ? "w-10 bg-white shadow-[0_0_10px_white]" : "w-2 bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </div>
        </div>
        <div className="z-20 relative flex justify-between text-xs text-slate-400 font-medium tracking-wider uppercase">
          <p>© 2026 Vittya Platform.</p>
          <p>Privacy • Terms • Security</p>
        </div>
      </div>

      {/* ============================================================
          KANAN: THE PROFESSIONAL FORM (MOBILE & DESKTOP)
      ============================================================= */}
      <div className="flex flex-col h-full relative">
        {/* --- MOBILE PREMIUM HEADER COVER --- */}
        <div className="lg:hidden w-full h-55 bg-[#0A0E17] relative shrink-0 overflow-hidden rounded-b-[2.5rem] shadow-2xl z-10">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute -top-[50%] -right-[20%] w-80 h-80 bg-indigo-600 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-[20%] -left-[20%] w-64 h-64 bg-blue-500 blur-[80px] rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6">
            <div className="relative w-32 h-32 mb-4 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Image
                src="/logo-Vittya.png"
                alt="Logo"
                fill
                className="object-contain grayscale brightness-[10]" // UPDATE: JADI PUTIH JUGA DI MOBILE
              />
            </div>
            <p className="text-white font-bold tracking-widest text-sm">
              INDONESIA'S #1 DWI PLATFORM
            </p>
          </div>
        </div>

        {/* --- FORM CONTAINER --- */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:p-24 -mt-12 lg:mt-0 z-30">
          <div className="w-full max-w-120 mx-auto bg-white p-8 lg:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] lg:shadow-none animate-in fade-in slide-in-from-bottom-12 duration-1000 border border-slate-100 lg:border-none">
            <div className="mb-10">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Buat Akun
              </h2>
              <p className="text-slate-500 mt-3 text-base leading-relaxed">
                Langkah pertama menuju undangan pernikahan impian Anda.
              </p>
            </div>

            {/* SOCIAL LOGIN (VISUAL) - HOVER EFFECT ADDED */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button
                variant="outline"
                className="h-12 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold transition-all duration-300"
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="h-12 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold transition-all duration-300"
              >
                <svg
                  className="mr-3 h-5 w-5 text-[#181717]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.63-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Apple ID
              </Button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="bg-white lg:bg-white px-4 text-slate-400">
                  Atau daftar manual
                </span>
              </div>
            </div>

            {/* ALERT */}
            {msg && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-start gap-4 text-sm animate-in fade-in zoom-in-95 shadow-sm ${
                  msg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-900 border border-red-200"
                }`}
              >
                <div
                  className={`p-1 rounded-full shrink-0 ${msg.type === "success" ? "bg-emerald-200" : "bg-red-200"}`}
                >
                  {msg.type === "success" ? (
                    <Check size={16} className="text-emerald-700" />
                  ) : (
                    <X size={16} className="text-red-700" />
                  )}
                </div>
                <p className="font-semibold leading-relaxed pt-0.5">
                  {msg.text}
                </p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* INPUTS WITH HOVER & FOCUS EFFECTS */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-slate-700 font-semibold"
                  >
                    Nama Lengkap
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="Contoh: Raisa Andriana"
                    className="h-14 px-5 bg-slate-50 border-2 border-slate-200 hover:border-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 rounded-2xl text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-slate-700 font-semibold"
                    >
                      WhatsApp
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="0812..."
                      className="h-14 px-5 bg-slate-50 border-2 border-slate-200 hover:border-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 rounded-2xl text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 font-semibold"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="nama@email.com"
                      className="h-14 px-5 bg-slate-50 border-2 border-slate-200 hover:border-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 rounded-2xl text-lg"
                    />
                  </div>
                </div>
              </div>

              {/* PASSWORD SECTION */}
              <div className="space-y-5 pt-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 font-semibold"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimal 8 karakter"
                      className="h-14 px-5 pr-12 bg-slate-50 border-2 border-slate-200 hover:border-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 rounded-2xl text-lg font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>

                  {/* Animated Strength Indicator */}
                  <div className="flex gap-2 mt-3 px-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all duration-700 ease-out ${
                          strengthScore >= level
                            ? strengthScore < 3
                              ? "bg-linear-to-r from-orange-400 to-amber-400 shadow-sm"
                              : "bg-linear-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirm"
                    className="text-slate-700 font-semibold"
                  >
                    Konfirmasi Password
                  </Label>
                  <Input
                    id="confirm"
                    type="password"
                    required
                    placeholder="Ulangi password di atas"
                    className={`h-14 px-5 bg-slate-50 border-2 border-slate-200 hover:border-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 rounded-2xl text-lg ${confirmPassword && password !== confirmPassword ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100" : ""}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* CHECKBOX */}
              <div className="flex items-start gap-4 pt-2">
                <Checkbox
                  id="terms"
                  required
                  className="mt-1 w-6 h-6 border-2 border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-lg transition-all"
                />
                <Label
                  htmlFor="terms"
                  className="text-base text-slate-600 font-normal leading-relaxed cursor-pointer"
                >
                  Saya setuju dengan{" "}
                  <span className="text-indigo-600 font-bold hover:underline">
                    Syarat & Ketentuan
                  </span>{" "}
                  serta{" "}
                  <span className="text-indigo-600 font-bold hover:underline">
                    Kebijakan Privasi
                  </span>{" "}
                  Vittya.
                </Label>
              </div>

              {/* MAIN BUTTON - HOVER LIFT EFFECT */}
              <Button
                type="submit"
                className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg tracking-wide shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.6)] rounded-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] mt-4"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={24} /> SEDANG
                    MEMPROSES...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    BUAT AKUN SEKARANG{" "}
                    <ArrowRight
                      size={24}
                      strokeWidth={2.5}
                      className="animate-[pulse_2s_infinite]"
                    />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-base text-slate-600 mt-10 font-medium">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-indigo-600 font-extrabold hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
        <div className="lg:hidden h-12 bg-slate-50 w-full shrink-0"></div>
      </div>
    </div>
  );
}
