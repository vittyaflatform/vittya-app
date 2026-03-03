import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // ✅ 1. SERVER-SIDE SESSION VALIDATION (Keamanan Berlapis)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access detected." },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const invitationId = formData.get("invitationId") as string;
    const assetType = formData.get("assetType") as string;

    // ✅ 2. VALIDASI INPUT KETAT
    if (!file || !invitationId || !assetType) {
      return NextResponse.json(
        { error: "Missing required upload parameters." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ 3. ENTERPRISE FOLDER STRUCTURE
    // Format folder rapi: vittya/[USER_ID]/[PROJECT_ID]/[CATEGORY]
    const dynamicFolder = `vittya/${user.id}/${invitationId}/${assetType}`;

    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: dynamicFolder,
          resource_type: "auto",
          quality: "auto", // Auto-compress biar loading web kenceng
          fetch_format: "auto", // Ganti ke WebP otomatis jika browser mendukung
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("🔥 Cloudinary Fatal Error:", error);
    return NextResponse.json(
      { error: "Server error during upload process." },
      { status: 500 },
    );
  }
}
