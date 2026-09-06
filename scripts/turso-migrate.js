const https = require("https");
const bcrypt = require("bcryptjs");

const token = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODg2OTk2MDcsImlkIjoiMDFhMDcwOGYtNTUwMS03NmQ1LWEwODItMTM3N2IyNDQ4MjlkIiwia2lkIjoiU1ZYRTc1Vy1QcHV4aWQ2RXJ6WlRRTzVNLW5OeVBzX0RjSm5qa0ZycXZ0YyIsInJpZCI6IjY0YzYxNTVkLTUyZjUtNGNmYi04OWVjLWEyOGUxZWQxNjY3YSJ9.wLVJPmI-f658LMhO6hE3sPLo5O8WDNtejK0f-C-jrzR0auwt-y2cpNwtAH-e0eRQTck2wernT80qkqPOJjuBDQ";

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: "makeease-studio-mstackhub.aws-ap-northeast-1.turso.io",
      path: "/v2/pipeline",
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    }, (res) => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => {
        try {
          const data = JSON.parse(body);
          if (data.results && data.results[0] && data.results[0].type === "ok") {
            resolve(data.results[0].response.result);
          } else if (data.results && data.results[0] && data.results[0].type === "error") {
            reject(new Error(data.results[0].error.message));
          } else {
            resolve(data);
          }
        } catch (e) {
          reject(new Error("Failed to parse: " + body));
        }
      });
    });
    req.on("error", reject);
    req.write(JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql } }
      ]
    }));
    req.end();
  });
}

async function run() {
  console.log("🚀 Starting direct migration to Turso Cloud...");

  // 1. Create admins table
  console.log("Creating table: admins...");
  await executeSQL(`CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Admin',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // 2. Create categories table
  console.log("Creating table: categories...");
  await executeSQL(`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT 'Folder',
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // 3. Create products table
  console.log("Creating table: products...");
  await executeSQL(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT,
    cover_image TEXT NOT NULL,
    product_type TEXT DEFAULT 'product',
    status TEXT DEFAULT 'published',
    pricing_type TEXT DEFAULT 'fixed',
    price REAL,
    original_price REAL,
    currency TEXT DEFAULT 'THB',
    billing_period TEXT,
    pricing_note TEXT,
    is_on_sale INTEGER DEFAULT 0,
    demo_enabled INTEGER DEFAULT 0,
    demo_type TEXT DEFAULT 'direct',
    demo_url TEXT,
    demo_username TEXT,
    demo_password TEXT,
    demo_notes TEXT,
    meta_title TEXT,
    meta_description TEXT,
    og_image TEXT,
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // 4. Create related product tables
  console.log("Creating table: product_categories...");
  await executeSQL(`CREATE TABLE IF NOT EXISTS product_categories (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE
  );`);

  console.log("Creating table: product_badges...");
  await executeSQL(`CREATE TABLE IF NOT EXISTS product_badges (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    badge_text TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );`);

  console.log("Creating table: product_problems...");
  await executeSQL(`CREATE TABLE IF NOT EXISTS product_problems (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    problem_text TEXT NOT NULL,
    impact_text TEXT,
    sort_order INTEGER DEFAULT 0
  );`);

  console.log("Creating table: product_features...");
  await executeSQL(`CREATE TABLE IF NOT EXISTS product_features (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    badge TEXT,
    icon_name TEXT,
    sort_order INTEGER DEFAULT 0
  );`);

  console.log("Creating table: product_gallery...");
  await executeSQL(`CREATE TABLE IF NOT EXISTS product_gallery (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0
  );`);

  console.log("Creating table: leads...");
  await executeSQL(`CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    line_id TEXT,
    product_interest TEXT,
    budget TEXT,
    message TEXT NOT NULL,
    source_url TEXT,
    status TEXT DEFAULT 'New',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  console.log("Creating table: settings...");
  await executeSQL(`CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    site_name TEXT NOT NULL DEFAULT 'MakeEase Studio',
    site_description TEXT,
    logo TEXT,
    favicon TEXT,
    brand_color TEXT DEFAULT '#2563EB',
    brand_hover_color TEXT DEFAULT '#1D4ED8',
    brand_light_color TEXT DEFAULT '#EFF6FF',
    email TEXT DEFAULT 'contact@makeease.studio',
    phone TEXT DEFAULT '081-234-5678',
    line_url TEXT DEFAULT 'https://line.me/ti/p/~makeeasestudio',
    facebook_url TEXT,
    instagram_url TEXT,
    footer_text TEXT DEFAULT '© 2026 MakeEase Studio. สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง',
    ga_id TEXT,
    default_seo_title TEXT DEFAULT 'MakeEase Studio | สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง',
    default_seo_description TEXT DEFAULT 'MakeEase Studio — สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง (We build simple tools for real problems.)',
    default_og_image TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // Insert Admin account
  console.log("Inserting Admin user...");
  const passwordHash = await bcrypt.hash("adminpassword123", 10);
  await executeSQL(`INSERT OR REPLACE INTO admins (id, email, password_hash, name)
    VALUES ('admin-1', 'admin@example.com', '${passwordHash}', 'System Admin');`);

  // Insert Settings
  console.log("Inserting Settings default...");
  await executeSQL(`INSERT OR REPLACE INTO settings (id, site_name, site_description, default_seo_title, default_seo_description, footer_text)
    VALUES ('default', 'MakeEase Studio', 'สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง (We build simple tools for real problems.)', 'MakeEase Studio | สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง', 'MakeEase Studio — สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง (We build simple tools for real problems.)', '© 2026 MakeEase Studio. สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง');`);

  // Insert Categories
  console.log("Inserting Categories...");
  const categories = [
    { id: "cat-1", name: "E-Commerce", slug: "ecommerce", description: "เครื่องมือสำหรับร้านค้าออนไลน์ เพิ่มยอดขายและจัดการออเดอร์", icon: "ShoppingBag", sortOrder: 1 },
    { id: "cat-2", name: "Business Tools", slug: "business-tools", description: "ระบบจัดการเอกสาร การเงิน และการทำงานในธุรกิจ", icon: "Briefcase", sortOrder: 2 },
    { id: "cat-3", name: "Automation", slug: "automation", description: "ระบบช่วยทำงานอัตโนมัติ ลดงานซ้ำซ้อน", icon: "Zap", sortOrder: 3 },
    { id: "cat-4", name: "Customer Experience", slug: "customer-experience", description: "เครื่องมือยกระดับประสบการณ์และการบริการลูกค้า", icon: "MessageSquare", sortOrder: 4 },
    { id: "cat-5", name: "Internal Tools", slug: "internal-tools", description: "ระบบหลังบ้านและประสานงานภายในทีม", icon: "Boxes", sortOrder: 5 },
    { id: "cat-6", name: "Productivity", slug: "productivity", description: "เครื่องมือเพิ่มความคล่องตัวในการทำงานประจำวัน", icon: "Sparkles", sortOrder: 6 },
  ];
  for (const c of categories) {
    await executeSQL(`INSERT OR REPLACE INTO categories (id, name, slug, description, icon, sort_order)
      VALUES ('${c.id}', '${c.name}', '${c.slug}', '${c.description}', '${c.icon}', ${c.sortOrder});`);
  }

  // Insert Sample Products
  console.log("Inserting Sample Products...");
  const products = [
    {
      id: "prod-1",
      name: "EasyMenu — Digital QR Menu & Ordering",
      slug: "easymenu",
      short_description: "ระบบเมนูอาหาร QR Code สำหรับร้านอาหาร คาเฟ่ สแกนดูเมนูและสั่งอาหารได้ทันที ไม่ต้องโหลดแอป",
      cover_image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
      pricing_type: "subscription",
      price: 590,
      billing_period: "month",
      demo_enabled: 1,
      demo_type: "direct",
      demo_url: "https://example.com/demo/easymenu",
      featured: 1,
      sort_order: 1
    },
    {
      id: "prod-2",
      name: "QuickQuotation — ออกใบเสนอราคาใน 1 นาที",
      slug: "quickquotation",
      short_description: "เครื่องมือสร้างใบเสนอราคาและใบแจ้งหนี้แบบมืออาชีพ คำนวณ VAT และส่วนลดอัตโนมัติ ส่งเป็น PDF หรือลิงก์ได้ทันที",
      cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      pricing_type: "fixed",
      price: 2900,
      billing_period: "one_time",
      demo_enabled: 1,
      demo_type: "account",
      demo_url: "https://example.com/demo/quickquotation",
      demo_username: "demo@quickquote.com",
      demo_password: "demopassword",
      featured: 1,
      sort_order: 2
    },
    {
      id: "prod-3",
      name: "AutoTag AI for Shopify & E-Commerce",
      slug: "autotag-shopify",
      short_description: "ระบบ AI ช่วยติดแท็กและจัดหมวดหมู่สินค้าอัตโนมัติ สำหรับร้านค้าออนไลน์ ช่วยให้ลูกค้าค้นหาสินค้าง่ายขึ้น",
      cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      pricing_type: "subscription",
      price: 890,
      billing_period: "month",
      demo_enabled: 1,
      demo_type: "direct",
      demo_url: "https://example.com/demo/autotag",
      featured: 1,
      sort_order: 3
    }
  ];

  for (const p of products) {
    await executeSQL(`INSERT OR REPLACE INTO products (id, name, slug, short_description, cover_image, pricing_type, price, billing_period, demo_enabled, demo_type, demo_url, demo_username, demo_password, featured, sort_order)
      VALUES ('${p.id}', '${p.name}', '${p.slug}', '${p.short_description}', '${p.cover_image}', '${p.pricing_type}', ${p.price}, '${p.billing_period}', ${p.demo_enabled}, '${p.demo_type}', '${p.demo_url}', ${p.demo_username ? `'${p.demo_username}'` : 'NULL'}, ${p.demo_password ? `'${p.demo_password}'` : 'NULL'}, ${p.featured}, ${p.sort_order});`);
  }

  console.log("Checking created tables...");
  const tables = await executeSQL(`SELECT name FROM sqlite_master WHERE type='table';`);
  console.log("✅ Tables in Turso:", tables.rows.map(r => r[0].value));

  console.log("Checking admins table count...");
  const adminCount = await executeSQL(`SELECT count(*) FROM admins;`);
  console.log("✅ Admins count in Turso:", adminCount.rows[0][0].value);

  console.log("🎉 Migration to Turso Cloud completed successfully!");
}

run().catch(console.error);
