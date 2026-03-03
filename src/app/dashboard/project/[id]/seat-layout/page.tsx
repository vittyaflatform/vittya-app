"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import * as fabric from "fabric";
import {
  Download,
  Grid3X3,
  Loader2,
  MousePointer2,
  Plus,
  Save,
  Settings2,
  Trash2,
  Type,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function SeatingDesignerPro() {
  const params = useParams();
  const projectId = params?.id as string;
  const supabase = createClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.fabric.Canvas | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const GRID_SIZE = 20;

  useEffect(() => {
    if (!canvasRef.current) return;

    // Inisialisasi Canvas dengan High-Res Support
    const fc = new fabric.fabric.Canvas(canvasRef.current, {
      width: 1000,
      height: 650,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true, // Menjaga urutan layering saat klik
    });

    // Custom Control Styling (Canva Green Style)
    fabric.fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: "#10b981",
      cornerStyle: "circle",
      cornerSize: 10,
      borderColor: "#10b981",
      borderDashArray: [3, 3],
      padding: 5,
    });

    // Logic: Snapping to Grid biar lurus
    fc.on("object:moving", (options) => {
      if (options.target) {
        options.target.set({
          left: Math.round(options.target.left! / GRID_SIZE) * GRID_SIZE,
          top: Math.round(options.target.top! / GRID_SIZE) * GRID_SIZE,
        });
      }
    });

    // Load Initial Data
    const loadData = async () => {
      const { data } = await supabase
        .from("floor_plans")
        .select("canvas_data")
        .eq("invitation_id", projectId)
        .single();
      if (data?.canvas_data) {
        fc.loadFromJSON(data.canvas_data, () => {
          fc.renderAll();
          toast.success("Design loaded successfully");
        });
      }
    };
    loadData();

    setCanvas(fc);

    return () => {
      fc.dispose();
    };
  }, [projectId, supabase]);

  // --- ENGINE: Pembuat Meja & Kursi Akurat ---
  const addTableSet = (type: "round" | "rect", chairCount: number = 8) => {
    if (!canvas) return;

    // 1. Meja
    const table =
      type === "round"
        ? new fabric.fabric.Circle({
            radius: 50,
            fill: "#ffffff",
            stroke: "#064e3b",
            strokeWidth: 2,
            originX: "center",
            originY: "center",
          })
        : new fabric.fabric.Rect({
            width: 140,
            height: 90,
            fill: "#064e3b",
            stroke: "#064e3b",
            strokeWidth: 2,
            rx: 10,
            ry: 10,
            originX: "center",
            originY: "center",
          });

    // 2. Label Nomor/Nama Meja (Bisa diedit langsung)
    const label = new fabric.fabric.IText(type === "round" ? "01" : "VIP", {
      fontSize: 18,
      fontWeight: "bold",
      fill: type === "round" ? "#064e3b" : "#ffffff",
      originX: "center",
      originY: "center",
      fontFamily: "Inter",
    });

    // 3. Kursi (Trigonometry Logic: Kursi ngadep meja)
    const chairObjects: fabric.fabric.Object[] = [];
    const radius = type === "round" ? 75 : 85;

    for (let i = 0; i < chairCount; i++) {
      const angle = (i / chairCount) * 2 * Math.PI;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const chair = new fabric.fabric.Rect({
        width: 24,
        height: 24,
        fill: "#f1f5f9",
        stroke: "#94a3b8",
        rx: 6,
        ry: 6,
        left: x,
        top: y,
        originX: "center",
        originY: "center",
        angle: (angle * 180) / Math.PI + 90, // Rotasi otomatis menghadap pusat meja
      });
      chairObjects.push(chair);
    }

    const group = new fabric.fabric.Group([table, label, ...chairObjects], {
      left: 200,
      top: 200,
      subTargetCheck: true, // Fitur penting: Bisa klik IText di dalam grup!
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  };

  const handleSave = async () => {
    if (!canvas) return;
    setIsSaving(true);
    const { error } = await supabase.from("floor_plans").upsert(
      {
        invitation_id: projectId,
        canvas_data: canvas.toJSON(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "invitation_id" },
    );

    if (!error) toast.success("Desain tersimpan di Cloud");
    else toast.error("Gagal simpan.");
    setIsSaving(false);
  };

  const exportAsImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: "png", quality: 1 });
    const link = document.createElement("a");
    link.download = `seating-plan-${projectId}.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans">
      {/* PROFESSIONAL NAVBAR */}
      <header className="h-16 bg-emerald-950 px-6 flex items-center justify-between shadow-2xl z-50">
        <div className="flex items-center gap-4 text-white">
          <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
            <Grid3X3 size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold tracking-tight text-sm uppercase leading-none">
              Architect <span className="text-emerald-400 font-light">Pro</span>
            </h1>
            <span className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">
              Vittya Design Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => addTableSet("round", 10)}
            className="text-white hover:bg-emerald-900 text-xs"
          >
            <Plus size={14} className="mr-1" /> Round (10)
          </Button>
          <Button
            variant="ghost"
            onClick={() => addTableSet("rect", 6)}
            className="text-white hover:bg-emerald-900 text-xs"
          >
            <Plus size={14} className="mr-1" /> VIP Table (6)
          </Button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <Button
            onClick={exportAsImage}
            variant="outline"
            size="sm"
            className="border-emerald-800 text-emerald-100 bg-transparent hover:bg-emerald-900"
          >
            <Download size={14} className="mr-2" /> Export PNG
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-6 shadow-xl shadow-emerald-500/10"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} className="mr-2" />
            )}{" "}
            SAVE DESIGN
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR CONTROLS */}
        <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-8 gap-8 shadow-sm">
          <SidebarIcon
            icon={<MousePointer2 size={22} />}
            active
            label="Select"
          />
          <SidebarIcon
            icon={<Type size={22} />}
            onClick={() =>
              canvas?.add(
                new fabric.fabric.IText("Label", {
                  fontSize: 24,
                  left: 100,
                  top: 100,
                }),
              )
            }
            label="Text"
          />
          <SidebarIcon icon={<Settings2 size={22} />} label="Setting" />
          <div className="flex-1" />
          <SidebarIcon
            icon={<Trash2 size={22} className="text-red-400" />}
            onClick={() => {
              canvas?.remove(...canvas.getActiveObjects());
              canvas?.discardActiveObject().renderAll();
              toast.error("Object deleted");
            }}
            label="Delete"
          />
        </aside>

        {/* WORKSPACE */}
        <main className="flex-1 relative bg-slate-200 p-12 flex items-center justify-center overflow-auto scrollbar-hide">
          <div className="bg-white shadow-[0_25px_80px_rgba(0,0,0,0.15)] rounded-sm relative">
            {/* Subtle Grid Pattern for Alignment */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
            <canvas ref={canvasRef} />
          </div>
        </main>
      </div>

      <footer className="h-10 bg-white border-t border-slate-200 flex items-center px-8 justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex gap-8 italic text-emerald-600">
          <span className="flex items-center gap-2">
            <Grid3X3 size={12} /> Alignment: Snapped (20px)
          </span>
          <span>Engine: Fabric.js v5.3 Premium</span>
        </div>
        <span>© 2026 Vittya Architect • Build with Precision</span>
      </footer>
    </div>
  );
}

// Reusable Components
function SidebarIcon({ icon, active, onClick, label }: any) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        className={`p-3 rounded-2xl transition-all duration-300 ${active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-110" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
      >
        {icon}
      </button>
      <span
        className={`text-[9px] font-bold tracking-tighter ${active ? "text-emerald-600" : "text-slate-300"}`}
      >
        {label}
      </span>
    </div>
  );
}
