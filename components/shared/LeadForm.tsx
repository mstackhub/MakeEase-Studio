"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackLeadSubmit } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface LeadFormProps {
  defaultProduct?: string;
  defaultSource?: string;
  className?: string;
}

export function LeadForm({ defaultProduct = "", defaultSource = "", className }: LeadFormProps) {
  const { lang, t } = useLanguage();
  const f = t.contactPage.form;

  const budgetOptions = [
    { value: "undecided", label: f.budgetUndecided },
    { value: "<10k", label: f.budget1 },
    { value: "10k-30k", label: f.budget2 },
    { value: "30k-60k", label: f.budget3 },
    { value: ">60k", label: f.budget4 },
  ];

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    lineId: "",
    productName: defaultProduct,
    budget: "undecided",
    message: "",
    sourceUrl: defaultSource || (typeof window !== "undefined" ? window.location.pathname : ""),
    honeypot: "", // anti-spam
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = lang === "en" ? "Please enter your name" : "กรุณาระบุชื่อของคุณ";
    }
    if (!formData.email.trim()) {
      errs.email = lang === "en" ? "Please enter your email" : "กรุณาระบุอีเมล";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = lang === "en" ? "Invalid email format" : "รูปแบบอีเมลไม่ถูกต้อง";
    }
    if (!formData.message.trim()) {
      errs.message = lang === "en" ? "Please describe your bottleneck or needs" : "กรุณาระบุปัญหาหรือสิ่งที่คุณต้องการให้ระบบช่วย";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;
    if (formData.honeypot) {
      // bot detected, fake success
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === "en" ? "Submission failed, please try again" : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"));
      }

      setIsSuccess(true);
      trackLeadSubmit(formData.productName, formData.budget);
    } catch (err: any) {
      setServerError(err.message || (lang === "en" ? "An error occurred while submitting" : "เกิดข้อผิดพลาดในการส่งข้อมูล"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 sm:p-10 text-center animate-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{f.successTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          {f.successDesc}
        </p>
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                name: "",
                company: "",
                email: "",
                phone: "",
                lineId: "",
                productName: "",
                budget: "undecided",
                message: "",
                sourceUrl: "",
                honeypot: "",
              });
            }}
          >
            {f.sendAnother}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className="space-y-4">
        {/* Anti-spam hidden field */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {serverError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {f.nameLabel} <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={f.namePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {lang === "en" ? "Company / Brand (Optional)" : "ชื่อธุรกิจ / บริษัท"}
            </label>
            <Input
              placeholder={lang === "en" ? "e.g. Acme Corp (Optional)" : "ชื่อร้าน หรือ บริษัท (ถ้ามี)"}
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {f.emailLabel} <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder={f.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {f.phoneLabel}
            </label>
            <Input
              type="tel"
              placeholder={f.phonePlaceholder}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {f.lineLabel}
            </label>
            <Input
              placeholder={f.linePlaceholder}
              value={formData.lineId}
              onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {f.interestLabel}
            </label>
            <Input
              placeholder={f.interestPlaceholder}
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {f.budgetLabel}
            </label>
            <select
              className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            >
              {budgetOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            {f.messageLabel} <span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder={f.messagePlaceholder}
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            error={errors.message}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full justify-center gap-2 shadow-sm font-semibold text-base mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{f.submittingBtn}</span>
            </>
          ) : (
            <>
              <span>{f.submitBtn}</span>
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
