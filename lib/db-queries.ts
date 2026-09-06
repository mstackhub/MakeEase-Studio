import { db, products, categories, productCategories, productBadges, productProblems, productFeatures, productGallery, leads, settings } from "@/db";
import { eq, desc, asc, and, sql } from "drizzle-orm";

export async function getSettings() {
  try {
    const res = await db.select().from(settings).where(eq(settings.id, "default")).limit(1);
    if (res.length > 0) return res[0];
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
}

export async function getCategories() {
  try {
    return await db.select().from(categories).where(eq(categories.status, "active")).orderBy(asc(categories.sortOrder));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

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

export async function getPublishedProducts(): Promise<FullProduct[]> {
  try {
    const rawProducts = await db
      .select()
      .from(products)
      .where(eq(products.status, "published"))
      .orderBy(asc(products.sortOrder), desc(products.createdAt));

    const result: FullProduct[] = [];
    for (const p of rawProducts) {
      const pCats = await db
        .select({ id: categories.id, name: categories.name, slug: categories.slug })
        .from(productCategories)
        .innerJoin(categories, eq(productCategories.categoryId, categories.id))
        .where(eq(productCategories.productId, p.id));

      const pBadges = await db
        .select({ badge: productBadges.badge })
        .from(productBadges)
        .where(eq(productBadges.productId, p.id));

      const pProblems = await db
        .select()
        .from(productProblems)
        .where(eq(productProblems.productId, p.id))
        .orderBy(asc(productProblems.sortOrder));

      const pFeatures = await db
        .select()
        .from(productFeatures)
        .where(eq(productFeatures.productId, p.id))
        .orderBy(asc(productFeatures.sortOrder));

      const pGallery = await db
        .select()
        .from(productGallery)
        .where(eq(productGallery.productId, p.id))
        .orderBy(asc(productGallery.sortOrder));

      result.push({
        ...p,
        categories: pCats,
        badges: pBadges.map((b) => b.badge),
        problems: pProblems,
        features: pFeatures,
        gallery: pGallery,
      });
    }
    return result;
  } catch (error) {
    console.error("Error fetching published products:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<FullProduct[]> {
  const all = await getPublishedProducts();
  return all.filter((p) => p.isFeatured).slice(0, 6);
}

export async function getDemoProducts(): Promise<FullProduct[]> {
  const all = await getPublishedProducts();
  return all.filter((p) => p.demoEnabled);
}

export async function getProductBySlug(slug: string): Promise<FullProduct | null> {
  try {
    const raw = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (raw.length === 0) return null;
    const p = raw[0];

    const pCats = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(productCategories)
      .innerJoin(categories, eq(productCategories.categoryId, categories.id))
      .where(eq(productCategories.productId, p.id));

    const pBadges = await db
      .select({ badge: productBadges.badge })
      .from(productBadges)
      .where(eq(productBadges.productId, p.id));

    const pProblems = await db
      .select()
      .from(productProblems)
      .where(eq(productProblems.productId, p.id))
      .orderBy(asc(productProblems.sortOrder));

    const pFeatures = await db
      .select()
      .from(productFeatures)
      .where(eq(productFeatures.productId, p.id))
      .orderBy(asc(productFeatures.sortOrder));

    const pGallery = await db
      .select()
      .from(productGallery)
      .where(eq(productGallery.productId, p.id))
      .orderBy(asc(productGallery.sortOrder));

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
}

export async function getAllProductsAdmin(): Promise<FullProduct[]> {
  try {
    const rawProducts = await db
      .select()
      .from(products)
      .orderBy(asc(products.sortOrder), desc(products.createdAt));

    const result: FullProduct[] = [];
    for (const p of rawProducts) {
      const pCats = await db
        .select({ id: categories.id, name: categories.name, slug: categories.slug })
        .from(productCategories)
        .innerJoin(categories, eq(productCategories.categoryId, categories.id))
        .where(eq(productCategories.productId, p.id));

      const pBadges = await db
        .select({ badge: productBadges.badge })
        .from(productBadges)
        .where(eq(productBadges.productId, p.id));

      result.push({
        ...p,
        categories: pCats,
        badges: pBadges.map((b) => b.badge),
        problems: [],
        features: [],
        gallery: [],
      });
    }
    return result;
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<FullProduct | null> {
  try {
    const raw = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (raw.length === 0) return null;
    const p = raw[0];

    const pCats = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(productCategories)
      .innerJoin(categories, eq(productCategories.categoryId, categories.id))
      .where(eq(productCategories.productId, p.id));

    const pBadges = await db
      .select({ badge: productBadges.badge })
      .from(productBadges)
      .where(eq(productBadges.productId, p.id));

    const pProblems = await db
      .select()
      .from(productProblems)
      .where(eq(productProblems.productId, p.id))
      .orderBy(asc(productProblems.sortOrder));

    const pFeatures = await db
      .select()
      .from(productFeatures)
      .where(eq(productFeatures.productId, p.id))
      .orderBy(asc(productFeatures.sortOrder));

    const pGallery = await db
      .select()
      .from(productGallery)
      .where(eq(productGallery.productId, p.id))
      .orderBy(asc(productGallery.sortOrder));

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
  try {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const allProds = await db.select().from(products);
    const totalProducts = allProds.length;
    const publishedProducts = allProds.filter((p) => p.status === "published").length;
    const totalDemoProducts = allProds.filter((p) => p.demoEnabled).length;

    const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
    const totalLeads = allLeads.length;
    const newLeads = allLeads.filter((l) => l.status === "New").length;

    return {
      totalProducts,
      publishedProducts,
      totalDemoProducts,
      totalLeads,
      newLeads,
      recentLeads: allLeads.slice(0, 5),
      recentProducts: allProds.slice(0, 5),
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return {
      totalProducts: 0,
      publishedProducts: 0,
      totalDemoProducts: 0,
      totalLeads: 0,
      newLeads: 0,
      recentLeads: [],
      recentProducts: [],
    };
  }
}
