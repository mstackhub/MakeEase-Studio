"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
  variant?: "pill" | "button" | "compact";
}

export function LanguageToggle({ className, variant = "pill" }: LanguageToggleProps) {
  const { lang, setLang, toggleLang } = useLanguage();

  if (variant === "button") {
    return (
      <button
        onClick={toggleLang}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-white text-foreground hover:bg-surface-secondary transition-all shadow-subtle",
          className
        )}
        title={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
        aria-label="Toggle language"
      >
        <Globe className="h-3.5 w-3.5 text-brand" />
        <span>{lang === "th" ? "TH / EN" : "EN / TH"}</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface-secondary p-0.5 text-xs font-semibold shadow-inner shrink-0",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLang("th")}
        className={cn(
          "w-8 py-1 rounded-full text-center transition-all duration-200",
          lang === "th"
            ? "bg-white text-brand shadow-sm font-bold"
            : "text-muted-foreground hover:text-foreground font-medium"
        )}
        aria-label="ภาษาไทย"
      >
        TH
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "w-8 py-1 rounded-full text-center transition-all duration-200",
          lang === "en"
            ? "bg-white text-brand shadow-sm font-bold"
            : "text-muted-foreground hover:text-foreground font-medium"
        )}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
