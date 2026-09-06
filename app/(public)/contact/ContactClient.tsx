"use client";

import React from "react";
import { Mail, Phone, MessageSquare, Clock, ShieldCheck } from "lucide-react";
import { LeadForm } from "@/components/shared/LeadForm";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ContactClientProps {
  settings: {
    email?: string | null;
    phone?: string | null;
    lineUrl?: string | null;
  };
  defaultProduct?: string;
  defaultSource?: string;
}

export function ContactClient({
  settings,
  defaultProduct = "",
  defaultSource = "",
}: ContactClientProps) {
  const { lang, t } = useLanguage();
  const c = t.contactPage;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          {c.badge}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
          {c.title}
        </h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          {c.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-8 rounded-3xl border border-border bg-white p-6 sm:p-10 shadow-subtle">
          <div className="mb-6 pb-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">
              {c.formTitle}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {c.formSubtitle}
            </p>
          </div>

          <LeadForm
            defaultProduct={defaultProduct}
            defaultSource={defaultSource}
          />
        </div>

        {/* Contact Information & Response Note */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-border bg-surface-secondary p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-foreground">
              {c.directContactTitle}
            </h3>

            <div className="space-y-4 text-sm">
              {settings.email && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-brand shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block">
                      {lang === "en" ? "Email" : "อีเมล"}
                    </span>
                    <a href={`mailto:${settings.email}`} className="text-foreground font-medium hover:text-brand transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              {settings.phone && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-brand shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block">
                      {lang === "en" ? "Phone" : "โทรศัพท์"}
                    </span>
                    <a href={`tel:${settings.phone}`} className="text-foreground font-medium hover:text-brand transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}

              {settings.lineUrl && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-brand shrink-0">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block">LINE Official</span>
                    <a href={settings.lineUrl} target="_blank" rel="noreferrer" className="text-foreground font-medium hover:text-brand transition-colors">
                      {lang === "en" ? "Chat on LINE Official" : "เพิ่มเพื่อนคุยกับเรา"}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border/80 flex items-start gap-2.5 text-xs text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0 text-brand mt-0.5" />
              <span>{c.responseTimeNote}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-brand/20 bg-brand-light/30 p-5 space-y-2">
            <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>{c.confidentialityTitle}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {c.confidentialityDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
