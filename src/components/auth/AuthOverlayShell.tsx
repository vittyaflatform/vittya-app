"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import HomePage from "@/app/page";

type Point = {
  x: number;
  y: number;
};

type AuthOverlayShellProps = {
  children: React.ReactNode;
  showHomeBackground?: boolean;
  closeHref?: string;
  closeSlot?: React.ReactNode;
};

export default function AuthOverlayShell({
  children,
  showHomeBackground = false,
  closeHref,
  closeSlot,
}: AuthOverlayShellProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const dragState = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  const clampOffset = (next: Point) => {
    if (typeof window === "undefined" || !cardRef.current) {
      return next;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const maxX = Math.max(0, window.innerWidth / 2 - rect.width / 2 - 16);
    const maxY = Math.max(0, window.innerHeight / 2 - rect.height / 2 - 16);

    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  };

  useEffect(() => {
    const handleResize = () => {
      setOffset((current) => clampOffset(current));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: offset.x,
      baseY: offset.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;

    const deltaX = event.clientX - dragState.current.startX;
    const deltaY = event.clientY - dragState.current.startY;

    setOffset(
      clampOffset({
        x: dragState.current.baseX + deltaX,
        y: dragState.current.baseY + deltaY,
      }),
    );
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  return (
    <div className="relative h-screen w-screen overflow-visible">
      {showHomeBackground && (
        <>
          <div className="pointer-events-none relative z-0 select-none">
            <HomePage />
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 bg-white/8 backdrop-blur-md" />
        </>
      )}

      <div className="absolute inset-0 z-20 h-screen w-screen overflow-visible">
        <div
          ref={cardRef}
          className="absolute top-1/2 left-1/2 w-[min(640px,calc(100vw-2rem))]"
          style={{
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          {closeSlot ??
            (closeHref ? (
              <Link
                href={closeHref}
                className="absolute -top-3 -right-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-emerald-600 shadow-xl backdrop-blur-sm transition-colors hover:text-emerald-700"
              >
                <X size={20} />
              </Link>
            ) : null)}

          <div
            className="absolute inset-x-14 top-3 z-10 h-9 cursor-grab rounded-full active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          <div className="relative z-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
