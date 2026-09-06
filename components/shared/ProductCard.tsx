"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PricingDisplay } from "./PricingDisplay";
import { FullProduct } from "@/lib/db-queries";
import { trackDemoClick, trackProductView } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getLocalizedProduct, localizedCategoryNames } from "@/lib/i18n/translations";

interface ProductCardProps {
  product: FullProduct;
}

export function ProductCard({ product: rawProduct }: ProductCardProps) {
  const { lang, t } = useLanguage();
  const product = getLocalizedProduct(rawProduct, lang);
  const categoryRaw = rawProduct.categories[0];
  const categoryName = categoryRaw ? (localizedCategoryNames[categoryRaw.slug]?.[lang] || categoryRaw.name) : "Web App";

  const handleDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackDemoClick(product.id, product.name, product.demoUrl);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-card shadow-subtle hover:border-brand/30">
      {/* Cover Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-secondary">
        <Image
          src={product.coverImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges on Top */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none">
          <span className="text-[11px] font-semibold bg-white/95 text-foreground px-2.5 py-1 rounded-md shadow-xs backdrop-blur-xs">
            {categoryName}
          </span>
          <div className="flex flex-wrap gap-1">
            {product.badges.slice(0, 2).map((badge: string, idx: number) => (
              <Badge key={idx} badgeName={badge} className="shadow-xs bg-white/95 backdrop-blur-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Floating Demo Indicator if enabled */}
        {product.demoEnabled && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-brand text-white text-[11px] font-medium px-2 py-0.5 rounded-full shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === "en" ? "Live Demo Ready" : "พร้อมทดลอง Demo"}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <Link
            href={`/products/${product.slug}`}
            className="focus:outline-none"
            onClick={() => trackProductView(product.id, product.name)}
          >
            <h3 className="text-lg font-bold text-foreground group-hover:text-brand transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="mt-4 pt-4 border-t border-border flex items-end justify-between gap-2">
          <PricingDisplay
            pricingType={product.pricingType}
            price={product.price}
            originalPrice={product.originalPrice}
            currency={product.currency}
            billingPeriod={product.billingPeriod}
            pricingNote={product.pricingNote}
            isOnSale={product.isOnSale}
            size="sm"
            showNote={false}
          />
        </div>

        {/* Actions Button Group */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {product.demoEnabled ? (
            product.demoType === "direct" && product.demoUrl ? (
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleDemoClick}
                className="w-full"
              >
                <Button variant="secondary" size="sm" className="w-full gap-1.5 text-xs">
                  <Play className="h-3 w-3 fill-current" />
                  {t.productsPage.testDemo}
                </Button>
              </a>
            ) : (
              <Link href={`/products/${product.slug}#demo`} className="w-full">
                <Button variant="secondary" size="sm" className="w-full gap-1.5 text-xs">
                  <Play className="h-3 w-3 fill-current" />
                  {t.productsPage.testDemo}
                </Button>
              </Link>
            )
          ) : (
            <Link href={`/contact?product=${encodeURIComponent(product.name)}&source=${encodeURIComponent(`/products/${product.slug}`)}`} className="w-full">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                {lang === "en" ? "Inquire" : "สอบถามข้อมูล"}
              </Button>
            </Link>
          )}

          <Link href={`/products/${product.slug}`} className="w-full">
            <Button size="sm" className="w-full gap-1 text-xs">
              {t.productsPage.viewDetails}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
