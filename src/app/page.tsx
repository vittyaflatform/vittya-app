"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Check, Layout, Star, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 font-sans">
      {/* 1. Global Header (Agency Style) */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-Vittya.png"
                alt="Vittya"
                width={32}
                height={32}
              />
              <span className="text-xl font-black tracking-tighter text-emerald-950 uppercase italic">
                VITTYA.
              </span>
            </Link>
            <div className="hidden lg:flex gap-8 text-[13px] font-bold uppercase tracking-widest text-slate-500">
              <Link
                href="#templates"
                className="hover:text-emerald-600 transition-colors"
              >
                Templates
              </Link>
              <Link
                href="#features"
                className="hover:text-emerald-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="hover:text-emerald-600 transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-600 hover:text-emerald-700 hidden sm:block"
            >
              Login
            </Link>
            <Button className="bg-emerald-950 text-white rounded-full px-8 font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
              Create Your Event
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* 2. Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden bg-slate-50">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 text-emerald-700 mb-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 shadow-sm"
                    />
                  ))}
                </div>
                <span className="text-sm font-bold tracking-tight">
                  +1,200 Couples Trusted Us
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                The Most Advanced <br />
                <span className="text-emerald-700 italic">
                  Wedding Ecosystem.
                </span>
              </h1>
              <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg">
                Vittya menyederhanakan kompleksitas pernikahan Anda. Dari narasi
                AI hingga manajemen tamu presisi, semua dalam satu kendali.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-emerald-950 h-16 px-10 rounded-2xl text-md font-bold shadow-xl shadow-emerald-900/20"
                >
                  Build Now — It&apos;s Free
                </Button>
                <div className="flex flex-col justify-center">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    4.9/5 RATING
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="aspect-square bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden relative group">
                <div className="absolute inset-0 bg-emerald-900/5 group-hover:bg-transparent transition-colors duration-500" />
                <div className="p-8 h-full flex flex-col justify-center items-center text-center">
                  <Layout className="w-20 h-20 text-emerald-200 mb-6" />
                  <p className="text-slate-400 font-bold tracking-[0.2em] text-[10px] uppercase">
                    Dashboard Preview Incoming
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Global Template Library */}
        <section id="templates" className="py-32 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">
                  Our Library
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter leading-tight">
                  Pilih Estetika <br /> Pernikahan Anda.
                </h2>
              </div>
              <Link href="/templates">
                <Button
                  variant="outline"
                  className="group border-2 border-slate-900 rounded-full px-8 py-6 font-bold text-sm uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all"
                >
                  Explore All Templates
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  name: "Serenity Gold",
                  category: "Modern Luxury",
                  img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070",
                  tag: "Best Seller",
                },
                {
                  name: "Basalt Minimalist",
                  category: "Urban Chic",
                  img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069",
                  tag: "New Arrival",
                },
                {
                  name: "Eternal Blossom",
                  category: "Ethereal Garden",
                  img: "https://images.unsplash.com/photo-1522673607200-1648482ce486?q=80&w=2072",
                  tag: "Editor's Choice",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-4/5 rounded-[40px] overflow-hidden border border-slate-100 bg-slate-50 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950">
                        {item.tag}
                      </span>
                    </div>
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex justify-between items-start px-2">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
                        {item.name}
                      </h3>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
                        {item.category}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Pricing */}
        <section
          id="pricing"
          className="py-32 px-6 bg-slate-950 text-white rounded-[60px] mx-4 my-10 relative overflow-hidden"
        >
          <div className="max-w-5xl mx-auto text-center mb-20">
            <span className="text-emerald-400 font-bold text-xs tracking-[0.3em] uppercase">
              Pricing Plans
            </span>
            <h2 className="text-4xl md:text-6xl font-black mt-4">
              Transparent & Flexible.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-10 bg-white/5 border-white/10 backdrop-blur-md rounded-[40px] text-white">
              <h3 className="text-2xl font-bold mb-2 uppercase tracking-tighter">
                Essential
              </h3>
              <div className="text-4xl font-black mb-6">
                Free{" "}
                <span className="text-sm font-medium text-slate-400">
                  / forever
                </span>
              </div>
              <ul className="space-y-4 mb-10 text-slate-300 font-medium text-sm">
                <li className="flex gap-3">
                  <Check className="text-emerald-400" size={18} /> Standard
                  Invitation
                </li>
                <li className="flex gap-3">
                  <Check className="text-emerald-400" size={18} /> Basic Guest
                  Management
                </li>
              </ul>
              <Button className="w-full h-14 bg-white text-black hover:bg-emerald-400 font-bold rounded-2xl">
                Start for Free
              </Button>
            </Card>
            <Card className="p-10 bg-emerald-800 border-none rounded-[40px] text-white relative">
              <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2 uppercase tracking-tighter">
                Elite Protocol
              </h3>
              <div className="text-4xl font-black mb-6">
                Rp 149k{" "}
                <span className="text-sm font-medium text-white/60">
                  / event
                </span>
              </div>
              <ul className="space-y-4 mb-10 text-emerald-50 font-medium text-sm">
                <li className="flex gap-3">
                  <Zap className="text-white" size={18} fill="white" /> AI
                  Storyteller Full
                </li>
                <li className="flex gap-3">
                  <Zap className="text-white" size={18} fill="white" /> Secure
                  Check-in
                </li>
              </ul>
              <Button className="w-full h-14 bg-black text-white hover:bg-emerald-950 font-bold rounded-2xl">
                Get Elite Access
              </Button>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-xs">
            <div className="text-2xl font-black italic mb-4 uppercase">
              VITTYA.
            </div>
            <p className="text-slate-400 text-sm font-medium italic">
              "Bukan sekadar kodingan, tapi tentang bagaimana teknologi
              menghargai momen paling berharga."
            </p>
          </div>
          <div className="flex gap-12">
            <div className="text-xs font-black uppercase text-slate-300 tracking-[0.2em]">
              © 2026 Vittya System Portal
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
