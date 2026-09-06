"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PricingDisplayProps {
  pricingType?: "free" | "fixed" | "starting" | "subscription" | "custom" | "contact" | null | string;
  price?: number | null;
  originalPrice?: number | null;
  currency?: string | null;
  billingPeriod?: "month" | "year" | "one_time" | null | string;
  pricingNote?: string | null;
  isOnSale?: boolean | null;
  size?: "sm" | "md" | "lg";
  showNote?: boolean;
}

export function PricingDisplay({
  pricingType = "fixed",
  price,
  originalPrice,
  currency = "THB",
  billingPeriod = "one_time",
  pricingNote,
  isOnSale,
  size = "md",
  showNote = true,
}: PricingDisplayProps) {
  const { lang, t } = useLanguage();
  const type = pricingType || "fixed";
  const curr = currency || "THB";
  const sym = curr === "THB" ? "฿" : curr;

  const isFree = type === "free" || price === 0;
  const isCustom = type === "custom";
  const isContact = type === "contact";

  if (isFree) {
    return (
      <div className="flex flex-col">
        <span className={size === "lg" ? "text-2xl font-bold text-emerald-600" : "text-base font-bold text-emerald-600"}>
          {lang === "en" ? "Free" : "ฟรี"}
        </span>
        {showNote && pricingNote && <span className="text-xs text-muted-foreground mt-0.5">{pricingNote}</span>}
      </div>
    );
  }

  if (isCustom) {
    return (
      <div className="flex flex-col">
        <span className={size === "lg" ? "text-xl font-bold text-foreground" : "text-sm font-semibold text-foreground"}>
          {lang === "en" ? "Custom Quote" : "ประเมินราคาตามความต้องการ"}
        </span>
        {showNote && <span className="text-xs text-muted-foreground mt-0.5">{pricingNote || (lang === "en" ? "Based on required scope" : "ปรับตามฟังก์ชันที่เลือก")}</span>}
      </div>
    );
  }

  if (isContact) {
    return (
      <div className="flex flex-col">
        <span className={size === "lg" ? "text-xl font-bold text-foreground" : "text-sm font-semibold text-foreground"}>
          {lang === "en" ? "Contact for Pricing" : "สอบถามราคา"}
        </span>
        {showNote && pricingNote && <span className="text-xs text-muted-foreground mt-0.5">{pricingNote}</span>}
      </div>
    );
  }

  const locale = lang === "en" ? "en-US" : "th-TH";
  const formattedPrice = new Intl.NumberFormat(locale).format(price || 0);
  const formattedOriginalPrice = originalPrice ? new Intl.NumberFormat(locale).format(originalPrice) : null;

  const periodLabel =
    type === "subscription"
      ? billingPeriod === "year"
        ? (lang === "en" ? "/ year" : "/ ปี")
        : (lang === "en" ? "/ month" : "/ เดือน")
      : billingPeriod === "one_time"
      ? (lang === "en" ? "one-time" : "ชำระครั้งเดียว")
      : "";

  return (
    <div className="flex flex-col">
      {/* Sale Price Comparison */}
      {isOnSale && formattedOriginalPrice && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground line-through">
          <span>{sym}{formattedOriginalPrice}</span>
          <span className="text-[10px] font-semibold text-red-600 uppercase bg-red-50 px-1.5 py-0.5 rounded">
            {lang === "en" ? "Special Sale" : "ลดพิเศษ"}
          </span>
        </div>
      )}

      {/* Main Price */}
      <div className="flex items-baseline gap-1.5 flex-wrap">
        {type === "starting" && (
          <span className="text-xs text-muted-foreground font-normal">{lang === "en" ? "From" : "เริ่มต้น"}</span>
        )}
        <span
          className={
            size === "lg"
              ? "text-3xl font-extrabold tracking-tight text-foreground"
              : size === "sm"
              ? "text-sm font-bold text-foreground"
              : "text-lg font-bold text-foreground"
          }
        >
          {sym}{formattedPrice}
        </span>
        {periodLabel && (
          <span className="text-xs text-muted-foreground font-medium">{periodLabel}</span>
        )}
      </div>

      {/* Note or starting price disclaimer */}
      {showNote && (
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
          {pricingNote || (type === "starting" ? (lang === "en" ? "Final price depends on customized scope" : "ราคาสุดท้ายขึ้นอยู่กับฟีเจอร์และการปรับแต่งเพิ่มเติม") : "")}
        </p>
      )}
    </div>
  );
}
