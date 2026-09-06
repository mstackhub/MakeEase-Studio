import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | null | undefined,
  currency: string = "THB",
  pricingType: string = "fixed",
  billingPeriod?: string | null
): string {
  if (pricingType === "free" || price === 0) {
    return "ฟรี";
  }
  if (pricingType === "custom") {
    return "ประเมินราคาตามความต้องการ";
  }
  if (pricingType === "contact") {
    return "สอบถามราคา";
  }

  const formattedNumber = new Intl.NumberFormat("th-TH").format(price || 0);
  const symbol = currency === "THB" ? "฿" : currency;

  if (pricingType === "starting") {
    return `เริ่มต้น ${symbol}${formattedNumber}`;
  }

  if (pricingType === "subscription") {
    const periodText = billingPeriod === "year" ? "/ ปี" : "/ เดือน";
    return `${symbol}${formattedNumber} ${periodText}`;
  }

  return `${symbol}${formattedNumber}`;
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (e) {
    return dateString;
  }
}
