"use client";

import { useState } from "react";
import Image from "next/image";
import { MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ⚠️ INI YANG PENTING: Tambahkan onOpen di sini
interface OpeningModalProps {
  groomName: string;
  brideName: string;
  coverImage?: string;
  guestName?: string;
  theme?: "luxury" | "minimalist";
  onOpen?: () => void; // <--- WAJIB ADA
}

export default function OpeningModal({
  groomName,
  brideName,
  coverImage,
  guestName,
  theme = "luxury",
  onOpen, // <--- Ambil props ini
}: OpeningModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = () => {
    setIsOpen(false);
    if (onOpen) onOpen(); // Panggil fungsi parent
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-9999 flex flex-col items-center justify-center text-center p-6 transition-transform duration-1000 bg-white",
        theme === "luxury" ? "bg-[#FDFBF7]" : "bg-white",
      )}
    >
      {/* Konten Sampul ... */}
      <div className="relative z-10 max-w-md w-full space-y-8">
        <h1 className="text-4xl font-bold">
          {groomName} & {brideName}
        </h1>
        <Button onClick={handleOpen} size="lg" className="rounded-full">
          <MailOpen size={18} className="mr-2" /> Buka Undangan
        </Button>
      </div>
    </div>
  );
}
