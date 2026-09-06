"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Copy,
  Check,
  ExternalLink,
  Info,
  Maximize2,
  ArrowRight,
  ShieldAlert,
  MessageSquare,
  QrCode,
  Layers,
  Image as ImageIcon,
  ToggleRight,
  Smartphone,
  FileText,
  Calculator,
  Users,
  CheckCircle,
  Workflow,
  RefreshCw,
  LayoutGrid,
  Search,
  Shield,
  Database,
  ShieldCheck,
  AlertTriangle,
  Bell,
  Inbox,
  UserCheck,
  Clock,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingDisplay } from "@/components/shared/PricingDisplay";
import { ScreenshotModal } from "@/components/shared/ScreenshotModal";
import { FullProduct } from "@/lib/db-queries";
import { trackDemoClick, trackContactClick } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getLocalizedProduct, localizedCategoryNames } from "@/lib/i18n/translations";

interface ProductDetailClientProps {
  product: FullProduct;
}

// Dynamic Icon Lookup
function getFeatureIcon(iconName?: string | null) {
  switch (iconName) {
    case "QrCode":
      return <QrCode className="h-5 w-5 text-brand" />;
    case "Layers":
      return <Layers className="h-5 w-5 text-brand" />;
    case "Image":
      return <ImageIcon className="h-5 w-5 text-brand" />;
    case "ToggleRight":
      return <ToggleRight className="h-5 w-5 text-brand" />;
    case "Smartphone":
      return <Smartphone className="h-5 w-5 text-brand" />;
    case "FileText":
      return <FileText className="h-5 w-5 text-brand" />;
    case "Calculator":
      return <Calculator className="h-5 w-5 text-brand" />;
    case "Users":
      return <Users className="h-5 w-5 text-brand" />;
    case "CheckCircle":
      return <CheckCircle className="h-5 w-5 text-brand" />;
    case "Sparkles":
    case "Zap":
      return <Zap className="h-5 w-5 text-brand" />;
    case "Workflow":
      return <Workflow className="h-5 w-5 text-brand" />;
    case "RefreshCw":
      return <RefreshCw className="h-5 w-5 text-brand" />;
    case "LayoutGrid":
      return <LayoutGrid className="h-5 w-5 text-brand" />;
    case "Search":
      return <Search className="h-5 w-5 text-brand" />;
    case "Shield":
      return <Shield className="h-5 w-5 text-brand" />;
    case "Database":
      return <Database className="h-5 w-5 text-brand" />;
    case "ShieldCheck":
      return <ShieldCheck className="h-5 w-5 text-brand" />;
    case "AlertTriangle":
      return <AlertTriangle className="h-5 w-5 text-brand" />;
    case "Bell":
      return <Bell className="h-5 w-5 text-brand" />;
    case "Inbox":
      return <Inbox className="h-5 w-5 text-brand" />;
    case "UserCheck":
      return <UserCheck className="h-5 w-5 text-brand" />;
    case "Clock":
      return <Clock className="h-5 w-5 text-brand" />;
    default:
      return <CheckCircle2 className="h-5 w-5 text-brand" />;
  }
}

export function ProductDetailClient({ product: rawProduct }: ProductDetailClientProps) {
  const { lang, t } = useLanguage();
  const product = getLocalizedProduct(rawProduct, lang);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt?: string | null; caption?: string | null } | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDemoClick = () => {
    trackDemoClick(product.id, product.name, product.demoUrl);
  };

  const handleInterestClick = () => {
    trackContactClick("product_detail_hero", product.id, product.name);
  };

  const categoryRaw = rawProduct.categories[0];
  const categoryName = categoryRaw ? (localizedCategoryNames[categoryRaw.slug]?.[lang] || categoryRaw.name) : "Web App";

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* SECTION 19: PRODUCT HERO */}
      <section className="relative pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Details & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Breadcrumb & Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/products" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
                {t.nav.products}
              </Link>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs font-semibold text-brand">{categoryName}</span>
              <div className="flex flex-wrap gap-1.5 ml-auto sm:ml-2">
                {product.badges.map((badge: string, idx: number) => (
                  <Badge key={idx} badgeName={badge}>
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Product Title & Short Description */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-[1.45] sm:leading-[1.4]">
              {product.name}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Price Box */}
            <div className="rounded-2xl border border-border bg-surface-secondary/70 p-5">
              <PricingDisplay
                pricingType={product.pricingType}
                price={product.price}
                originalPrice={product.originalPrice}
                currency={product.currency}
                billingPeriod={product.billingPeriod}
                pricingNote={product.pricingNote}
                isOnSale={product.isOnSale}
                size="lg"
              />
            </div>

            {/* Hero CTA Group */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {product.demoEnabled && (
                <a
                  href="#demo"
                  className="w-full sm:w-auto"
                  onClick={handleDemoClick}
                >
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-sm font-semibold">
                    <Play className="h-4 w-4 fill-current" />
                    {t.productsPage.testDemo}
                  </Button>
                </a>
              )}
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}&source=${encodeURIComponent(`/products/${product.slug}`)}`}
                className="w-full sm:w-auto"
                onClick={handleInterestClick}
              >
                <Button
                  variant={product.demoEnabled ? "secondary" : "default"}
                  size="lg"
                  className="w-full sm:w-auto gap-2 font-medium"
                >
                  <MessageSquare className="h-4 w-4" />
                  {lang === "en" ? "Interested in This Tool" : "สนใจระบบนี้"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Main Screenshot */}
          <div className="lg:col-span-6">
            <div
              className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface-secondary shadow-hover cursor-pointer"
              onClick={() => setSelectedImage({ url: product.coverImage, alt: product.name, caption: `${product.name} Preview` })}
            >
              <Image
                src={product.coverImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur-xs">
                  <Maximize2 className="h-4 w-4" />
                  {t.productDetail.galleryClickToZoom}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 20: PRODUCT PROBLEM SECTION */}
      {product.problems && product.problems.length > 0 && (
        <section className="rounded-3xl border border-border bg-surface-secondary/60 p-8 sm:p-12">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              {t.productDetail.problemsSectionBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
              {product.problemsTitle || t.productDetail.problemsSectionTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.problemsDescription || (lang === "en" ? "Common bottlenecks that slow down your team and waste resources" : "จุดติดขัดในงานเดิมๆ ที่ทำให้เสียเวลาและสิ้นเปลืองพลังงาน")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.problems.map((prob: any, idx: number) => (
              <div
                key={prob.id || idx}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-border/80 shadow-subtle"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 font-bold text-xs mt-0.5">
                  ✕
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {prob.problemText || prob.text}
                  </p>
                  {prob.impactText && (
                    <span className="inline-block text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {prob.impactText}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 21: PRODUCT SOLUTION SECTION */}
      {(product.solutionDescription || product.fullDescription || product.description) && (
        <section className="mx-auto max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            {t.productDetail.solutionSectionBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {product.solutionTitle || t.productDetail.solutionSectionTitle}
          </h2>
          <div className="prose prose-neutral max-w-none text-muted-foreground text-base sm:text-lg leading-relaxed text-left sm:text-center mt-4">
            <p className="whitespace-pre-line">{product.solutionDescription || product.fullDescription || product.description}</p>
          </div>
        </section>
      )}

      {/* SECTION 22: PRODUCT FEATURES */}
      {product.features && product.features.length > 0 && (
        <section className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              {t.productDetail.featuresSectionBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
              {product.featuresTitle || t.productDetail.featuresSectionTitle}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
              {lang === "en" ? "Core capabilities designed to get work done rapidly" : "ฟีเจอร์หลักที่ออกแบบมาเพื่อช่วยให้งานเสร็จเร็วขึ้น"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature: any, idx: number) => (
              <div
                key={feature.id || idx}
                className="flex flex-col p-6 rounded-2xl border border-border bg-white shadow-subtle hover:border-brand/30 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light mb-4">
                  {getFeatureIcon(feature.icon)}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
                  {feature.badge && (
                    <span className="text-[10px] font-semibold bg-brand-light text-brand px-2 py-0.5 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 23: SCREENSHOT GALLERY */}
      {product.gallery && product.gallery.length > 0 && (
        <section className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              {t.productDetail.gallerySectionBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
              {t.productDetail.gallerySectionTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.productDetail.galleryClickToZoom}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {product.gallery.map((img: any, idx: number) => (
              <div
                key={img.id || idx}
                className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface-secondary shadow-subtle cursor-pointer"
                onClick={() => setSelectedImage({ url: img.imageUrl, alt: img.altText, caption: img.caption })}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.altText || "Screenshot"}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <div className="text-center text-white">
                    <Maximize2 className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-xs font-medium">{img.caption || (lang === "en" ? "Click to zoom" : "คลิกเพื่อซูม")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 24, 25, 26: DEMO SECTION & DEMO INFO & DISCLAIMER */}
      {product.demoEnabled && (
        <section id="demo" className="scroll-mt-24 rounded-3xl border border-brand/20 bg-brand-light/40 p-8 sm:p-12">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              {t.productDetail.demoSectionBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t.productDetail.demoSectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t.productDetail.demoSectionSubtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Demo Account info if applicable */}
            <div className="lg:col-span-7 space-y-4 bg-white p-6 rounded-2xl border border-border shadow-subtle">
              {product.demoType === "account" && (
                <>
                  <h3 className="text-sm font-bold text-foreground">
                    {t.productDetail.copyCredentialsTitle}
                  </h3>
                  <div className="space-y-2.5">
                    {product.demoUsername && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary border border-border">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">{t.demoPage.usernameLabel}</span>
                          <span className="text-xs sm:text-sm font-mono font-medium text-foreground">{product.demoUsername}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(product.demoUsername || "", "username")}
                          className="h-8 gap-1 text-xs"
                        >
                          {copiedField === "username" ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600">{t.productDetail.copiedBtn}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>{t.productDetail.copyBtn}</span>
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {product.demoPassword && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary border border-border">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">{t.demoPage.passwordLabel}</span>
                          <span className="text-xs sm:text-sm font-mono font-medium text-foreground">{product.demoPassword}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(product.demoPassword || "", "password")}
                          className="h-8 gap-1 text-xs"
                        >
                          {copiedField === "password" ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600">{t.productDetail.copiedBtn}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>{t.productDetail.copyBtn}</span>
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {product.demoNote && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  💡 <strong>{t.demoPage.notesLabel}:</strong> {product.demoNote}
                </p>
              )}

              {/* SECTION 26: DEMO DISCLAIMER */}
              <div className="flex items-start gap-2 pt-2 border-t border-border text-[11px] text-muted-foreground">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                <span>
                  <strong>Demo Disclaimer:</strong> {lang === "en" ? "This is a live sandbox environment. Sample records and changes may be reset periodically." : "Demo เป็นระบบทดลอง ข้อมูลที่เพิ่ม แก้ไข หรือลบ อาจถูกรีเซ็ตอัตโนมัติเป็นระยะ"}
                </span>
              </div>
            </div>

            {/* Launch Demo CTA */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-border text-center shadow-subtle space-y-4">
              <span className="text-xs font-semibold text-muted-foreground">
                {lang === "en" ? "Interactive Sandbox Ready" : "พร้อมทดสอบระบบจริง"}
              </span>
              {product.demoUrl ? (
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleDemoClick}
                  className="w-full"
                >
                  <Button size="lg" className="w-full gap-2 shadow-sm font-semibold">
                    <Play className="h-4 w-4 fill-current" />
                    {t.productDetail.openDemoBtn}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}&source=${encodeURIComponent(`/products/${product.slug}`)}`}
                  className="w-full"
                >
                  <Button size="lg" className="w-full gap-2 font-semibold">
                    {lang === "en" ? "Request Demo Access" : "ติดต่อเพื่อขอ Demo"}
                  </Button>
                </Link>
              )}
              <span className="text-[11px] text-muted-foreground">
                {lang === "en" ? "Opens in new tab • No installation needed" : "เปิดในแท็บใหม่ • ไม่ต้องติดตั้งโปรแกรม"}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 29: PRODUCT PRICING & INQUIRY CARD */}
      <section className="rounded-3xl border border-border bg-surface-secondary/70 p-8 sm:p-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            {t.footer.getStarted}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {lang === "en" ? `Interested in deploying ${product.name}?` : `สนใจนำ ${product.name} ไปปรับใช้กับธุรกิจของคุณ?`}
          </h2>

          <div className="p-6 rounded-2xl bg-white border border-border shadow-subtle text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
              <PricingDisplay
                pricingType={product.pricingType}
                price={product.price}
                originalPrice={product.originalPrice}
                currency={product.currency}
                billingPeriod={product.billingPeriod}
                pricingNote={product.pricingNote}
                isOnSale={product.isOnSale}
                size="lg"
              />
            </div>

            {/* Checklist items */}
            <div className="space-y-2 text-xs sm:text-sm text-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{lang === "en" ? "Instant deployment within 24-48 hours" : "ติดตั้งและพร้อมใช้งานได้ทันที"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{lang === "en" ? "Customizable brand colors, logos, and settings" : "รองรับการปรับแต่งโลโก้ สี และหมวดหมู่ข้อมูล"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{lang === "en" ? "Optional custom integrations and feature expansion" : "สามารถขอปรับแต่งฟีเจอร์เฉพาะเพิ่มเติมได้"}</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}&source=${encodeURIComponent(`/products/${product.slug}`)}`}
                className="w-full block"
              >
                <Button size="lg" className="w-full justify-center gap-2 font-semibold">
                  <span>{lang === "en" ? "Get Started / Inquire" : "สนใจระบบนี้ / สอบถามรายละเอียด"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Modal for Zoom */}
      <ScreenshotModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ""}
        altText={selectedImage?.alt}
        caption={selectedImage?.caption}
      />
    </div>
  );
}
