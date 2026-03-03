"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useCallback, useState } from "react";
import { UploadCloud, Trash, Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function AudioUpload({
  value,
  onChange,
  onRemove,
  disabled,
}: AudioUploadProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const onUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url);
    },
    [onChange],
  );

  // --- REGEX LEBIH KUAT ---
  const getPublicIdFromUrl = (url: string) => {
    if (!url) return null;
    try {
      // Logika: Cari kata 'upload/', lewati versi 'v123/', ambil sisanya sampai titik '.'
      // Contoh: .../upload/v12345/folder/lagu.mp3 -> folder/lagu
      const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^/.]+)?$/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error("Gagal ekstrak ID:", error);
      return null;
    }
  };

  const handleDelete = async () => {
    if (!value) return;
    setIsDeleting(true);

    const publicId = getPublicIdFromUrl(value);
    console.log("🗑️ Mencoba hapus Audio ID:", publicId); // Cek di Console Browser

    if (publicId) {
      try {
        const res = await fetch("/api/cloudinary/delete", {
          method: "POST",
          body: JSON.stringify({
            publicId,
            resourceType: "video", // <--- Audio dianggap Video
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("Gagal API Delete:", errData);
          alert("Gagal menghapus file di server cloud. Cek terminal.");
        } else {
          console.log("Berhasil delete!");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    } else {
      console.error("Public ID tidak ditemukan dari URL");
    }

    onRemove();
    setIsDeleting(false);
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 animate-in fade-in">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
            <Music size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              File Audio Terupload
            </p>
            <p className="text-xs text-slate-500 truncate max-w-50">
              {value}
            </p>
          </div>

          <Button
            type="button"
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            disabled={disabled || isDeleting}
            className="shrink-0"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash size={16} />
            )}
          </Button>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={onUpload}
          options={{
            maxFiles: 1,
            resourceType: "video",
            clientAllowedFormats: ["mp3", "wav", "m4a"],
            maxFileSize: 10000000,
          }}
        >
          {({ open }) => {
            return (
              <div
                onClick={() => !disabled && open()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all gap-3 text-slate-400 hover:text-indigo-600"
              >
                <div className="p-4 bg-slate-100 rounded-full">
                  <UploadCloud size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">
                    Klik untuk Upload Audio
                  </p>
                  <p className="text-xs mt-1">Format: MP3, WAV (Max 10MB)</p>
                </div>
              </div>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
}
