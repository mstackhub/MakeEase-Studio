"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string | null;
  caption?: string | null;
}

export function ScreenshotModal({
  isOpen,
  onClose,
  imageUrl,
  altText,
  caption,
}: ScreenshotModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center gap-1.5 text-white/80 hover:text-white bg-black/40 px-3 py-1.5 rounded-full text-xs transition-colors"
        >
          <X className="h-4 w-4" />
          <span>ปิด (ESC)</span>
        </button>

        <div className="relative w-full aspect-[16/10] max-h-[75vh] overflow-hidden rounded-xl bg-black/50 border border-white/10 shadow-2xl">
          <Image
            src={imageUrl}
            alt={altText || "Screenshot"}
            fill
            className="object-contain"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>

        {caption && (
          <p className="mt-3 text-center text-sm text-white/90 bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
