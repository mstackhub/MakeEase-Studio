"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowUpRight, Mail, Phone, MessageSquare, Lock } from "lucide-react";
import { Setting } from "@/db/schema";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageToggle } from "@/components/shared/LanguageToggle";

interface FooterProps {
  settings?: Setting | null;
}

export function Footer({ settings }: FooterProps) {
  const { t, lang } = useLanguage();
  const siteName = settings?.siteName || "MakeEase Studio";
  const email = settings?.email || "hello@makeease.studio";
  const phone = settings?.phone || "081-234-5678";
  const lineUrl = settings?.lineUrl || "https://line.me";
  const footerText = lang === "en" 
    ? `© ${new Date().getFullYear()} ${siteName}. We build simple tools for real problems. All rights reserved.`
    : `© ${new Date().getFullYear()} ${siteName}. สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง สงวนลิขสิทธิ์ทั้งหมด`;

  return (
    <footer className="border-t border-border bg-surface-secondary text-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold shadow-sm">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">{siteName}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {t.footer.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {email && (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-brand transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{email}</span>
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 hover:text-brand transition-colors">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{phone}</span>
                </a>
              )}
              {lineUrl && (
                <a href={lineUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-brand transition-colors">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{t.footer.line}</span>
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.mainMenu}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-brand transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-brand transition-colors">
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-muted-foreground hover:text-brand transition-colors">
                  {t.nav.demo}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-brand transition-colors">
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-brand transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-brand transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Actions & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.getStarted}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="inline-flex items-center gap-1 text-muted-foreground hover:text-brand transition-colors">
                  <span>{t.footer.consultCustom}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/demo" className="inline-flex items-center gap-1 text-muted-foreground hover:text-brand transition-colors">
                  <span>{t.footer.exploreDemo}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li className="pt-4 border-t border-border/60 flex items-center justify-between">
                <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80 hover:text-foreground transition-colors">
                  <Lock className="h-3.5 w-3.5" />
                  <span>{t.footer.adminLogin}</span>
                </Link>
                <LanguageToggle variant="compact" />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{footerText}</p>
          <div className="flex items-center gap-4">
            <span>MakeEase Studio — Simple Tools for Real Problems</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
