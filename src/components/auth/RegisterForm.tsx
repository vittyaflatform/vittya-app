"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMsg({ type: "error", text: "Password tidak cocok." });
      return;
    }

    setLoading(true);
    setMsg(null);

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = registerSchema.safeParse({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      setMsg({
        type: "error",
        text: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.fullName,
          phone_number: parsed.data.phone,
        },
      },
    });

    if (error) {
      setMsg({ type: "error", text: error.message });
      setLoading(false);
      return;
    }

    setMsg({ type: "success", text: "Akun berhasil dibuat. Mengalihkan..." });
    setLoading(false);

    window.setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[40px] bg-white font-sans shadow-[0_35px_80px_-24px_rgba(15,23,42,0.28)]">
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-emerald-50/80 via-transparent to-transparent" />

      <div className="relative border-b border-slate-100 px-8 pt-10 pb-7 text-center sm:px-10">
        <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 shadow-xl shadow-emerald-500/10">
          <Image
            src="/logo-Vittya.png"
            alt="Vittya"
            width={30}
            height={30}
            className="object-contain"
          />
        </div>

        <h2 className="text-[2rem] leading-none font-[1000] tracking-tighter text-slate-900 uppercase italic">
          Register Portal<span className="text-emerald-500 not-italic">.</span>
        </h2>
        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.42em] text-slate-400">
          Secure Account Initialization
        </p>
      </div>

      <div className="px-8 py-8 sm:px-10 sm:py-9">
        {msg && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${msg.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}
          >
            {msg.type === "success" ? <Check size={17} /> : <X size={17} />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="register-full-name"
              className="px-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400"
            >
              Full Name
            </Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="register-full-name"
                name="fullName"
                required
                autoComplete="name"
                placeholder="Nama lengkap Anda"
                className="h-14 rounded-2xl border-none bg-slate-50 pr-4 pl-11 text-sm font-bold text-slate-900 shadow-inner shadow-slate-200/70 focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="register-phone"
                className="px-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400"
              >
                WhatsApp
              </Label>
              <div className="relative">
                <Smartphone className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="0812..."
                  className="h-14 rounded-2xl border-none bg-slate-50 pr-4 pl-11 text-sm font-bold text-slate-900 shadow-inner shadow-slate-200/70 focus-visible:ring-2 focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="register-email"
                className="px-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400"
              >
                Identity ID
              </Label>
              <Input
                id="register-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="operator@vittya.com"
                className="h-14 rounded-2xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-900 shadow-inner shadow-slate-200/70 focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <Label
                htmlFor="register-password"
                className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400"
              >
                Passcode
              </Label>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600">
                Protected
              </span>
            </div>
            <div className="relative">
              <ShieldCheck className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                className="h-14 rounded-2xl border-none bg-slate-50 pr-12 pl-11 text-sm font-bold text-slate-900 shadow-inner shadow-slate-200/70 focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 transition-colors hover:text-emerald-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="register-confirm-password"
              className="px-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400"
            >
              Confirm Passcode
            </Label>
            <div className="relative">
              <Input
                id="register-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Ulangi password"
                className={`h-14 rounded-2xl border-none bg-slate-50 px-4 pr-12 text-sm font-bold text-slate-900 shadow-inner shadow-slate-200/70 focus-visible:ring-2 focus-visible:ring-emerald-500 ${confirmPassword && password !== confirmPassword ? "ring-2 ring-red-300 focus-visible:ring-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 transition-colors hover:text-emerald-600"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <Checkbox
              id="terms"
              required
              aria-label="Setujui syarat dan kebijakan"
              className="mt-0.5 border-slate-300 data-[state=checked]:bg-emerald-600"
            />
            <div className="text-[12px] leading-relaxed text-slate-500">
              <Label htmlFor="terms" className="cursor-pointer">
                Saya setuju dengan{" "}
              </Label>
              <Link
                href="/terms"
                className="font-bold text-emerald-600 underline underline-offset-4"
              >
                Syarat & Ketentuan
              </Link>{" "}
              dan{" "}
              <Link
                href="/privacy"
                className="font-bold text-emerald-600 underline underline-offset-4"
              >
                Kebijakan Privasi
              </Link>{" "}
              Vittya.
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-15 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 text-[11px] font-black uppercase tracking-[0.28em] text-white transition-all active:scale-[0.98] hover:bg-emerald-600"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Establish Account
                <ArrowRight size={16} className="transition-transform" />
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-8 py-5 text-center sm:px-10">
        <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-emerald-600 underline underline-offset-4"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
