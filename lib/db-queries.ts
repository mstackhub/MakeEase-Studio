import { db, products, categories, productCategories, productBadges, productProblems, productFeatures, productGallery, leads, settings } from "@/db";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import { cache } from "react";

// In-memory microcache (30 seconds) to avoid redundant DB roundtrips on navigation
let cachedSettings: any = null;
let settingsCacheTime = 0;

let cachedCategories: any = null;
let categoriesCacheTime = 0;

export const getSettings = cache(async () => {
  const now = Date.now();
  if (cachedSettings && now - settingsCacheTime < 30000) {
    return cachedSettings;
  }

  try {
    const res = await db.select().from(settings).where(eq(settings.id, "default")).limit(1);
    if (res.length > 0) {
      cachedSettings = res[0];
      settingsCacheTime = now;
      return res[0];
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
  }

  return {
    id: "default",
    siteName: "MakeEase Studio",
    siteDescription: "สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง (We build simple tools for real problems.)",
    logo: null,
    favicon: null,
    brandColor: "#2563EB",
    brandHoverColor: "#1D4ED8",
    brandLightColor: "#EFF6FF",
    email: "contact@makeease.studio",
    phone: "081-234-5678",
    lineUrl: "https://line.me/ti/p/~makeeasestudio",
    facebookUrl: "https://facebook.com/makeeasestudio",
    instagramUrl: null,
    footerText: "© 2026 MakeEase Studio. สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง",
    gaId: null,
    defaultSeoTitle: "MakeEase Studio | สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง",
    defaultSeoDescription: "MakeEase Studio — สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง (We build simple tools for real problems.)",
    defaultOgImage: null,
    updatedAt: new Date().toISOString(),
  };
});

export const getCategories = cache(async () => {
  const now = Date.now();
  if (cachedCategories && now - categoriesCacheTime < 30000) {
    return cachedCategories;
  }

  try {
    const res = await db.select().from(categories).where(eq(categories.status, "active")).orderBy(asc(categories.sortOrder));
    cachedCategories = res;
    categoriesCacheTime = now;
    return res;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
});

export async function getAllCategoriesAdmin() {
  try {
    return await db.select().from(categories).orderBy(asc(categories.sortOrder));
  } catch (error) {
    console.error("Error fetching all categories for admin:", error);
    return [];
  }
}

export interface FullProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string | null;
  coverImage: string;
  productType: "product" | "portfolio" | "case_study" | null;
  status: "draft" | "published" | "archived" | null;
  pricingType: "free" | "fixed" | "starting" | "subscription" | "custom" | "contact" | null;
  price: number | null;
  originalPrice: number | null;
  currency: string | null;
  billingPeriod: "month" | "year" | "one_time" | null;
  pricingNote: string | null;
  isOnSale: boolean | null;
  demoEnabled: boolean | null;
  demoType: "direct" | "account" | "request" | null;
  demoUrl: string | null;
  demoUsername: string | null;
  demoPassword: string | null;
  demoNote: string | null;
  primaryCtaLabel: string | null;
  primaryCtaUrl: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaUrl: string | null;
  isFeatured: boolean | null;
  sortOrder: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  isIndexable: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  categories: { id: string; name: string; slug: string }[];
  badges: string[];
  problems: { id: string; text: string; sortOrder: number | null }[];
  features: { id: string; icon: string | null; title: string; description: string; sortOrder: number | null }[];
  gallery: { id: string; imageUrl: string; altText: string | null; caption: string | null; sortOrder: number | null }[];
}

let cachedPublishedProducts: FullProduct[] | null = null;
let publishedProductsCacheTime = 0;

let cachedAdminProducts: FullProduct[] | null = null;
let adminProductsCacheTime = 0;

let cachedAdminLeads: any[] | null = null;
let adminLeadsCacheTime = 0;

export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  totalDemoProducts: number;
  totalLeads: number;
  newLeads: number;
  recentLeads: any[];
  recentProducts: any[];
}

let cachedDashboardStats: DashboardStats | null = null;
let dashboardStatsCacheTime = 0;

export function clearDbCache() {
  cachedSettings = null;
  settingsCacheTime = 0;
  cachedCategories = null;
  categoriesCacheTime = 0;
  cachedPublishedProducts = null;
  publishedProductsCacheTime = 0;
  cachedAdminProducts = null;
  adminProductsCacheTime = 0;
  cachedAdminLeads = null;
  adminLeadsCacheTime = 0;
  cachedDashboardStats = null;
  dashboardStatsCacheTime = 0;
}

export const getPublishedProducts = cache(async (): Promise<FullProduct[]> => {
  const now = Date.now();
  if (cachedPublishedProducts && now - publishedProductsCacheTime < 30000) {
    return cachedPublishedProducts;
  }

  try {
    // Parallel batch fetch all product-related tables in 1 single roundtrip
    const [rawProducts, allProductCategories, allBadges, allProblems, allFeatures, allGallery] = await Promise.all([
      db
        .select()
        .from(products)
        .where(eq(products.status, "published"))
        .orderBy(asc(products.sortOrder), desc(products.createdAt)),
      db
        .select({
          productId: productCategories.productId,
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(productCategories)
        .innerJoin(categories, eq(productCategories.categoryId, categories.id)),
      db.select().from(productBadges),
      db.select().from(productProblems).orderBy(asc(productProblems.sortOrder)),
      db.select().from(productFeatures).orderBy(asc(productFeatures.sortOrder)),
      db.select().from(productGallery).orderBy(asc(productGallery.sortOrder)),
    ]);

    // Group related data by productId in memory
    const catMap = new Map<string, { id: string; name: string; slug: string }[]>();
    for (const c of allProductCategories) {
      const arr = catMap.get(c.productId) || [];
      arr.push({ id: c.id, name: c.name, slug: c.slug });
      catMap.set(c.productId, arr);
    }

    const badgeMap = new Map<string, string[]>();
    for (const b of allBadges) {
      const arr = badgeMap.get(b.productId) || [];
      arr.push(b.badge);
      badgeMap.set(b.productId, arr);
    }

    const probMap = new Map<string, any[]>();
    for (const p of allProblems) {
      const arr = probMap.get(p.productId) || [];
      arr.push(p);
      probMap.set(p.productId, arr);
    }

    const featMap = new Map<string, any[]>();
    for (const f of allFeatures) {
      const arr = featMap.get(f.productId) || [];
      arr.push(f);
      featMap.set(f.productId, arr);
    }

    const galMap = new Map<string, any[]>();
    for (const g of allGallery) {
      const arr = galMap.get(g.productId) || [];
      arr.push(g);
      galMap.set(g.productId, arr);
    }

    const result: FullProduct[] = rawProducts.map((p) => ({
      ...p,
      categories: catMap.get(p.id) || [],
      badges: badgeMap.get(p.id) || [],
      problems: probMap.get(p.id) || [],
      features: featMap.get(p.id) || [],
      gallery: galMap.get(p.id) || [],
    }));

    cachedPublishedProducts = result;
    publishedProductsCacheTime = now;
    return result;
  } catch (error) {
    console.error("Error fetching published products:", error);
    return cachedPublishedProducts || [];
  }
});

export const getFeaturedProducts = cache(async (): Promise<FullProduct[]> => {
  const all = await getPublishedProducts();
  return all.filter((p) => p.isFeatured).slice(0, 6);
});

export const getDemoProducts = cache(async (): Promise<FullProduct[]> => {
  const all = await getPublishedProducts();
  return all.filter((p) => p.demoEnabled);
});

export const getProductBySlug = cache(async (slug: string): Promise<FullProduct | null> => {
  try {
    const raw = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (raw.length === 0) return null;
    const p = raw[0];

    const [pCats, pBadges, pProblems, pFeatures, pGallery] = await Promise.all([
      db
        .select({ id: categories.id, name: categories.name, slug: categories.slug })
        .from(productCategories)
        .innerJoin(categories, eq(productCategories.categoryId, categories.id))
        .where(eq(productCategories.productId, p.id)),
      db
        .select({ badge: productBadges.badge })
        .from(productBadges)
        .where(eq(productBadges.productId, p.id)),
      db
        .select()
        .from(productProblems)
        .where(eq(productProblems.productId, p.id))
        .orderBy(asc(productProblems.sortOrder)),
      db
        .select()
        .from(productFeatures)
        .where(eq(productFeatures.productId, p.id))
        .orderBy(asc(productFeatures.sortOrder)),
      db
        .select()
        .from(productGallery)
        .where(eq(productGallery.productId, p.id))
        .orderBy(asc(productGallery.sortOrder)),
    ]);

    return {
      ...p,
      categories: pCats,
      badges: pBadges.map((b) => b.badge),
      problems: pProblems,
      features: pFeatures,
      gallery: pGallery,
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
});

export async function getAllProductsAdmin(): Promise<FullProduct[]> {
  const now = Date.now();
  if (cachedAdminProducts && now - adminProductsCacheTime < 10000) {
    return cachedAdminProducts;
  }

  try {
    const [rawProducts, allProductCategories, allBadges] = await Promise.all([
      db
        .select()
        .from(products)
        .orderBy(asc(products.sortOrder), desc(products.createdAt)),
      db
        .select({
          productId: productCategories.productId,
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(productCategories)
        .innerJoin(categories, eq(productCategories.categoryId, categories.id)),
      db.select().from(productBadges),
    ]);

    const catMap = new Map<string, { id: string; name: string; slug: string }[]>();
    for (const c of allProductCategories) {
      const arr = catMap.get(c.productId) || [];
      arr.push({ id: c.id, name: c.name, slug: c.slug });
      catMap.set(c.productId, arr);
    }

    const badgeMap = new Map<string, string[]>();
    for (const b of allBadges) {
      const arr = badgeMap.get(b.productId) || [];
      arr.push(b.badge);
      badgeMap.set(b.productId, arr);
    }

    const result = rawProducts.map((p) => ({
      ...p,
      categories: catMap.get(p.id) || [],
      badges: badgeMap.get(p.id) || [],
      problems: [],
      features: [],
      gallery: [],
    }));

    cachedAdminProducts = result;
    adminProductsCacheTime = now;
    return result;
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return cachedAdminProducts || [];
  }
}

export async function getProductById(id: string): Promise<FullProduct | null> {
  try {
    const raw = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (raw.length === 0) return null;
    const p = raw[0];

    const [pCats, pBadges, pProblems, pFeatures, pGallery] = await Promise.all([
      db
        .select({ id: categories.id, name: categories.name, slug: categories.slug })
        .from(productCategories)
        .innerJoin(categories, eq(productCategories.categoryId, categories.id))
        .where(eq(productCategories.productId, p.id)),
      db
        .select({ badge: productBadges.badge })
        .from(productBadges)
        .where(eq(productBadges.productId, p.id)),
      db
        .select()
        .from(productProblems)
        .where(eq(productProblems.productId, p.id))
        .orderBy(asc(productProblems.sortOrder)),
      db
        .select()
        .from(productFeatures)
        .where(eq(productFeatures.productId, p.id))
        .orderBy(asc(productFeatures.sortOrder)),
      db
        .select()
        .from(productGallery)
        .where(eq(productGallery.productId, p.id))
        .orderBy(asc(productGallery.sortOrder)),
    ]);

    return {
      ...p,
      categories: pCats,
      badges: pBadges.map((b) => b.badge),
      problems: pProblems,
      features: pFeatures,
      gallery: pGallery,
    };
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return null;
  }
}

export async function getLeadsAdmin() {
  const now = Date.now();
  if (cachedAdminLeads && now - adminLeadsCacheTime < 10000) {
    return cachedAdminLeads;
  }

  try {
    const res = await db.select().from(leads).orderBy(desc(leads.createdAt));
    cachedAdminLeads = res;
    adminLeadsCacheTime = now;
    return res;
  } catch (error) {
    console.error("Error fetching leads:", error);
    return cachedAdminLeads || [];
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = Date.now();
  if (cachedDashboardStats && now - dashboardStatsCacheTime < 10000) {
    return cachedDashboardStats;
  }

  try {
    const [allProds, allLeads] = await Promise.all([
      db.select().from(products),
      db.select().from(leads).orderBy(desc(leads.createdAt)),
    ]);

    const totalProducts = allProds.length;
    const publishedProducts = allProds.filter((p) => p.status === "published").length;
    const totalDemoProducts = allProds.filter((p) => p.demoEnabled).length;

    const totalLeads = allLeads.length;
    const newLeads = allLeads.filter((l) => l.status === "New").length;

    const res = {
      totalProducts,
      publishedProducts,
      totalDemoProducts,
      totalLeads,
      newLeads,
      recentLeads: allLeads.slice(0, 5),
      recentProducts: allProds.slice(0, 5),
    };

    cachedDashboardStats = res;
    dashboardStatsCacheTime = now;
    return res;
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return (
      cachedDashboardStats || {
        totalProducts: 0,
        publishedProducts: 0,
        totalDemoProducts: 0,
        totalLeads: 0,
        newLeads: 0,
        recentLeads: [],
        recentProducts: [],
      }
    );
  }
}
