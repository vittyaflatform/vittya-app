"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  Calendar,
  Image as ImageIcon,
  Music,
  Palette,
  Users,
  Settings,
  ExternalLink,
  ArrowLeft,
  Gift,
  BookHeart,
  Quote,
  Video,
  MessageSquare,
  Menu,
  Armchair,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

const MENU_GROUPS = [
  {
    label: "Konten Undangan",
    items: [
      { name: "Overview", icon: LayoutDashboard, path: "" },
      { name: "Mempelai", icon: Heart, path: "/couple" },
      { name: "Acara", icon: Calendar, path: "/event" },
      { name: "Denah Duduk", icon: Armchair, path: "/seat-layout" },
      { name: "Kisah Cinta", icon: BookHeart, path: "/story" },
      { name: "Galeri", icon: ImageIcon, path: "/gallery" },
      { name: "Kado Digital", icon: Gift, path: "/gift" },
      { name: "Quote", icon: Quote, path: "/quote" },
      { name: "Streaming", icon: Video, path: "/streaming" },
      { name: "Ucapan", icon: MessageSquare, path: "/comments" },
    ],
  },
  {
    label: "Manajemen & Fitur",
    items: [
      { name: "Tamu", icon: Users, path: "/guest" },
      { name: "Absensi QR", icon: QrCode, path: "/check-in" },
      { name: "Musik", icon: Music, path: "/music" },
      { name: "Tema", icon: Palette, path: "/theme" },
      { name: "Pengaturan", icon: Settings, path: "/settings" },
    ],
  },
];

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params?.id as string;
  const [projectSlug, setProjectSlug] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchSlug = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("slug")
        .eq("id", projectId)
        .single();

      if (!error && data) setProjectSlug(data.slug);
    } catch (err) {
      console.error("Layout Fetch Error:", err);
    }
  }, [projectId, supabase]);

  useEffect(() => {
    if (isMounted) fetchSlug();
  }, [isMounted, fetchSlug]);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-20">
          <div className="p-6 border-b border-slate-100">
            <div className="h-8 w-32 bg-slate-100 rounded animate-pulse"></div>
          </div>
        </aside>
        <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen animate-pulse bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            V
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Vittya
          </span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent
              projectId={projectId}
              projectSlug={projectSlug}
              isMobile={true}
            />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-20 overflow-hidden">
        <SidebarContent projectId={projectId} projectSlug={projectSlug} />
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

function SidebarContent({
  projectId,
  projectSlug,
  isMobile = false,
}: {
  projectId: string;
  projectSlug: string;
  isMobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
        {!isMobile && (
          <Link
            href="/dashboard"
            className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-wider mb-4 group"
          >
            <ArrowLeft
              size={14}
              className="mr-1 group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali
          </Link>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
            V
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
              Vittya
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              Editor Undangan
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-20">
        {MENU_GROUPS.map((group, idx) => (
          <div key={idx}>
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <MenuItem
                  key={item.name}
                  item={item}
                  projectId={projectId}
                  pathname={pathname}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm sticky bottom-0 z-10">
        {projectSlug ? (
          <Button
            asChild
            className="w-full justify-between bg-white hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 hover:border-indigo-600 transition-all shadow-sm group h-11"
          >
            <a
              href={`/invitation/${projectSlug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex items-center gap-2 font-semibold">
                <ExternalLink size={16} /> Lihat Live
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse group-hover:bg-white"></div>
            </a>
          </Button>
        ) : (
          <div className="h-10 w-full bg-slate-100 animate-pulse rounded-lg" />
        )}
      </div>
    </div>
  );
}

interface MenuItemProps {
  item: {
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    path: string;
  };
  projectId: string;
  pathname: string;
}

function MenuItem({ item, projectId, pathname }: MenuItemProps) {
  const fullPath =
    item.path === ""
      ? `/dashboard/project/${projectId}`
      : `/dashboard/project/${projectId}${item.path}`;
  const isActive =
    item.path === "" ? pathname === fullPath : pathname.startsWith(fullPath);

  return (
    <Link
      href={fullPath}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
        isActive
          ? "bg-indigo-50 text-indigo-700 font-semibold"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <item.icon
        size={18}
        className={cn(
          isActive
            ? "text-indigo-600"
            : "text-slate-400 group-hover:text-slate-600",
        )}
      />
      {item.name}
      {isActive && (
        <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
      )}
    </Link>
  );
}
