"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Armchair,
  BookHeart,
  Calendar,
  ExternalLink,
  Gift,
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Music,
  Palette,
  QrCode,
  Quote,
  Settings,
  Users,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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

export default function ProjectLayoutShell({
  children,
  projectId,
  projectSlug,
}: {
  children: React.ReactNode;
  projectId: string;
  projectSlug: string;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            V
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Vittya
          </span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent
              projectId={projectId}
              projectSlug={projectSlug}
              isMobile
            />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="fixed hidden h-full w-64 flex-col overflow-hidden border-r border-slate-200 bg-white md:flex">
        <SidebarContent projectId={projectId} projectSlug={projectSlug} />
      </aside>

      <main className="min-h-screen flex-1 p-4 pt-20 md:ml-64 md:p-8 md:pt-8">
        <div className="mx-auto max-w-5xl">{children}</div>
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
    <div className="flex h-full flex-col bg-white">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white p-6">
        {!isMobile && (
          <Link
            href="/dashboard"
            className="group mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft
              size={14}
              className="mr-1 transition-transform group-hover:-translate-x-1"
            />
            Kembali
          </Link>
        )}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-xl font-black text-white shadow-lg shadow-indigo-200">
            V
          </div>
          <div>
            <h1 className="text-lg leading-none font-extrabold tracking-tight text-slate-900">
              Vittya
            </h1>
            <p className="text-[10px] font-medium text-slate-400">
              Editor Undangan
            </p>
          </div>
        </div>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-4 pb-20">
        {MENU_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <MenuItem
                  key={item.name}
                  item={item}
                  pathname={pathname}
                  projectId={projectId}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="sticky bottom-0 z-10 border-t border-slate-100 bg-slate-50/80 p-4 backdrop-blur-sm">
        {projectSlug ? (
          <Button
            asChild
            className="group h-11 w-full justify-between border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
          >
            <a
              href={`/invitation/${projectSlug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex items-center gap-2 font-semibold">
                <ExternalLink size={16} /> Lihat Live
              </span>
              <div className="h-2 w-2 rounded-full bg-emerald-500 transition-colors group-hover:bg-white" />
            </a>
          </Button>
        ) : (
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
        )}
      </div>
    </div>
  );
}

function MenuItem({
  item,
  pathname,
  projectId,
}: {
  item: {
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    path: string;
  };
  pathname: string;
  projectId: string;
}) {
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
        "group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-indigo-50 font-semibold text-indigo-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <item.icon size={18} />
      <span>{item.name}</span>
    </Link>
  );
}
