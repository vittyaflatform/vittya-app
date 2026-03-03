"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Sparkles, Users } from "lucide-react";
import Image from "next/image"; // Import ini penting!
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100">
      {/* 1. Navbar dengan Logo */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo-Vittya.png"
              alt="Vittya Logo"
              width={40}
              height={40}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="text-2xl font-bold tracking-tighter text-emerald-900">
              Vittya.
            </span>
          </Link>

          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <Link
              href="#features"
              className="hover:text-emerald-600 transition-colors"
            >
              Fitur
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Showcase
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Harga
            </Link>
          </div>

          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100">
                Mulai Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* 2. Hero Section */}
        <section className="px-8 pt-24 pb-32 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-8 inline-block border border-emerald-100 shadow-sm">
              ✨ The New Era of Wedding Invitations
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Undangan Digital <br />
              <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Cerdas & Interaktif.
              </span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Buat cerita cinta unik dengan AI, atur denah tamu sekelas Bioskop,
              dan pantau kehadiran secara real-time. Semuanya dalam satu
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all hover:scale-105"
                >
                  Buat Undangan Sekarang <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg hover:bg-slate-50"
              >
                Lihat Demo Live
              </Button>
            </div>
          </motion.div>
        </section>

        {/* 3. Key Features Section */}
        <section
          id="features"
          className="bg-slate-50 py-28 px-8 border-y border-slate-100"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Fitur "Hidden Gem" Vittya
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Teknologi yang dirancang khusus untuk mempermudah WO dan memukau
                tamu undangan.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Sparkles className="text-emerald-500 w-10 h-10" />,
                  title: "AI Story Writer",
                  desc: "Narasi perjalanan cinta yang menyentuh hati, dibuat otomatis oleh AI hanya dalam hitungan detik.",
                },
                {
                  icon: (
                    <LayoutDashboard className="text-emerald-500 w-10 h-10" />
                  ),
                  title: "Cinema-Style Seating",
                  desc: "Ucapkan selamat tinggal pada tamu yang bingung cari meja. Visualisasi interaktif yang elegan.",
                },
                {
                  icon: <Users className="text-emerald-500 w-10 h-10" />,
                  title: "Real-time RSVP",
                  desc: "Pantau daftar hadir tamu secara live. Sinkronisasi otomatis dengan dashboard management lo.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-10 border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] bg-white h-full group">
                    <div className="mb-6 p-3 bg-emerald-50 w-fit rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed">
                      {feature.desc}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer dengan Logo */}
      <footer className="bg-white border-t py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-Vittya.png"
              alt="Vittya Logo"
              width={30}
              height={30}
            />
            <div className="text-xl font-bold text-emerald-900">Vittya.</div>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 Vittya Platform. Crafted for your special moment.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
