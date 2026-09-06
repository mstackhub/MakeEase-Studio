"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { FullProduct } from "@/lib/db-queries";
import { Category } from "@/db/schema";
import { trackSearch, trackFilter } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { localizedCategoryNames, getLocalizedProduct } from "@/lib/i18n/translations";

interface ProductsClientProps {
  products: FullProduct[];
  categories: Category[];
  initialCategory?: string;
}

export function ProductsClient({
  products,
  categories,
  initialCategory = "all",
}: ProductsClientProps) {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBadge, setSelectedBadge] = useState("all");

  const badgeFilters = [
    { id: "all", label: lang === "en" ? "All" : "ทั้งหมด" },
    { id: "Ready to Use", label: "Ready to Use" },
    { id: "Live Demo", label: "Live Demo" },
    { id: "Customizable", label: "Customizable" },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((rawProduct) => {
      const product = getLocalizedProduct(rawProduct, lang);
      // 1. Search term match (Name, Description, Category)
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.shortDescription.toLowerCase().includes(term) ||
        (product.fullDescription && product.fullDescription.toLowerCase().includes(term)) ||
        rawProduct.categories.some((c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term));

      // 2. Category filter
      const matchCategory =
        selectedCategory === "all" ||
        rawProduct.categories.some((c) => c.slug === selectedCategory);

      // 3. Badge filter
      const matchBadge =
        selectedBadge === "all" ||
        rawProduct.badges.includes(selectedBadge) ||
        (selectedBadge === "Live Demo" && rawProduct.demoEnabled);

      return matchSearch && matchCategory && matchBadge;
    });
  }, [products, searchTerm, selectedCategory, selectedBadge, lang]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.length > 2) {
      trackSearch(val);
    }
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    trackFilter(slug, "category");
  };

  const handleBadgeSelect = (badgeId: string) => {
    setSelectedBadge(badgeId);
    trackFilter(badgeId, "badge");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedBadge("all");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          {t.productsPage.badge}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
          {t.productsPage.title}
        </h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          {t.productsPage.subtitle}
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-surface-secondary/70 p-4 sm:p-5 rounded-2xl border border-border">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.productsPage.searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 pr-9 bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Badge Quick Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {badgeFilters.map((badge) => (
            <button
              key={badge.id}
              onClick={() => handleBadgeSelect(badge.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedBadge === badge.id
                  ? "bg-foreground text-white shadow-xs"
                  : "bg-white text-muted-foreground hover:text-foreground hover:bg-surface-secondary border border-border"
              }`}
            >
              {badge.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategorySelect("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-brand text-white shadow-xs"
              : "bg-surface-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {t.productsPage.allCategories} ({products.length})
        </button>
        {categories.map((cat) => {
          const catName = localizedCategoryNames[cat.slug]?.[lang] || cat.name;
          const count = products.filter((p) =>
            p.categories.some((c) => c.slug === cat.slug)
          ).length;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
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

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          type="search"
          title={t.productsPage.emptyTitle}
          description={t.productsPage.emptyDesc}
          actionLabel={t.productsPage.clearSearch}
          onActionClick={handleResetFilters}
        />
      )}
    </div>
  );
}
