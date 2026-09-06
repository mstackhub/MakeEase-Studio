import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default("Admin"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").default("Folder"),
  sortOrder: integer("sort_order").default(0),
  status: text("status", { enum: ["active", "archived"] }).default("active"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  coverImage: text("cover_image").notNull(),
  productType: text("product_type", { enum: ["product", "portfolio", "case_study"] }).default("product"),
  status: text("status", { enum: ["draft", "published", "archived"] }).default("published"),
  
  // Pricing
  pricingType: text("pricing_type", { enum: ["free", "fixed", "starting", "subscription", "custom", "contact"] }).default("fixed"),
  price: integer("price").default(0),
  originalPrice: integer("original_price"),
  currency: text("currency").default("THB"),
  billingPeriod: text("billing_period", { enum: ["month", "year", "one_time"] }).default("one_time"),
  pricingNote: text("pricing_note"),
  isOnSale: integer("is_on_sale", { mode: "boolean" }).default(false),
  
  // Demo
  demoEnabled: integer("demo_enabled", { mode: "boolean" }).default(false),
  demoType: text("demo_type", { enum: ["direct", "account", "request"] }).default("direct"),
  demoUrl: text("demo_url"),
  demoUsername: text("demo_username"),
  demoPassword: text("demo_password"),
  demoNote: text("demo_note"),
  
  // CTA
  primaryCtaLabel: text("primary_cta_label"),
  primaryCtaUrl: text("primary_cta_url"),
  secondaryCtaLabel: text("secondary_cta_label"),
  secondaryCtaUrl: text("secondary_cta_url"),
  
  // Display & SEO
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  focusKeyword: text("focus_keyword"),
  ogImage: text("og_image"),
  canonicalUrl: text("canonical_url"),
  isIndexable: integer("is_indexable", { mode: "boolean" }).default(true),
  
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const productCategories = sqliteTable("product_categories", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
});

export const productBadges = sqliteTable("product_badges", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  badge: text("badge").notNull(), // 'Live Demo' | 'Ready to Use' | 'Customizable' | 'New' | 'Popular' | 'Beta' | 'Case Study'
});

export const productProblems = sqliteTable("product_problems", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const productFeatures = sqliteTable("product_features", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  icon: text("icon").default("CheckCircle2"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const productGallery = sqliteTable("product_gallery", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  lineId: text("line_id"),
  productId: text("product_id"),
  productName: text("product_name"),
  budget: text("budget"),
  message: text("message").notNull(),
  sourceUrl: text("source_url"),
  status: text("status", { enum: ["New", "Contacted", "Proposal", "Won", "Lost"] }).default("New"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey().default("default"),
  siteName: text("site_name").notNull().default("MakeEase Studio"),
  siteDescription: text("site_description").default("We build simple tools for real problems. — Web App และเครื่องมือที่สร้างขึ้นเพื่อช่วยลดขั้นตอน แก้ปัญหาจุกจิก และทำให้งานในแต่ละวันง่ายขึ้น"),
  logo: text("logo"),
  favicon: text("favicon"),
  brandColor: text("brand_color").default("#2563EB"),
  brandHoverColor: text("brand_hover_color").default("#1D4ED8"),
  brandLightColor: text("brand_light_color").default("#EFF6FF"),
  email: text("email").default("hello@makeease.studio"),
  phone: text("phone").default("081-234-5678"),
  lineUrl: text("line_url").default("https://line.me/ti/p/~makeeasestudio"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  footerText: text("footer_text").default("© 2026 MakeEase Studio. We build simple tools for real problems. All rights reserved."),
  gaId: text("ga_id"),
  defaultSeoTitle: text("default_seo_title").default("MakeEase Studio | We build simple tools for real problems"),
  defaultSeoDescription: text("default_seo_description").default("Web App และเครื่องมือที่สร้างขึ้นเพื่อช่วยลดขั้นตอน แก้ปัญหาจุกจิก และทำให้งานในแต่ละวันง่ายขึ้น"),
  defaultOgImage: text("default_og_image"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Admin = typeof admins.$inferSelect;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type ProductFeature = typeof productFeatures.$inferSelect;
export type ProductProblem = typeof productProblems.$inferSelect;
export type ProductGalleryItem = typeof productGallery.$inferSelect;
export type ProductBadge = typeof productBadges.$inferSelect;
