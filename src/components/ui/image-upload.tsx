"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression"; // Import ini bro!
import {
  Check,
  Crop as CropIcon,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
  userId?: string;
  invitationId?: string;
  assetType?: string;
}

export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
  userId,
  invitationId,
  assetType = "general",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!userId || !invitationId) {
      return toast.error("System warming up, please wait...");
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    });
    reader.readAsDataURL(file);
  };

  const handleUploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    setShowCropper(false);
    const toastId = toast.loading("Processing your premium portrait...");

    try {
      const image = new window.Image();
      image.src = imageSrc;
      await new Promise((res) => (image.onload = res));

      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Canvas context failed");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );

      // KONVERSI KE BLOB
      const blob: Blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95);
      });

      // --- AUTO COMPRESSION ENGINE ---
      toast.loading("Optimizing for web (Lightweight)...", { id: toastId });
      const compressionOptions = {
        maxSizeMB: 0.8, // Target di bawah 1MB
        maxWidthOrHeight: 1200, // Resolusi cukup untuk portrait wedding
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(
        blob as File,
        compressionOptions,
      );
      // -------------------------------

      toast.loading("Syncing with cloud...", { id: toastId });
      const formData = new FormData();
      formData.append("file", compressedFile, "vittya-portrait.jpg");
      formData.append("userId", userId!);
      formData.append("invitationId", invitationId!);
      formData.append("assetType", assetType);

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onChange(data.url);
        toast.success("Portrait secured!", { id: toastId });
      } else {
        throw new Error(data.error || "Gagal upload");
      }
    } catch (err: any) {
      toast.error("Upload failed. Try a different photo.", { id: toastId });
    } finally {
      setIsUploading(false);
      setImageSrc(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!value) return;

    // OPTIMISTIC UI: Hapus di layar dulu biar berasa instant
    const oldValue = value;
    onRemove(value);
    toast.success("Photo removed from view.");

    setIsDeleting(true);
    const getPublicId = (url: string) => {
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
      return match ? match[1] : null;
    };

    const publicId = getPublicId(value);

    try {
      if (publicId) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
      }
    } catch {
      console.error("Cloud cleanup failed, but UI is updated.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {value ? (
        <div className="relative w-48 h-48 group">
          <div className="w-full h-full rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-95 group-hover:-rotate-2 bg-slate-100">
            <Image
              fill
              className="object-cover"
              alt="Preview"
              src={value}
              unoptimized
            />
          </div>
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              type="button"
              onClick={handleDelete}
              variant="destructive"
              className="rounded-full w-14 h-14 shadow-2xl border-4 border-white hover:scale-110 transition-transform"
            >
              <Trash className="h-6 w-6" />
            </Button>
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full w-14 h-14 bg-[#1A4D2E] text-white shadow-2xl border-4 border-white hover:scale-110 transition-transform"
            >
              <RefreshCw className="h-6 w-6" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-48 h-48">
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div
            onClick={() => !isUploading && inputRef.current?.click()}
            className={cn(
              "w-full h-full rounded-[3rem] border-4 border-dashed flex flex-col items-center justify-center transition-all duration-500 gap-3 text-center px-6",
              isUploading
                ? "border-slate-100 bg-slate-50 cursor-not-allowed"
                : "border-[#E8DFD3] cursor-pointer hover:bg-white hover:border-[#C5A371] text-[#A9907E] hover:text-[#1A4D2E] hover:shadow-2xl",
            )}
          >
            {isUploading ? (
              <Loader2 className="animate-spin text-[#1A4D2E]" size={40} />
            ) : (
              <>
                <div className="p-4 bg-[#FDF8F3] rounded-2xl group-hover:bg-[#1A4D2E] transition-colors">
                  <ImagePlus size={28} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-tight">
                  Upload <br /> Portrait
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL CROPPER - DENGAN FIX Z-INDEX */}
      <Dialog open={showCropper} onOpenChange={setShowCropper}>
        {/* Tambahkan z-[200] supaya di atas Floating Save Button lo yang z-[101] */}
        <DialogContent className="max-w-xl bg-[#FDF8F3] rounded-[3rem] overflow-hidden border-none p-0 shadow-2xl z-[200]">
          <DialogHeader className="p-8 bg-[#1A4D2E] text-white">
            <DialogTitle className="font-serif italic text-3xl flex items-center gap-4">
              <CropIcon size={28} className="text-[#C5A371]" /> Refine Portrait
            </DialogTitle>
          </DialogHeader>

          <div className="relative h-87.5 md:h-100 w-full bg-black">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          {/* Kasih padding bottom ekstra (pb-32) buat jaga-jaga kalau tombol floating masih ngalangin */}
          <div className="p-8 md:p-10 space-y-8 bg-white pb-32 md:pb-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#A9907E]">
                  Zoom Precision
                </span>
                <span className="font-serif italic text-[#1A4D2E]">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-[#FDF8F3] rounded-lg appearance-none cursor-pointer accent-[#1A4D2E]"
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowCropper(false)}
                className="flex-1 h-16 rounded-2xl text-[#A9907E] font-bold hover:bg-red-50 hover:text-red-500"
              >
                Discard
              </Button>
              <Button
                onClick={handleUploadCroppedImage}
                className="flex-2 h-16 rounded-2xl bg-[#1A4D2E] hover:bg-[#123520] text-white font-serif italic text-2xl shadow-xl transition-all active:scale-95"
              >
                <Check className="mr-3" size={24} /> Set Portrait
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
