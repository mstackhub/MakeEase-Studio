"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Zap,
  ShoppingBag,
  Briefcase,
  Smile,
  Layers,
  CheckSquare,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FullProduct } from "@/lib/db-queries";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getLocalizedProduct, localizedCategoryNames } from "@/lib/i18n/translations";

interface HomeClientProps {
  featuredProducts: FullProduct[];
  categories: any[];
  demoProducts: FullProduct[];
}

export function HomeClient({
  featuredProducts,
  categories,
  demoProducts,
}: HomeClientProps) {
  const { lang, t } = useLanguage();

  const getCategoryIcon = (iconName?: string | null) => {
    switch (iconName) {
      case "ShoppingBag":
        return <ShoppingBag className="h-6 w-6 text-brand" />;
      case "Briefcase":
        return <Briefcase className="h-6 w-6 text-brand" />;
      case "Zap":
        return <Zap className="h-6 w-6 text-brand" />;
      case "Smile":
        return <Smile className="h-6 w-6 text-brand" />;
      case "Layers":
        return <Layers className="h-6 w-6 text-brand" />;
      default:
        return <CheckSquare className="h-6 w-6 text-brand" />;
    }
  };

  return (
    <div className="flex flex-col space-y-20 sm:space-y-28 pb-20">
      {/* SECTION 1 — HERO */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 overflow-hidden bg-gradient-to-b from-surface-secondary/80 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-subtle">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span>{t.home.heroBadge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.6] sm:leading-[1.5] lg:leading-[1.45]">
              {t.home.heroTitle1} <br className="hidden sm:inline" />
              <span className="text-brand">{t.home.heroTitle2}</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {t.home.heroSubtitle}
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto min-w-[175px] justify-center gap-2 shadow-sm font-semibold whitespace-nowrap">
                  {t.home.heroCtaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[175px] justify-center gap-2 font-medium whitespace-nowrap">
                  <Play className="h-4 w-4 fill-current text-brand" />
                  {t.home.heroCtaSecondary}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Mockup Preview */}
          <div className="mt-12 sm:mt-16 mx-auto max-w-5xl rounded-2xl border border-border bg-white p-2 sm:p-3 shadow-hover">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-secondary border border-border">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop"
                alt="Product Dashboard Mockup"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider bg-brand px-2.5 py-1 rounded-md">
                    {lang === "en" ? "Live Product Suite" : "Featured Web Apps"}
                  </span>
                  <p className="text-sm sm:text-base font-medium drop-shadow-sm">
                    {lang === "en"
                      ? "Real-world tools built specifically to solve operational bottlenecks"
                      : "เครื่องมือใช้งานจริง ออกแบบจากปัญหาหน้างานโดยเฉพาะ"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — CORE IDEA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-surface-secondary/70 p-8 sm:p-12 lg:p-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              {t.home.painPointsBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              {t.home.painPointsTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t.home.painPointsSubtitle}
            </p>
          </div>

          {/* Simple Diagram Flow */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-border shadow-subtle">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
                <HelpCircle className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">01</span>
              <h3 className="text-lg font-bold text-foreground mt-1">{t.home.painItem1Title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t.home.painItem1Desc}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-border shadow-subtle relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-brand mb-4">
                <Lightbulb className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">02</span>
              <h3 className="text-lg font-bold text-foreground mt-1">{t.home.painItem2Title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t.home.painItem2Desc}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-border shadow-subtle">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">03</span>
              <h3 className="text-lg font-bold text-foreground mt-1">{t.home.painItem3Title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t.home.painItem3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              {t.home.featuredBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
              {t.home.featuredTitle}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
              {t.home.featuredSubtitle}
            </p>
          </div>
          <Link href="/products" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" className="gap-1.5">
              {t.home.allProductsBtn}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <Button variant="outline" className="w-full justify-center gap-2">
              {t.home.allProductsBtn}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* SECTION 4 — BROWSE BY CATEGORY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.home.categoriesBadge}
          title={t.home.categoriesTitle}
          description={t.home.categoriesSubtitle}
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const catName = localizedCategoryNames[cat.slug]?.[lang] || cat.name;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col p-6 rounded-2xl border border-border bg-white hover:border-brand/40 hover:bg-surface-secondary/40 transition-all shadow-subtle"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h3 className="text-base font-bold text-foreground group-hover:text-brand transition-colors">
                  {catName}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 5 — DEMO SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-surface-secondary border border-border p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              {t.home.demoBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              {t.home.demoTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t.home.demoSubtitle}
            </p>
            <div className="pt-2">
              <Link href="/demo">
                <Button size="lg" className="gap-2 shadow-sm font-semibold">
                  <Play className="h-4 w-4 fill-current" />
                  {t.home.goToDemoCenter}
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Demo Preview cards */}
          <div className="w-full lg:w-96 space-y-3">
            {demoProducts.slice(0, 2).map((item) => {
              const localizedItem = getLocalizedProduct(item, lang);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-border shadow-subtle"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-secondary">
                    <Image src={item.coverImage} alt={localizedItem.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate">{localizedItem.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{localizedItem.shortDescription}</p>
                  </div>
                  <Link href={`/products/${item.slug}#demo`}>
                    <Button variant="secondary" size="sm" className="text-xs shrink-0">
                      {lang === "en" ? "Try Demo" : "ลองเลย"}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6 — CUSTOM SOLUTION SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-brand/20 bg-gradient-to-br from-brand-light/50 via-white to-surface-secondary p-8 sm:p-12 lg:p-16 text-center max-w-4xl mx-auto shadow-subtle">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white mb-4 shadow-sm">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {t.home.customBannerTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.home.customBannerDesc}
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/contact">
              <Button size="lg" className="gap-2 shadow-sm font-semibold text-base px-8">
                {t.home.customBannerCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7 — WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.home.whyUsBadge}
          title={t.home.whyUsTitle}
          description={t.home.whyUsSubtitle}
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col p-6 sm:p-8 rounded-2xl border border-border bg-white shadow-subtle space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-brand flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t.home.whyItem1Title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t.home.whyItem1Desc}
            </p>
          </div>

          <div className="flex flex-col p-6 sm:p-8 rounded-2xl border border-border bg-white shadow-subtle space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smile className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t.home.whyItem2Title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t.home.whyItem2Desc}
            </p>
          </div>

          <div className="flex flex-col p-6 sm:p-8 rounded-2xl border border-border bg-white shadow-subtle space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckSquare className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t.home.whyItem3Title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t.home.whyItem3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-foreground text-background p-8 sm:p-14 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.home.ctaTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            {t.home.ctaSubtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto min-w-[175px] justify-center bg-white text-foreground hover:bg-gray-100 font-semibold whitespace-nowrap">
                {t.home.ctaPrimary}
              </Button>
            </Link>
            <Link href="/products" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[175px] justify-center bg-transparent border border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 font-medium shadow-none whitespace-nowrap"
              >
                {t.home.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
