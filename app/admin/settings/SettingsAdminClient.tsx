"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2, AlertCircle, Loader2, Palette, Globe, Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Setting } from "@/db/schema";

interface SettingsAdminClientProps {
  initialSettings: Setting;
}

const PRESET_COLORS = [
  { name: "Ocean Blue", primary: "#2563EB", hover: "#1D4ED8", light: "#EFF6FF" },
  { name: "Emerald Forest", primary: "#059669", hover: "#047857", light: "#ECFDF5" },
  { name: "Violet Modern", primary: "#7C3AED", hover: "#6D28D9", light: "#F5F3FF" },
  { name: "Indigo SaaS", primary: "#4F46E5", hover: "#4338CA", light: "#EEF2FF" },
  { name: "Amber Warm", primary: "#D97706", hover: "#B45309", light: "#FFFBEB" },
  { name: "Slate Minimal", primary: "#1E293B", hover: "#0F172A", light: "#F8FAFC" },
];

export function SettingsAdminClient({ initialSettings }: SettingsAdminClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    siteName: initialSettings.siteName || "MakeEase Studio",
    siteDescription: initialSettings.siteDescription || "",
    brandColor: initialSettings.brandColor || "#2563EB",
    brandHoverColor: initialSettings.brandHoverColor || "#1D4ED8",
    brandLightColor: initialSettings.brandLightColor || "#EFF6FF",
    email: initialSettings.email || "hello@makeease.studio",
    phone: initialSettings.phone || "081-234-5678",
    lineUrl: initialSettings.lineUrl || "https://line.me",
    facebookUrl: initialSettings.facebookUrl || "",
    instagramUrl: initialSettings.instagramUrl || "",
    footerText: initialSettings.footerText || "",
    gaId: initialSettings.gaId || "",
    defaultSeoTitle: initialSettings.defaultSeoTitle || "",
    defaultSeoDescription: initialSettings.defaultSeoDescription || "",
    defaultOgImage: initialSettings.defaultOgImage || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const applyPreset = (preset: typeof PRESET_COLORS[0]) => {
    setFormData((prev) => ({
      ...prev,
      brandColor: preset.primary,
      brandHoverColor: preset.hover,
      brandLightColor: preset.light,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึกการตั้งค่า");

      setMessage("บันทึกการตั้งค่าเว็บไซต์เรียบร้อยแล้ว");
      setTimeout(() => setMessage(""), 3000);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "บันทึกไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Brand Color Settings (Section 6 & 51) */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-brand flex items-center justify-center">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Brand Color System (CSS Variables)</h2>
            <p className="text-xs text-muted-foreground">ปรับเปลี่ยนโทนสีหลักของแบรนด์ได้ทันทีโดยไม่ต้องแก้โค้ด</p>
          </div>
        </div>

        {/* Color Presets */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-2">
            เลือก Color Presets ยอดนิยม
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="flex items-center gap-2 p-2 rounded-xl border border-border bg-white hover:border-brand/40 text-left transition-all"
              >
                <span className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: preset.primary }} />
                <span className="text-[11px] font-medium text-foreground truncate">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.brandColor}
                onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                className="h-10 w-12 rounded-lg border border-border p-1 bg-white cursor-pointer"
              />
              <Input
                value={formData.brandColor}
                onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Hover Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.brandHoverColor}
                onChange={(e) => setFormData({ ...formData, brandHoverColor: e.target.value })}
                className="h-10 w-12 rounded-lg border border-border p-1 bg-white cursor-pointer"
              />
              <Input
                value={formData.brandHoverColor}
                onChange={(e) => setFormData({ ...formData, brandHoverColor: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Light Tint Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.brandLightColor}
                onChange={(e) => setFormData({ ...formData, brandLightColor: e.target.value })}
                className="h-10 w-12 rounded-lg border border-border p-1 bg-white cursor-pointer"
              />
              <Input
                value={formData.brandLightColor}
                onChange={(e) => setFormData({ ...formData, brandLightColor: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* General Site Identity */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">ข้อมูลทั่วไปและแบรนด์</h2>
            <p className="text-xs text-muted-foreground">ชื่อเว็บไซต์ คำอธิบาย และ Footer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              ชื่อเว็บไซต์ (Site Name) *
            </label>
            <Input
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Google Analytics ID (GA4)
            </label>
            <Input
              placeholder="G-XXXXXXXXXX"
              value={formData.gaId}
              onChange={(e) => setFormData({ ...formData, gaId: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            คำอธิบายเว็บไซต์ (Site Description)
          </label>
          <Textarea
            rows={2}
            value={formData.siteDescription}
            onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            ข้อความท้ายหน้า (Footer Text)
          </label>
          <Input
            value={formData.footerText}
            onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
          />
        </div>
      </div>

      {/* Contact Channels */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">ช่องทางการติดต่อ</h2>
            <p className="text-xs text-muted-foreground">ข้อมูลติดต่อที่จะแสดงใน Footer และหน้า Contact</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              อีเมลติดต่อ (Email)
            </label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              เบอร์โทรศัพท์ (Phone)
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              LINE Official URL
            </label>
            <Input
              placeholder="https://line.me/ti/p/~example"
              value={formData.lineUrl}
              onChange={(e) => setFormData({ ...formData, lineUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Facebook URL
            </label>
            <Input
              placeholder="https://facebook.com/example"
              value={formData.facebookUrl}
              onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Default SEO */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
        <div>
          <h2 className="text-base font-bold text-foreground">ค่าเริ่มต้นสำหรับ SEO & Open Graph</h2>
          <p className="text-xs text-muted-foreground">ใช้เมื่อหน้านั้นๆ ไม่ได้กำหนด Meta Title / Description เฉพาะ</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Default SEO Title
          </label>
          <Input
            value={formData.defaultSeoTitle}
            onChange={(e) => setFormData({ ...formData, defaultSeoTitle: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Default SEO Description
          </label>
          <Textarea
            rows={2}
            value={formData.defaultSeoDescription}
            onChange={(e) => setFormData({ ...formData, defaultSeoDescription: e.target.value })}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button size="lg" type="submit" disabled={isSubmitting} className="gap-2 shadow-sm font-semibold">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>กำลังบันทึก...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>บันทึกการตั้งค่าทั้งหมด</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
