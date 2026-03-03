"use client";
import { useState } from "react";
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
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg({ type: "error", text: "Email atau password tidak ditemukan." });
      setLoading(false);
    } else {
      setMsg({
        type: "success",
        text: "Selamat datang kembali! Mengalihkan...",
      });
      router.refresh();
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-slate-50 lg:bg-white selection:bg-indigo-900 selection:text-white font-sans overflow-hidden">
      {/* ============================================================
          KIRI: BRANDING (DESKTOP) - WARM & WELCOMING
      ============================================================= */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0B0F19] text-white p-16 relative overflow-hidden">
        {/* Living Background (Lebih Tenang dari Register) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-150 h-150 bg-indigo-600 blur-[150px] rounded-full animate-[pulse_10s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-125 h-125 bg-blue-500 blur-[120px] rounded-full animate-[pulse_12s_ease-in-out_infinite_reverse]"></div>
        </div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>

        {/* LOGO LOCKUP */}
        <div className="z-20 relative animate-in fade-in slide-in-from-top-6 duration-1000">
          <Link
            href="/"
            className="group flex items-center gap-3 w-fit transition-all duration-300"
          >
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

        {/* WELCOME TEXT */}
        <div className="z-20 relative max-w-lg my-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-indigo-300 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            System Operational
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
            Senang melihat <br />
            Anda{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-blue-400 to-cyan-400">
              kembali.
            </span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-md">
            "Dashboard Anda sudah siap. Lanjutkan membuat momen spesial hari
            ini."
          </p>
        </div>

        {/* FOOTER */}
        <div className="z-20 relative flex items-center gap-6 text-xs text-slate-500 font-medium tracking-wider uppercase">
          <p>© 2026 Vittya.</p>
          <div className="flex items-center gap-2 text-emerald-500/80">
            <Lock size={12} />
            <span>256-bit Secure Connection</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          KANAN: LOGIN FORM (MOBILE & DESKTOP)
      ============================================================= */}
      <div className="flex flex-col h-full relative">
        {/* MOBILE HEADER (PREMIUM) */}
        <div className="lg:hidden w-full h-55 bg-[#0B0F19] relative shrink-0 overflow-hidden rounded-b-[2.5rem] shadow-2xl z-10">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute -top-[50%] -right-[20%] w-80 h-80 bg-indigo-600 blur-[100px] rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6">
            <div className="relative w-28 h-28 mb-4 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <Image
                src="/logo-Vittya.png"
                alt="Logo"
                fill
                className="object-contain grayscale brightness-[10]"
              />
            </div>
            <p className="text-white font-bold tracking-widest text-xs opacity-80">
              WELCOME BACK
            </p>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:p-24 -mt-12 lg:mt-0 z-30">
          <div className="w-full max-w-115 mx-auto bg-white p-8 lg:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] lg:shadow-none animate-in fade-in slide-in-from-bottom-12 duration-1000 border border-slate-100 lg:border-none">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Masuk Dashboard
              </h2>
              <p className="text-slate-500 mt-2 text-base">
                Masukkan kredensial Anda untuk mengakses akun.
              </p>
            </div>

            {/* VISUAL SOCIAL LOGIN (SAMA KAYAK REGISTER) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button
                variant="outline"
                className="h-12 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold transition-all"
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
                className="h-12 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold transition-all"
              >
                <svg
                  className="mr-3 h-5 w-5 text-black"
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
                  Atau masuk dengan email
                </span>
              </div>
            </div>

            {/* ALERT MESSAGE */}
            {msg && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-sm animate-in fade-in zoom-in-95 shadow-sm ${
                  msg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-900 border border-red-200"
                }`}
              >
                <div
                  className={`p-1 rounded-full shrink-0 ${msg.type === "success" ? "bg-emerald-200" : "bg-red-200"}`}
                >
                  {msg.type === "success" ? (
                    <CheckCircle2 size={16} className="text-emerald-700" />
                  ) : (
                    <AlertCircle size={16} className="text-red-700" />
                  )}
                </div>
                <p className="font-semibold leading-relaxed pt-0.5">
                  {msg.text}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-slate-700 font-semibold"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    className="h-14 px-5 bg-slate-50 border-2 border-slate-200 hover:border-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 rounded-2xl text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

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
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
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
                </div>

                {/* REMEMBER ME & FORGOT PASSWORD */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-slate-600 font-medium cursor-pointer"
                    >
                      Ingat saya
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg tracking-wide shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.6)] rounded-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={24} /> MEMBUKA
                    PINTU...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    MASUK DASHBOARD <ArrowRight size={24} strokeWidth={2.5} />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 text-base font-medium">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="text-indigo-600 font-extrabold hover:underline decoration-2 underline-offset-4 transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
