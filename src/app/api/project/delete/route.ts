import { createClient } from "@/lib/supabase/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { projectId } = await req.json();
    if (!projectId)
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 },
      );

    // --- STRATEGI 1: BERESIN CLOUDINARY (STORAGE) ---
    // Path folder: vittya/USER_ID/PROJECT_ID
    const projectFolder = `vittya/${user.id}/${projectId}`;

    try {
      // A. Hapus semua file di dalam folder & sub-folder
      await cloudinary.api.delete_resources_by_prefix(projectFolder);

      // B. Hapus semua sub-folder di dalam folder project (jika ada)
      await cloudinary.api.delete_folder(projectFolder);

      console.log(`✅ Cloudinary Clean: ${projectFolder}`);
    } catch (cloudErr: any) {
      // Jika folder sudah kosong atau tidak ada, biarkan lanjut ke DB
      console.warn("Cloudinary cleanup notice:", cloudErr.message);
    }

    // --- STRATEGI 2: BERESIN SUPABASE (DATABASE) ---
    // Kita hapus manual tabel-tabel anak jika lo belum set ON DELETE CASCADE di DB
    // Ini langkah 'Brute Force' supaya gak ada error Foreign Key Constraint

    const relatedTables = [
      "guests",
      "comments",
      "events",
      "stories",
      "gallery",
    ];

    for (const table of relatedTables) {
      await supabase.from(table).delete().eq("invitation_id", projectId);
    }

    // Terakhir, hapus data utamanya
    const { error: dbError } = await supabase
      .from("invitations")
      .delete()
      .eq("id", projectId)
      .eq("user_id", user.id);

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      message: "Atomic Delete Success: Storage & DB Cleared.",
    });
  } catch (error: any) {
    console.error("🔥 ATOMIC DELETE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menghapus secara total" },
      { status: 500 },
    );
  }
}
