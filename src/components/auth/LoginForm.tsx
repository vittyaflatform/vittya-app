"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg("ACCESS DENIED: INVALID IDENTITY");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
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
          System Portal<span className="text-emerald-500 not-italic">.</span>
        </h2>
        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.42em] text-slate-400">
          Internal Core Access
        </p>
      </div>

      <div className="px-8 py-8 sm:px-10 sm:py-9">
        {errorMsg && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            <AlertCircle size={16} strokeWidth={3} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="block px-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400"
            >
              Identity ID
            </label>
            <Input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="operator@vittya.com"
              className="h-14 rounded-2xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-900 shadow-inner shadow-slate-200/70 focus-visible:ring-2 focus-visible:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label
                htmlFor="login-password"
                className="block text-[10px] font-black uppercase tracking-[0.24em] text-slate-400"
              >
                Passcode
              </label>
              <Link
                href="/register"
                className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600"
              >
                Request Access
              </Link>
            </div>

            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-14 rounded-2xl border-none bg-slate-50 px-4 pr-12 text-sm font-bold text-slate-900 shadow-inner shadow-slate-200/70 focus-visible:ring-2 focus-visible:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <Button
            disabled={loading}
            className="mt-2 flex h-15 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 text-[11px] font-black uppercase tracking-[0.28em] text-white transition-all active:scale-[0.98] hover:bg-emerald-600"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Establish Connection
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-8 py-5 text-center sm:px-10">
        <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">
          New here?{" "}
          <Link
            href="/register"
            className="text-emerald-600 underline underline-offset-4"
          >
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
}
