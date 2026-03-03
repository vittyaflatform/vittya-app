"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Grid3X3,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function SeatLayoutPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const supabase = createClient();
  const canvasRef = useRef<HTMLDivElement>(null);

  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch Data with Error Handling
  const fetchTables = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("seating_tables")
        .select("*")
        .eq("invitation_id", projectId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTables(data || []);
    } catch (err: any) {
      toast.error(
        "Database Error: Pastikan tabel 'seating_tables' sudah dibuat!",
      );
    } finally {
      setLoading(false);
    }
  }, [projectId, supabase]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // 2. Add Table with Auto-Placement
  const addTable = async () => {
    const newTable = {
      invitation_id: projectId,
      name: `T-${tables.length + 1}`,
      capacity: 10,
      x_position: 150 + tables.length * 10, // Offset sedikit biar gak numpuk
      y_position: 150 + tables.length * 10,
    };

    const { data, error } = await supabase
      .from("seating_tables")
      .insert(newTable)
      .select()
      .single();
    if (error) return toast.error("Failed to add table");
    setTables([...tables, data]);
    toast.success("Table deployed to canvas");
  };

  // 3. Professional Drag Logic (Mouse & Touch)
  const handleStartDrag = (
    id: string,
    startEvent: React.MouseEvent | React.TouchEvent,
  ) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    const moveHandler = (moveEvent: any) => {
      const clientX = moveEvent.touches
        ? moveEvent.touches[0].clientX
        : moveEvent.clientX;
      const clientY = moveEvent.touches
        ? moveEvent.touches[0].clientY
        : moveEvent.clientY;

      // Magnetic Grid Logic (loncat per 10px biar rapi)
      const x = Math.round((clientX - rect.left - 60) / 10) * 10;
      const y = Math.round((clientY - rect.top - 60) / 10) * 10;

      setTables((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, x_position: x, y_position: y } : t,
        ),
      );
    };

    const stopHandler = () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", stopHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", stopHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", stopHandler);
    window.addEventListener("touchmove", moveHandler);
    window.addEventListener("touchend", stopHandler);
  };

  // 4. Batch Update (Efficient)
  const saveLayout = async () => {
    setIsSaving(true);
    const { error } = await supabase.from("seating_tables").upsert(
      tables.map((t) => ({
        id: t.id,
        invitation_id: projectId,
        name: t.name,
        x_position: t.x_position,
        y_position: t.y_position,
        capacity: t.capacity,
      })),
    );

    if (error) toast.error("Sync failed");
    else toast.success("Layout synchronized to cloud");
    setIsSaving(false);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDF8F3]">
        <Loader2 className="animate-spin text-[#1A4D2E]" size={40} />
      </div>
    );

  return (
    <div className="p-6 md:p-10 bg-[#FDF8F3] min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-serif italic font-bold text-[#1A4D2E]">
            Floor{" "}
            <span className="text-[#C5A371] not-italic font-light">
              Designer
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
            <Sparkles size={14} className="text-[#C5A371]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A9907E]">
              Luxury Seating Engine v1.0
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={addTable}
            variant="outline"
            className="h-14 px-6 rounded-2xl border-2 border-[#E8DFD3] bg-white hover:bg-[#FDF8F3] text-[#1A4D2E] font-bold"
          >
            <Plus className="mr-2" size={20} /> Add Table
          </Button>
          <Button
            onClick={saveLayout}
            disabled={isSaving}
            className="h-14 px-8 rounded-2xl bg-[#1A4D2E] hover:bg-[#123520] text-white shadow-xl"
          >
            {isSaving ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Save className="mr-2" size={20} />
            )}
            Save Layout
          </Button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="relative w-full h-[75vh] bg-white rounded-[3.5rem] border-4 border-dashed border-[#E8DFD3] shadow-inner overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(#E8DFD3 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      >
        {/* Stage Placeholder */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-16 py-4 bg-[#1A4D2E] rounded-b-4xl shadow-2xl z-0">
          <span className="text-[9px] font-black text-[#C5A371] uppercase tracking-[0.6em]">
            Main Stage Area
          </span>
        </div>

        {tables.map((table) => (
          <div
            key={table.id}
            onMouseDown={(e) => handleStartDrag(table.id, e)}
            onTouchStart={(e) => handleStartDrag(table.id, e)}
            style={{
              left: `${table.x_position}px`,
              top: `${table.y_position}px`,
              position: "absolute",
              transition: isSaving ? "all 0.5s ease" : "none",
            }}
            className="cursor-move group z-10"
          >
            <div className="w-32 h-32 bg-white border-4 border-[#C5A371] rounded-full shadow-2xl flex flex-col items-center justify-center group-hover:border-[#1A4D2E] transition-all relative">
              {/* Chair decorations */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-[#E8DFD3] rounded-full"
                  style={{
                    transform: `rotate(${i * 60}deg) translateY(-58px)`,
                  }}
                />
              ))}

              <input
                value={table.name}
                onChange={(e) =>
                  setTables(
                    tables.map((t) =>
                      t.id === table.id ? { ...t, name: e.target.value } : t,
                    ),
                  )
                }
                className="bg-transparent text-center font-serif italic font-bold text-[#1A4D2E] text-xl w-24 focus:outline-none"
              />
              <div className="flex items-center gap-1 text-[9px] font-black text-[#A9907E] uppercase">
                <Users size={10} /> {table.capacity} Pax
              </div>

              {/* Delete Action */}
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm("Delete?")) {
                    await supabase
                      .from("seating_tables")
                      .delete()
                      .eq("id", table.id);
                    setTables(tables.filter((t) => t.id !== table.id));
                  }
                }}
                className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {tables.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-[#A9907E] opacity-30 italic">
            <Grid3X3 size={60} strokeWidth={1} />
            <p className="mt-4">
              Canvas empty. Click "Add Table" to start designing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
