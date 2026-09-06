"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Zap, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ServicesPage() {
  const { lang, t } = useLanguage();
  const s = t.servicesPage;

  const customExamples = lang === "en" ? [
    { title: "Custom Web Application", desc: "Tailored business apps with multi-tier role permissions" },
    { title: "Internal Operations Tools", desc: "Backoffice consoles to coordinate data across teams" },
    { title: "Workflow Automation", desc: "Auto-sync across databases, forms, and chat bots" },
    { title: "E-Commerce Enhancements", desc: "Custom order parsers, catalog taggers, and shipping tools" },
    { title: "Analytics Dashboards", desc: "Clean KPI visualizers and daily executive summaries" },
    { title: "Google Sheets Sync", desc: "Turn messy spreadsheets into structured web apps" },
  ] : [
    { title: "Web Application", desc: "เว็บแอปเฉพาะทางสำหรับธุรกิจ รองรับผู้ใช้งานหลายระดับ" },
    { title: "Internal Tools", desc: "เครื่องมือหลังบ้านช่วยประสานงาน จัดการข้อมูลในทีม" },
    { title: "Workflow Automation", desc: "เชื่อมต่อการทำงานข้ามระบบอัตโนมัติ ลดงานกรอกซ้ำ" },
    { title: "Shopify & E-Commerce Tools", desc: "ส่วนเสริมจัดการสินค้า ออเดอร์ และแท็กสินค้า" },
    { title: "Dashboard & Analytics", desc: "หน้าจอรวบรวมและสรุปข้อมูลสถิติที่เข้าใจง่าย" },
    { title: "Google Sheets Automation", desc: "ดึงข้อมูลจากตารางมาต่อยอดเป็นระบบค้นหาหรือรายงาน" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          {s.badge}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
          {s.title}
        </h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          {s.subtitle}
        </p>
      </div>

      {/* 2 Main Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SERVICE 1: READY-TO-USE */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-white p-8 sm:p-10 shadow-subtle hover:border-brand/30 transition-card">
          <div className="space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {s.model1Badge}
              </span>
              <h2 className="text-2xl font-bold text-foreground mt-1">
                {s.model1Title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.model1Subtitle}
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase text-foreground">
                {lang === "en" ? "Key Benefits" : "ข้อดีของระบบพร้อมใช้"}
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">{s.model1Feature1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">{s.model1Feature2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">{s.model1Feature3}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">{s.model1Feature4}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-border">
            <Link href="/products">
              <Button size="lg" className="w-full justify-center gap-2 font-semibold">
                {s.model1Cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* SERVICE 2: CUSTOM SOLUTION */}
        <div className="flex flex-col justify-between rounded-3xl border border-brand/30 bg-gradient-to-br from-brand-light/30 via-white to-surface-secondary p-8 sm:p-10 shadow-subtle">
          <div className="space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                {s.model2Badge}
              </span>
              <h2 className="text-2xl font-bold text-foreground mt-1">
                {s.model2Title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.model2Subtitle}
              </p>
            </div>

            {/* Custom Examples */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase text-foreground">
                {lang === "en" ? "Examples of What We Can Build" : "ตัวอย่างระบบที่สามารถพัฒนาได้"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {customExamples.map((ex, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-border/80">
                    <p className="font-bold text-foreground">{ex.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{ex.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-border">
            <Link href="/contact">
              <Button size="lg" className="w-full justify-center gap-2 font-semibold shadow-sm">
                {s.model2Cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
