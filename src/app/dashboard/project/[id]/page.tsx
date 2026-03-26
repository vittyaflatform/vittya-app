"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarDays,
  CheckCircle,
  ExternalLink,
  Image as ImageIcon,
  Music,
  PenTool,
  Share2,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ProjectData {
  id: string;
  slug: string;
  groom_name: string;
  bride_name: string;
  akad_date: string;
  reception_place: string;
  groom_photo: string;
  bride_photo: string;
  music_url: string;
  views: number;
}

export default function OverviewPage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProjectData | null>(null);
  const [stats, setStats] = useState({
    guests: 0,
    attended: 0,
    wishes: 0,
    views: 0,
  });
  const [progress, setProgress] = useState(0);
  const [nextAction, setNextAction] = useState({
    title: "",
    desc: "",
    link: "",
    icon: PenTool,
  });

  const fetchDashboardData = useCallback(async () => {
    if (!projectId) return;
    try {
      const [invRes, guestRes, commRes] = await Promise.all([
        supabase.from("invitations").select("*").eq("id", projectId).single(),
        supabase
          .from("guests")
          .select("pax, has_attended")
          .eq("invitation_id", projectId),
        supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("invitation_id", projectId),
      ]);

      if (invRes.data) {
        const project = invRes.data as ProjectData;
        setData(project);
        let score = 20;
        let action = {
          title: "Siap!",
          desc: "Data lengkap.",
          link: "",
          icon: CheckCircle,
        };

        if (!project.groom_name)
          action = {
            title: "Isi Mempelai",
            desc: "Data belum lengkap.",
            link: "/couple",
            icon: Users,
          };
        else if (!project.akad_date) {
          score = 40;
          action = {
            title: "Atur Acara",
            desc: "Setting lokasi & jam.",
            link: "/event",
            icon: CalendarDays,
          };
        } else if (!project.groom_photo) {
          score = 60;
          action = {
            title: "Upload Foto",
            desc: "Tambah prewed.",
            link: "/couple",
            icon: ImageIcon,
          };
        } else if (!project.music_url) {
          score = 80;
          action = {
            title: "Pilih Musik",
            desc: "Lagu latar kosong.",
            link: "/music",
            icon: Music,
          };
        } else score = 100;

        setProgress(score);
        setNextAction(action);
        setStats({
          guests: guestRes.data?.length || 0,
          attended: guestRes.data?.filter((g) => g.has_attended).length || 0,
          wishes: commRes.count || 0,
          views: project.views || 0,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, supabase]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const invUrl = data
    ? `${window.location.origin}/invitation/${data.slug || data.id}`
    : "";

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Vittya Dashboard
          </h1>
          <p className="text-slate-500 font-medium">
            Monitoring performa undangan digital Anda.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            asChild
            className="font-bold border-slate-300"
          >
            <Link href={invUrl} target="_blank">
              <ExternalLink size={16} className="mr-2" />
              Preview
            </Link>
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(invUrl);
              toast.success("Link disalin!");
            }}
            className="bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg"
          >
            <Share2 size={16} className="mr-2" />
            Bagikan
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-2xl bg-slate-900 text-white relative">
          <div className="absolute top-0 right-0 p-40 bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
          <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-32 h-32 shrink-0">
              {data?.groom_photo ? (
                <Image
                  src={data.groom_photo}
                  alt="Mempelai"
                  fill
                  priority // Menghilangkan warning LCP
                  sizes="128px" // Menghilangkan warning missing sizes
                  className="object-cover rounded-full border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="w-full h-full rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-500">
                  <ImageIcon size={40} />
                </div>
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 mb-4 px-3 py-1 font-black">
                PROJECT LIVE
              </Badge>
              <h2 className="text-4xl font-black mb-6">
                {data?.groom_name?.split(" ")[0] || "Pria"} &{" "}
                {data?.bride_name?.split(" ")[0] || "Wanita"}
              </h2>
              <div className="flex justify-center md:justify-start gap-8">
                <StatItem label="Dilihat" val={stats.views} />
                <StatItem label="Ucapan" val={stats.wishes} />
                <StatItem label="Tamu" val={stats.guests} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Kesehatan Undangan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-black text-indigo-600 uppercase">
                <span>Kelengkapan</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <Link href={`/dashboard/project/${projectId}${nextAction.link}`}>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 transition-all group flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl text-indigo-600 group-hover:scale-110 transition-transform">
                  <nextAction.icon size={20} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm leading-none">
                    {nextAction.title}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    {nextAction.desc}
                  </p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const StatItem = ({ label, val }: { label: string; val: number }) => (
  <div>
    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
      {label}
    </p>
    <p className="text-2xl font-black text-white leading-none mt-1">{val}</p>
  </div>
);
