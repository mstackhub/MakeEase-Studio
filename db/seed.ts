import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log("📡 Connecting to DB URL:", url);
console.log("🔑 Auth Token provided:", !!authToken);

const client = createClient({ url, authToken });
const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Starting database seed...");

  // 1. Create tables if not exist (via basic DDL for quick bootstrap)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Admin',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      icon TEXT DEFAULT 'Folder',
      sort_order INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      short_description TEXT NOT NULL,
      full_description TEXT,
      cover_image TEXT NOT NULL,
      product_type TEXT DEFAULT 'product',
      status TEXT DEFAULT 'published',
      pricing_type TEXT DEFAULT 'fixed',
      price INTEGER DEFAULT 0,
      original_price INTEGER,
      currency TEXT DEFAULT 'THB',
      billing_period TEXT DEFAULT 'one_time',
      pricing_note TEXT,
      is_on_sale INTEGER DEFAULT 0,
      demo_enabled INTEGER DEFAULT 0,
      demo_type TEXT DEFAULT 'direct',
      demo_url TEXT,
      demo_username TEXT,
      demo_password TEXT,
      demo_note TEXT,
      primary_cta_label TEXT,
      primary_cta_url TEXT,
      secondary_cta_label TEXT,
      secondary_cta_url TEXT,
      is_featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      meta_title TEXT,
      meta_description TEXT,
      focus_keyword TEXT,
      og_image TEXT,
      canonical_url TEXT,
      is_indexable INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS product_categories (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      category_id TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS product_badges (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      badge TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS product_problems (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      text TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS product_features (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      icon TEXT DEFAULT 'CheckCircle2',
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS product_gallery (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      alt_text TEXT,
      caption TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      line_id TEXT,
      product_id TEXT,
      product_name TEXT,
      budget TEXT,
      message TEXT NOT NULL,
      source_url TEXT,
      status TEXT DEFAULT 'New',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY DEFAULT 'default',
      site_name TEXT NOT NULL DEFAULT 'MakeEase Studio',
      site_description TEXT,
      logo TEXT,
      favicon TEXT,
      brand_color TEXT DEFAULT '#2563EB',
      brand_hover_color TEXT DEFAULT '#1D4ED8',
      brand_light_color TEXT DEFAULT '#EFF6FF',
      email TEXT DEFAULT 'hello@makeease.studio',
      phone TEXT DEFAULT '081-234-5678',
      line_url TEXT DEFAULT 'https://line.me/ti/p/~makeeasestudio',
      facebook_url TEXT,
      instagram_url TEXT,
      footer_text TEXT DEFAULT '© 2026 MakeEase Studio. We build simple tools for real problems. All rights reserved.',
      ga_id TEXT,
      default_seo_title TEXT DEFAULT 'MakeEase Studio | We build simple tools for real problems',
      default_seo_description TEXT DEFAULT 'Web App และเครื่องมือที่สร้างขึ้นเพื่อช่วยลดขั้นตอน แก้ปัญหาจุกจิก และทำให้งานในแต่ละวันง่ายขึ้น',
      default_og_image TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Clear existing
  await client.execute(`DELETE FROM product_categories;`);
  await client.execute(`DELETE FROM product_badges;`);
  await client.execute(`DELETE FROM product_problems;`);
  await client.execute(`DELETE FROM product_features;`);
  await client.execute(`DELETE FROM product_gallery;`);
  await client.execute(`DELETE FROM products;`);
  await client.execute(`DELETE FROM categories;`);
  await client.execute(`DELETE FROM admins;`);
  await client.execute(`DELETE FROM settings;`);
  await client.execute(`DELETE FROM leads;`);

  // 2. Admin
  const adminPassword = process.env.ADMIN_PASSWORD || "adminpassword123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await db.insert(schema.admins).values({
    id: "admin-1",
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    passwordHash,
    name: "System Admin",
  });

  // 3. Settings
  await db.insert(schema.settings).values({
    id: "default",
    siteName: "MakeEase Studio",
    siteDescription: "สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง (We build simple tools for real problems.)",
    brandColor: "#2563EB",
    brandHoverColor: "#1D4ED8",
    brandLightColor: "#EFF6FF",
    email: "contact@makeease.studio",
    phone: "081-234-5678",
    lineUrl: "https://line.me/ti/p/~makeeasestudio",
    facebookUrl: "https://facebook.com/makeeasestudio",
    footerText: "© 2026 MakeEase Studio. สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง",
    defaultSeoTitle: "MakeEase Studio | สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง",
    defaultSeoDescription: "MakeEase Studio — สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง (We build simple tools for real problems.)",
  });

  // 4. Categories
  const sampleCategories = [
    { id: "cat-1", name: "E-Commerce", slug: "ecommerce", description: "เครื่องมือสำหรับร้านค้าออนไลน์ เพิ่มยอดขายและจัดการออเดอร์", icon: "ShoppingBag", sortOrder: 1 },
    { id: "cat-2", name: "Business Tools", slug: "business-tools", description: "ระบบจัดการเอกสาร การเงิน และการทำงานในธุรกิจ", icon: "Briefcase", sortOrder: 2 },
    { id: "cat-3", name: "Automation", slug: "automation", description: "ระบบทำงานอัตโนมัติ ลดงานซ้ำซ้อนและประหยัดเวลา", icon: "Zap", sortOrder: 3 },
    { id: "cat-4", name: "Customer Experience", slug: "customer-experience", description: "เครื่องมือสร้างประสบการณ์ที่ดีและสื่อสารกับลูกค้า", icon: "Smile", sortOrder: 4 },
    { id: "cat-5", name: "Internal Tools", slug: "internal-tools", description: "ระบบใช้งานภายในองค์กร เชื่อมต่อข้อมูลให้ทำงานง่ายขึ้น", icon: "Layers", sortOrder: 5 },
    { id: "cat-6", name: "Productivity", slug: "productivity", description: "ตัวช่วยจัดการงานและจัดระเบียบข้อมูลประจำวัน", icon: "CheckSquare", sortOrder: 6 },
  ];

  for (const cat of sampleCategories) {
    await db.insert(schema.categories).values(cat);
  }

  // 5. Products
  const sampleProducts = [
    {
      id: "prod-1",
      name: "EasyMenu",
      slug: "easymenu",
      shortDescription: "เมนูออนไลน์สำหรับร้านอาหาร สร้าง จัดการหมวดหมู่ ราคา รูปภาพ และแชร์ให้ลูกค้าดูผ่านลิงก์หรือสแกน QR ได้ทันที",
      fullDescription: "EasyMenu ออกแบบมาเพื่อร้านอาหาร คาเฟ่ และร้านเครื่องดื่มที่ต้องการมีเมนูดิจิทัลที่ดูดี ใช้งานง่าย อัปเดตราคาและสถานะสินค้าหมดได้แบบ Real-time โดยไม่ต้องพิมพ์ใบเมนูใหม่ ไม่ต้องดาวน์โหลดแอป ลูกค้าเพียงแค่สแกน QR Code ก็เปิดดูเมนูบนมือถือได้ลื่นไหล",
      coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
      productType: "product" as const,
      status: "published" as const,
      pricingType: "fixed" as const,
      price: 990,
      originalPrice: 1990,
      currency: "THB",
      billingPeriod: "one_time" as const,
      pricingNote: "จ่ายครั้งเดียวใช้งานได้ตลอดชีพ ไม่มีรายเดือน",
      isOnSale: true,
      demoEnabled: true,
      demoType: "account" as const,
      demoUrl: "https://demo.easymenu.example.com",
      demoUsername: "demo@restaurant.com",
      demoPassword: "demopassword123",
      demoNote: "เข้าสู่ระบบเพื่อทดลองเพิ่มเมนู จัดหมวดหมู่ และพรีวิวหน้าสแกน QR Code ของลูกค้า",
      isFeatured: true,
      sortOrder: 1,
      metaTitle: "EasyMenu เมนูออนไลน์สำหรับร้านอาหาร สแกนดูง่าย อัปเดตไว",
      metaDescription: "ระบบเมนูออนไลน์สำหรับร้านอาหารและคาเฟ่ สแกน QR Code ดูเมนูได้ทันที ไม่ต้องโหลดแอป อัปเดตราคาแบบเรียลไทม์",
      categories: ["cat-1", "cat-4"],
      badges: ["Ready to Use", "Live Demo", "Popular"],
      problems: [
        "เมนูกระดาษชำรุดง่าย แก้ไขราคาแต่ละครั้งต้องสั่งพิมพ์ใหม่เสียเวลาและค่าใช้จ่าย",
        "ของหมดระหว่างวัน แต่ลูกค้าสั่งไปแล้วทำให้ต้องคอยแจ้งยกเลิก",
        "ลูกค้าต่างชาติอ่านเมนูไม่เข้าใจ ไม่มีรูปภาพประกอบชัดเจน",
        "แชร์รูปลงโซเชียลแล้วลูกค้าหาเมนูและราคาจริงได้ยาก",
      ],
      features: [
        { icon: "QrCode", title: "สร้าง QR Code ประจำโต๊ะ", description: "ดาวน์โหลด QR Code ไปตั้งโต๊ะได้ทันที สแกนแล้วเปิดเมนูขึ้นทันใจ" },
        { icon: "Layers", title: "จัดหมวดหมู่อาหาร & ตัวเลือกเสริม", description: "แยกอาหารจานหลัก ของหวาน เครื่องดื่ม และใส่ระดับความหวาน ท็อปปิ้งได้" },
        { icon: "Image", title: "อัปโหลดรูปภาพความคมชัดสูง", description: "โชว์รูปอาหารสวยงาม รองรับการแสดงผลทุกขนาดหน้าจอมือถือ" },
        { icon: "ToggleRight", title: "ปุ่มเปิด-ปิดสินค้าหมดทันที", description: "เมนูไหนหมดกดปิดได้ใน 1 วินาที ลูกค้าจะเห็นสถานะหมดทันทีไม่สั่งซ้ำ" },
        { icon: "Smartphone", title: "Mobile-First UX", description: "โหลดเร็ว ประหยัดเน็ต ใช้งานง่าย ไม่ต้องติดตั้งแอปพลิเคชันใดๆ" },
      ],
      gallery: [
        { imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop", altText: "EasyMenu Customer Mobile View", caption: "หน้าตาเมนูดิจิทัลฝั่งลูกค้า สวยงาม โหลดไว" },
        { imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop", altText: "EasyMenu Admin Dashboard", caption: "ระบบหลังบ้านสำหรับจัดการรายการอาหารและหมวดหมู่" },
      ],
    },
    {
      id: "prod-2",
      name: "QuickQuotation",
      slug: "quick-quotation",
      shortDescription: "ระบบออกใบเสนอราคาและใบแจ้งหนี้แบบรวดเร็ว พร้อม Export PDF และส่งลิงก์ให้ลูกค้าอนุมัติออนไลน์",
      fullDescription: "QuickQuotation ช่วยให้ฟรีแลนซ์และธุรกิจขนาดย่อมออกใบเสนอราคา (Quotation) และใบแจ้งหนี้ (Invoice) ได้ใน 1 นาที ไม่ต้องนั่งจัดตารางใน Word หรือ Excel อีกต่อไป ระบบคำนวณภาษี ส่วนลด และหัก ณ ที่จ่ายให้อัตโนมัติ พร้อมส่งลิงก์ให้ลูกค้ากดเซ็นอนุมัติผ่านหน้าเว็บได้ทันที",
      coverImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop",
      productType: "product" as const,
      status: "published" as const,
      pricingType: "fixed" as const,
      price: 1490,
      originalPrice: 2490,
      currency: "THB",
      billingPeriod: "one_time" as const,
      pricingNote: "รวมเทมเพลตมาตรฐาน 3 แบบ พร้อมปรับแต่งโลโก้ร้าน",
      isOnSale: true,
      demoEnabled: true,
      demoType: "direct" as const,
      demoUrl: "https://demo.quickquotation.example.com",
      demoNote: "ทดลองพิมพ์ข้อมูลจำลองและดาวน์โหลดตัวอย่างไฟล์ PDF ได้ทันทีโดยไม่ต้องล็อกอิน",
      isFeatured: true,
      sortOrder: 2,
      metaTitle: "QuickQuotation ออกใบเสนอราคาและใบแจ้งหนี้ง่ายใน 1 นาที",
      metaDescription: "โปรแกรมออกใบเสนอราคาและเอกสารการค้าสำหรับฟรีแลนซ์และ SME คำนวณ VAT อัตโนมัติ Export PDF สวยงาม",
      categories: ["cat-2", "cat-6"],
      badges: ["Ready to Use", "Live Demo", "New"],
      problems: [
        "ใช้ Excel ทำใบเสนอราคาแล้วสูตรคำนวณเพี้ยน ตัวเลขผิดพลาด",
        "จัดหน้ากระดาษและฟอนต์ใน Word แล้วเลื่อนเมื่อส่งให้ลูกค้า",
        "ค้นหาเอกสารเก่ายาก ไม่รู้ว่าใบไหนลูกค้าอนุมัติแล้วหรือยังค้างจ่าย",
        "เสียเวลากรอกข้อมูลเดิมๆ เช่น ชื่อลูกค้า ข้อมูลบริษัท ซ้ำไปซ้ำมา",
      ],
      features: [
        { icon: "FileText", title: "บันทึกและ Export เป็น PDF", description: "เอกสารมาตรฐานสากล ฟอนต์คมชัด พร้อมช่องใส่โลโก้และลายเซ็น" },
        { icon: "Calculator", title: "คำนวณภาษี & หัก ณ ที่จ่าย", description: "คำนวณ VAT 7% และ Withholding Tax 3% หรือ 1% ได้อัตโนมัติ" },
        { icon: "Users", title: "สมุดรายชื่อลูกค้า", description: "บันทึกข้อมูลลูกค้าไว้ เลือกลูกค้าแล้วข้อมูลกรอกลงเอกสารทันที" },
        { icon: "CheckCircle", title: "ระบบตรวจสถานะเอกสาร", description: "ติดตามสถานะ Draft, Sent, Approved, Paid ได้อย่างชัดเจน" },
      ],
      gallery: [
        { imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop", altText: "Quotation Preview", caption: "หน้าจอสร้างใบเสนอราคาและคำนวณตัวเลขอัตโนมัติ" },
      ],
    },
    {
      id: "prod-3",
      name: "AutoTag Shopify",
      slug: "autotag-shopify",
      shortDescription: "ระบบจัดหมวดหมู่และติด Tag สินค้าบน Shopify อัตโนมัติด้วย AI และเงื่อนไขที่กำหนดเอง",
      fullDescription: "AutoTag Shopify แก้ปัญหาให้ร้านค้าที่มีสินค้าจำนวนหลายร้อยหลายพันรายการ ระบบจะช่วยวิเคราะห์ชื่อ รายละเอียด และคุณสมบัติของสินค้า จากนั้นทำการเพิ่ม Tag, จัด Collection และอัปเดตข้อมูลบน Shopify Store โดยอัตโนมัติ ช่วยลดเวลาทำงานลงกว่า 90%",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      productType: "product" as const,
      status: "published" as const,
      pricingType: "subscription" as const,
      price: 199,
      originalPrice: 350,
      currency: "THB",
      billingPeriod: "month" as const,
      pricingNote: "ยกเลิกได้ทุกเมื่อ รองรับไม่จำกัดสินค้า",
      isOnSale: true,
      demoEnabled: true,
      demoType: "direct" as const,
      demoUrl: "https://demo.autotag.example.com",
      demoNote: "ทดลองใส่ชื่อและคำอธิบายสินค้า เพื่อดู AI แนะนำ Tag อัตโนมัติ",
      isFeatured: true,
      sortOrder: 3,
      metaTitle: "AutoTag Shopify เครื่องมือติดแท็กสินค้าอัตโนมัติ",
      metaDescription: "ช่วยจัดการ Collection และ Tag สินค้าในร้าน Shopify อัตโนมัติ ลดเวลาจัดหมวดหมู่สินค้าใหม่",
      categories: ["cat-1", "cat-3"],
      badges: ["Popular", "Live Demo"],
      problems: [
        "มีสินค้าใหม่เข้าเรื่อยๆ ต้องมานั่งเปิดทีละชิ้นเพื่อพิมพ์ Tag ซ้ำๆ",
        "สะกด Tag ผิด ทำให้สินค้าไม่เข้า Smart Collection ตามที่ตั้งไว้",
        "สินค้าหลายพันรายการ ขาดการจัดหมวดหมู่ที่ละเอียดทำให้ลูกค้าค้นหายาก",
      ],
      features: [
        { icon: "Zap", title: "AI Keyword & Tag Extraction", description: "ดึงคำสำคัญ สี ขนาด สไตล์ จากรายละเอียดสินค้ามาสร้าง Tag แม่นยำ" },
        { icon: "Workflow", title: "Custom Rule Engine", description: "ตั้งกฎเงื่อนไข เช่น ถ้าราคา > 1000 ให้ติด Tag 'Premium' อัตโนมัติ" },
        { icon: "RefreshCw", title: "Sync Real-time กับ Shopify", description: "เชื่อมต่อผ่าน Shopify API ซิงก์ข้อมูลสองทางรวดเร็วและปลอดภัย" },
      ],
      gallery: [
        { imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop", altText: "AutoTag Dashboard", caption: "หน้าระบบตั้งกฎการติดแท็กสินค้าอัตโนมัติ" },
      ],
    },
    {
      id: "prod-4",
      name: "SheetToApp CRM",
      slug: "sheet-to-app-crm",
      shortDescription: "เปลี่ยน Google Sheets ที่รกและช้า ให้กลายเป็น Web App CRM สวยงาม ค้นหาง่าย และกำหนดสิทธิ์ได้",
      fullDescription: "หลายทีมเริ่มต้นเก็บรายชื่อลูกค้าและสถานะงานใน Google Sheets แต่เมื่อข้อมูลเพิ่มขึ้น ไฟล์ก็เริ่มช้า หาของยาก และกลัวคนลบสูตรพัง SheetToApp CRM นำ Google Sheets เดิมของคุณมาเป็น Database แล้วครอบด้วย Web UI ที่สวยงาม ค้นหาข้อมูลได้ในเสี้ยววินาที และล็อกสิทธิ์การเข้าถึงตามบทบาท",
      coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
      productType: "product" as const,
      status: "published" as const,
      pricingType: "starting" as const,
      price: 3900,
      currency: "THB",
      billingPeriod: "one_time" as const,
      pricingNote: "ราคาสุดท้ายขึ้นอยู่กับจำนวนคอลัมน์และ Workflow การทำงานที่ต้องการปรับแต่ง",
      isOnSale: false,
      demoEnabled: true,
      demoType: "account" as const,
      demoUrl: "https://demo.sheetcrm.example.com",
      demoUsername: "sales@company.com",
      demoPassword: "crmpassword123",
      demoNote: "เข้าทดลองเพิ่มข้อมูลลูกค้า ค้นหาแบบ Real-time และดูมุมมอง Kanban Board",
      isFeatured: true,
      sortOrder: 4,
      metaTitle: "SheetToApp CRM เปลี่ยนตาราง Google Sheets เป็นระบบจัดการลูกค้า",
      metaDescription: "ระบบ CRM ใช้งานง่าย เชื่อมต่อ Google Sheets ใช้งานได้ทันที ค้นหาไว ป้องกันข้อมูลสูญหาย",
      categories: ["cat-2", "cat-5", "cat-6"],
      badges: ["Customizable", "Live Demo"],
      problems: [
        "ตาราง Google Sheets ใหญ่และโหลดช้ามากเมื่อมีข้อมูลเกินพันแถว",
        "พนักงานเผลอกดลบแถวหรือแก้สูตร ทำให้ข้อมูลทั้งทีมเพี้ยน",
        "ไม่สามารถซ่อนข้อมูลสำคัญ (เช่น ต้นทุน) จากบางคนในทีมได้",
        "เปิดดูข้อมูลบนมือถือยากและพิมพ์ผิดช่องบ่อย",
      ],
      features: [
        { icon: "LayoutGrid", title: "มุมมองตาราง & Kanban Board", description: "ดูสถานะลูกค้าแบบ Pipeline ลากย้ายการ์ดได้ลื่นไหล" },
        { icon: "Search", title: "ค้นหาข้อมูล Real-time", description: "ค้นหาชื่อ เบอร์ หรือประวัติได้ในเสี้ยววินาที ไม่ต้องรอโหลดชีต" },
        { icon: "Shield", title: "กำหนดสิทธิ์ผู้ใช้งาน (Role Permission)", description: "แบ่งสิทธิ์ระหว่าง Admin และ Sales มองเห็นเฉพาะข้อมูลที่ได้รับอนุญาต" },
        { icon: "Database", title: "ซิงก์ข้อมูลกลับ Google Sheet", description: "ข้อมูลยังคงถูกบันทึกสำรองใน Google Sheets ของบริษัทคุณเสมอ" },
      ],
      gallery: [
        { imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop", altText: "CRM Board View", caption: "มุมมอง Pipeline ติดตามสถานะงานของลูกค้า" },
      ],
    },
    {
      id: "prod-5",
      name: "SlipVerify Bot",
      slug: "slip-verify-bot",
      shortDescription: "ระบบตรวจสลิปโอนเงินธนาคารอัตโนมัติ เช็คยอด เช็คสลิปซ้ำ และแจ้งเตือนเข้ากลุ่ม LINE ทันที",
      fullDescription: "จบปัญหาการเสียเวลามานั่งเทียบสลิปโอนเงินกับรายการเดินบัญชี SlipVerify Bot จะทำการสแกน QR Code บนสลิป ตรวจสอบความถูกต้องกับธนาคาร ป้องกันการใช้สลิปปลอมหรือสลิปใช้ซ้ำ พร้อมสรุปยอดและส่งการแจ้งเตือนไปยังห้องแชท LINE Notify หรือ Webhook ของระบบคุณทันที",
      coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
      productType: "product" as const,
      status: "published" as const,
      pricingType: "fixed" as const,
      price: 1200,
      originalPrice: 1990,
      currency: "THB",
      billingPeriod: "one_time" as const,
      pricingNote: "ติดตั้งบนเซิร์ฟเวอร์หรือเชื่อมต่อระบบเดิมของคุณได้ทันที",
      isOnSale: true,
      demoEnabled: true,
      demoType: "direct" as const,
      demoUrl: "https://demo.slipverify.example.com",
      demoNote: "ลองอัปโหลดภาพสลิปตัวอย่าง เพื่อดูการตรวจจับข้อมูลและแจ้งเตือน",
      isFeatured: true,
      sortOrder: 5,
      metaTitle: "SlipVerify Bot ระบบตรวจสลิปโอนเงินอัตโนมัติ ป้องกันสลิปปลอม",
      metaDescription: "ระบบตรวจจับ QR สลิปโอนเงินธนาคาร เช็คยอดตรง ไม่ซ้ำ แจ้งเตือนเข้า LINE ทันที",
      categories: ["cat-1", "cat-3", "cat-5"],
      badges: ["Live Demo", "Popular"],
      problems: [
        "แอดมินต้องคอยเพ่งตาดูสลิปโอนเงินทีละใบ เสียเวลาตอบลูกค้าช้า",
        "เคยเจอลูกค้านำสลิปเก่าที่เคยส่งแล้วมาส่งซ้ำ หรือตัดต่อตัวเลขสลิป",
        "ยอดโอนนอกเวลาทำการไม่มีคนตรวจ ทำให้ส่งของให้ลูกค้าล่าช้า",
      ],
      features: [
        { icon: "ShieldCheck", title: "ตรวจ QR Code ธนาคารจริง", description: "ดึงข้อมูลจาก QR Code บนสลิปและตรวจสอบความถูกต้องแบบแม่นยำ" },
        { icon: "AlertTriangle", title: "ระบบป้องกันสลิปซ้ำ 100%", description: "จดจำรหัสอ้างอิงของทุกสลิป หากมีคนส่งซ้ำระบบจะแจ้งเตือนทันที" },
        { icon: "Bell", title: "แจ้งเตือน LINE Notify ทันที", description: "ส่งข้อความสรุปชื่อผู้โอน ยอดเงิน และเวลาโอนเข้ากลุ่มแชทอัตโนมัติ" },
      ],
      gallery: [
        { imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop", altText: "Slip Verification", caption: "หน้าจอตรวจสอบสลิปและประวัติการตรวจสอบย้อนหลัง" },
      ],
    },
    {
      id: "prod-6",
      name: "SupportTicket Lite",
      slug: "support-ticket-lite",
      shortDescription: "กล่องรับเรื่องร้องเรียนและสอบถามปัญหาของลูกค้า รวมทุกช่องทางไว้ที่เดียว ไม่ตกหล่น",
      fullDescription: "SupportTicket Lite คือระบบ Helpdesk ขนาดกะทัดรัดที่ออกแบบมาเพื่อให้ทีมเล็กๆ สามารถรับเรื่อง ติดตามสถานะการแก้ปัญหา และมอบหมายงานให้คนในทีมได้อย่างเป็นระบบโดยไม่ต้องจ่ายค่า Software แพงๆ รายเดือน",
      coverImage: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1200&auto=format&fit=crop",
      productType: "product" as const,
      status: "published" as const,
      pricingType: "free" as const,
      price: 0,
      currency: "THB",
      billingPeriod: "one_time" as const,
      pricingNote: "ฟรีสำหรับทีมขนาดเล็ก หรือเลือกปรับแต่งเพิ่มเติมตามต้องการ",
      isOnSale: false,
      demoEnabled: true,
      demoType: "direct" as const,
      demoUrl: "https://demo.supportticket.example.com",
      demoNote: "เข้าทดลองส่งแบบฟอร์มแจ้งปัญหา และสลับไปดูหน้าจอของทีมซัพพอร์ต",
      isFeatured: true,
      sortOrder: 6,
      metaTitle: "SupportTicket Lite ระบบรับเรื่องและติดตามงานซัพพอร์ต",
      metaDescription: "ระบบ Helpdesk สำหรับธุรกิจขนาดเล็ก ติดตามเคสลูกค้าได้ทุกเรื่อง ไม่ตกหล่น",
      categories: ["cat-4", "cat-5", "cat-6"],
      badges: ["Ready to Use", "Live Demo"],
      problems: [
        "ลูกค้าทักมาหลายทาง ทั้งแชท โทร ไลน์ ทำให้งานตกหล่นไม่มีคนตามเรื่อง",
        "ไม่รู้ว่าปัญหาไหนใครกำลังแก้อยู่ เกิดการทำงานซ้ำซ้อน",
        "ไม่มีประวัติการพูดคุยกับลูกค้า ทำให้ต้องถามคำถามเดิมซ้ำๆ",
      ],
      features: [
        { icon: "Inbox", title: "รวมทุกคำถามไว้ใน Inbox เดียว", description: "หน้าจอรวม Ticket ทุกรายการ พร้อมระบบค้นหาและแท็กประเภทเรื่อง" },
        { icon: "UserCheck", title: "มอบหมายงานให้คนในทีม", description: "ส่งต่อเคสให้ผู้รับผิดชอบโดยตรง พร้อมระบบโน้ตภายในทีม" },
        { icon: "Clock", title: "บันทึกประวัติการช่วยเหลือ", description: "เก็บบันทึกการสนทนาและการแก้ปัญหาย้อนหลังทั้งหมดอย่างปลอดภัย" },
      ],
      gallery: [
        { imageUrl: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1200&auto=format&fit=crop", altText: "Ticket Inbox", caption: "ศูนย์รวมเรื่องสอบถามและติดตามสถานะงาน" },
      ],
    },
  ];

  for (const p of sampleProducts) {
    const { categories: catIds, badges, problems, features, gallery, ...prodData } = p;
    await db.insert(schema.products).values(prodData);

    for (const catId of catIds) {
      await db.insert(schema.productCategories).values({
        id: `pc-${p.id}-${catId}`,
        productId: p.id,
        categoryId: catId,
      });
    }

    for (const badge of badges) {
      await db.insert(schema.productBadges).values({
        id: `pb-${p.id}-${badge.replace(/\s+/g, '-').toLowerCase()}`,
        productId: p.id,
        badge,
      });
    }

    let problemOrder = 1;
    for (const text of problems) {
      await db.insert(schema.productProblems).values({
        id: `prob-${p.id}-${problemOrder}`,
        productId: p.id,
        text,
        sortOrder: problemOrder++,
      });
    }

    let featureOrder = 1;
    for (const feat of features) {
      await db.insert(schema.productFeatures).values({
        id: `feat-${p.id}-${featureOrder}`,
        productId: p.id,
        icon: feat.icon,
        title: feat.title,
        description: feat.description,
        sortOrder: featureOrder++,
      });
    }

    let galleryOrder = 1;
    for (const item of gallery) {
      await db.insert(schema.productGallery).values({
        id: `gal-${p.id}-${galleryOrder}`,
        productId: p.id,
        imageUrl: item.imageUrl,
        altText: item.altText,
        caption: item.caption,
        sortOrder: galleryOrder++,
      });
    }
  }

  // 6. Sample Leads
  await db.insert(schema.leads).values({
    id: "lead-1",
    name: "คุณสมชาย ใจดี",
    company: "ร้านอาหารบ้านสวน",
    email: "somchai@baansuan.com",
    phone: "089-111-2233",
    lineId: "somchai_bs",
    productId: "prod-1",
    productName: "EasyMenu",
    budget: "฿5,000 – ฿10,000",
    message: "สนใจนำระบบ EasyMenu ไปใช้ที่ร้าน มีประมาณ 25 โต๊ะ ต้องการให้ช่วยปรับแต่งหน้าตาให้ตรงกับธีมร้านครับ",
    sourceUrl: "/products/easymenu",
    status: "New",
  });

  await db.insert(schema.leads).values({
    id: "lead-2",
    name: "คุณวิภาวรรณ เลิศวิริยะ",
    company: "Studio Craft Decor",
    email: "wipawan@studiocraft.co",
    phone: "081-999-8877",
    lineId: "wipa_craft",
    productId: "prod-3",
    productName: "AutoTag Shopify",
    budget: "฿10,001 – ฿30,000",
    message: "ต้องการให้ระบบช่วยซิงก์สินค้าและสร้างแท็กตามประเภทวัสดุและขนาดอัตโนมัติบน Shopify ค่ะ",
    sourceUrl: "/products/autotag-shopify",
    status: "Contacted",
  });

  console.log("✅ Database seeded successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
