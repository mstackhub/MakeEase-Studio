"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Copy, Check, ExternalLink, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FullProduct } from "@/lib/db-queries";
import { Category } from "@/db/schema";
import { trackDemoClick } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { localizedCategoryNames, getLocalizedProduct } from "@/lib/i18n/translations";

interface DemoClientProps {
  demoProducts: FullProduct[];
  categories: Category[];
}

export function DemoClient({ demoProducts, categories }: DemoClientProps) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = demoProducts.filter((p) => {
    if (selectedCategory === "all") return true;
    return p.categories.some((c) => c.slug === selectedCategory);
  });

  const copyCredential = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          {t.demoPage.badge}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
          {t.demoPage.title}
        </h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          {t.demoPage.subtitle}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-brand text-white shadow-xs"
              : "bg-surface-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {t.demoPage.allCategory} ({demoProducts.length})
        </button>
        {categories.map((cat) => {
          const catName = localizedCategoryNames[cat.slug]?.[lang] || cat.name;
          const count = demoProducts.filter((p) =>
            p.categories.some((c) => c.slug === cat.slug)
          ).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-brand text-white shadow-xs"
                  : "bg-surface-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {catName} ({count})
            </button>
          );
        })}
      </div>

      {/* Demo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filtered.map((rawProduct) => {
          const product = getLocalizedProduct(rawProduct, lang);
          const categoryRaw = rawProduct.categories[0];
          const categoryName = categoryRaw ? (localizedCategoryNames[categoryRaw.slug]?.[lang] || categoryRaw.name) : "Web App";

          return (
            <div
              key={product.id}
              className="flex flex-col rounded-2xl border border-border bg-white overflow-hidden shadow-subtle hover:border-brand/30 transition-card"
            >
              {/* Cover Screenshot */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-secondary">
                <Image
                  src={product.coverImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold bg-white/95 text-foreground px-2.5 py-1 rounded-md shadow-xs">
                    {categoryName}
                  </span>
                  <span className="text-[11px] font-semibold bg-brand text-white px-2.5 py-1 rounded-md shadow-xs">
                    {product.demoType === "account" ? "Demo Account" : "Direct Demo"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Account Credentials if account type */}
                {product.demoType === "account" && (product.demoUsername || product.demoPassword) && (
                  <div className="p-3 rounded-xl bg-surface-secondary border border-border text-xs space-y-1.5">
                    {product.demoUsername && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{lang === "en" ? "User:" : "User:"} <code className="font-mono text-foreground font-semibold">{product.demoUsername}</code></span>
                        <button
                          onClick={() => copyCredential(product.demoUsername || "", `user-${product.id}`)}
                          className="text-[10px] text-brand hover:underline flex items-center gap-0.5"
                        >
                          {copiedId === `user-${product.id}` ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedId === `user-${product.id}` ? t.productDetail.copiedBtn : t.productDetail.copyBtn}</span>
                        </button>
                      </div>
                    )}
                    {product.demoPassword && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{lang === "en" ? "Pass:" : "Pass:"} <code className="font-mono text-foreground font-semibold">{product.demoPassword}</code></span>
                        <button
                          onClick={() => copyCredential(product.demoPassword || "", `pass-${product.id}`)}
                          className="text-[10px] text-brand hover:underline flex items-center gap-0.5"
                        >
                          {copiedId === `pass-${product.id}` ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedId === `pass-${product.id}` ? t.productDetail.copiedBtn : t.productDetail.copyBtn}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 mt-auto grid grid-cols-2 gap-2">
                  {product.demoUrl ? (
                    <a
                      href={product.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackDemoClick(product.id, product.name, product.demoUrl)}
                    >
                      <Button size="sm" className="w-full gap-1 text-xs">
                        <Play className="h-3 w-3 fill-current" />
                        {t.productsPage.testDemo}
                      </Button>
                    </a>
                  ) : (
                    <Link href={`/products/${product.slug}#demo`}>
                      <Button size="sm" className="w-full text-xs">
                        {t.productsPage.testDemo}
                      </Button>
                    </Link>
                  )}

                  <Link href={`/products/${product.slug}`}>
                    <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                      {lang === "en" ? "Features" : "ดูฟีเจอร์"}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Demo Disclaimer */}
      <div className="rounded-2xl border border-border bg-surface-secondary/70 p-4 sm:p-5 flex items-start gap-3 text-xs text-muted-foreground">
        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground">
            {lang === "en" ? "Demo Testing Notice & Sandbox Policy" : "คำแนะนำสำหรับการทดลองใช้งาน Demo"}
          </p>
          <p>
            {lang === "en"
              ? "This is an interactive sandbox environment. Any sample data you create or modify may be automatically reset on a scheduled interval."
              : "Demo เป็นระบบทดลองใช้งานจริง ข้อมูลที่คุณเพิ่ม แก้ไข หรือลบ อาจถูกระบบรีเซ็ตอัตโนมัติเป็นระยะเพื่อความสะอาดของข้อมูล"}
          </p>
        </div>
      </div>
    </div>
  );
}
