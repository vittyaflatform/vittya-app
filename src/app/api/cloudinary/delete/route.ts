import { createClient } from "@/lib/supabase/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// ✅ KONFIGURASI PRIVATE (Server-Side Only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // ✅ 1. SECURITY LAYER: Validasi Session Server
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized! Akses ditolak." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { publicId, resourceType = "image" } = body;

    // ✅ 2. VALIDASI INPUT DASAR
    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID wajib diisi" },
        { status: 400 },
      );
    }

    // ✅ 3. OWNERSHIP VALIDATION (Anti-Hacker)
    // Memastikan user hanya bisa menghapus aset yang berada di folder vittya/USER_ID/
    const ownerPrefix = `vittya/${user.id}/`;
    if (!publicId.startsWith(ownerPrefix)) {
      console.warn(
        `🚨 SECURITY ALERT: User [${user.id}] mencoba hapus aset ilegal: [${publicId}]`,
      );
      return NextResponse.json(
        { error: "Forbidden! Anda hanya bisa menghapus aset milik sendiri." },
        { status: 403 },
      );
    }

    // ✅ 4. EKSEKUSI HAPUS & INVALIDASI CACHE CDN
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true, // Memaksa CDN hapus cache agar gambar lama gak nyangkut
    });

    // ✅ 5. LOGGING OPERASIONAL
    console.log(`🗑️ ASSET DELETED: [${publicId}] by [${user.id}]`);

    if (result.result !== "ok" && result.result !== "not found") {
      return NextResponse.json(
        { error: "Gagal menghapus di Cloudinary", details: result },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Asset successfully deleted",
      result: result.result,
    });
  } catch (error: any) {
    console.error("🔥 DELETE API FATAL ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
