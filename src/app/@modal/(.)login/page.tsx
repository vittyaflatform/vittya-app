"use client";

import { useRouter } from "next/navigation";

import AuthOverlayShell from "@/components/auth/AuthOverlayShell";
import LoginForm from "@/components/auth/LoginForm";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function LoginModal() {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent
        className="top-0 left-0 h-screen w-screen max-w-none overflow-visible translate-x-0 translate-y-0 border-none bg-transparent p-0 shadow-none duration-200"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">System Portal Access</DialogTitle>
        <DialogDescription className="sr-only">
          Secure authentication gateway for Vittya internal core.
        </DialogDescription>

        <AuthOverlayShell
          closeSlot={
            <DialogClose asChild>
              <button className="absolute -top-3 -right-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-emerald-600 shadow-xl backdrop-blur-sm transition-colors hover:text-emerald-700">
                <X size={20} />
              </button>
            </DialogClose>
          }
        >
          <LoginForm />
        </AuthOverlayShell>
      </DialogContent>
    </Dialog>
  );
}
