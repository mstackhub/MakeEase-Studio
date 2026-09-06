"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const a = t.aboutPage;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          {a.badge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground leading-[1.6] sm:leading-[1.55]">
          {a.title1} <br />
          <span className="text-brand">{a.title2}</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-2">
          {a.subtitle}
        </p>
      </div>

      {/* Story Narrative */}
      <div className="prose prose-neutral max-w-none text-base sm:text-lg text-muted-foreground leading-relaxed space-y-6">
        <div className="rounded-3xl border border-border bg-surface-secondary/70 p-8 sm:p-10 space-y-4">
          <p className="text-foreground font-medium">
            {a.storyP1}
          </p>
          <p>
            {a.storyP2}
          </p>
          <p>
            {a.storyP3}
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground text-center">
          {a.principlesTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-white shadow-subtle space-y-2">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-brand flex items-center justify-center mb-3">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">{a.p1Title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {a.p1Desc}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-white shadow-subtle space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">{a.p2Title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {a.p2Desc}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-white shadow-subtle space-y-2">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">{a.p3Title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {a.p3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-foreground text-background p-8 sm:p-12 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">{a.ctaTitle}</h3>
        <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
          {a.ctaDesc}
        </p>
        <div className="pt-2">
          <Link href="/contact">
            <Button size="lg" className="bg-white text-foreground hover:bg-gray-100 font-semibold gap-2">
              {a.ctaBtn}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
