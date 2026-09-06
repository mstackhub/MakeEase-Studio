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
  console.log("🚀 Upgrading Turso Cloud tables to match exact schema...");

  // Drop old tables to ensure clean exact structure
  const dropTables = [
    "product_categories", "product_badges", "product_problems", 
    "product_features", "product_gallery", "leads", "products", 
    "categories", "admins", "settings"
  ];
  for (const tbl of dropTables) {
    await executeSQL(`DROP TABLE IF EXISTS ${tbl};`);
  }

  // 1. admins
  await executeSQL(`CREATE TABLE admins (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Admin',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // 2. categories
  await executeSQL(`CREATE TABLE categories (
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

  // 3. products
  await executeSQL(`CREATE TABLE products (
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
  );`);

  // 4. product_categories
  await executeSQL(`CREATE TABLE product_categories (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE
  );`);

  // 5. product_badges
  await executeSQL(`CREATE TABLE product_badges (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    badge TEXT NOT NULL
  );`);

  // 6. product_problems
  await executeSQL(`CREATE TABLE product_problems (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // 7. product_features
  await executeSQL(`CREATE TABLE product_features (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    icon TEXT DEFAULT 'CheckCircle2',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // 8. product_gallery
  await executeSQL(`CREATE TABLE product_gallery (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // 9. leads
  await executeSQL(`CREATE TABLE leads (
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
  );`);

  // 10. settings
  await executeSQL(`CREATE TABLE settings (
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

  // Insert Admin
  console.log("Inserting Admin user...");
  const passwordHash = await bcrypt.hash("adminpassword123", 10);
  await executeSQL(`INSERT INTO admins (id, email, password_hash, name)
    VALUES ('admin-1', 'admin@example.com', '${passwordHash}', 'System Admin');`);

  // Insert Settings
  console.log("Inserting Settings default...");
  await executeSQL(`INSERT INTO settings (id, site_name, site_description, default_seo_title, default_seo_description, footer_text)
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
    await executeSQL(`INSERT INTO categories (id, name, slug, description, icon, sort_order)
      VALUES ('${c.id}', '${c.name}', '${c.slug}', '${c.description}', '${c.icon}', ${c.sortOrder});`);
  }

  // Insert Sample Products
  console.log("Inserting Sample Products...");
  const sampleProducts = [
    {
      id: "prod-1",
      name: "EasyMenu — Digital QR Menu & Ordering",
      slug: "easymenu",
      short_description: "ระบบเมนูอาหาร QR Code สำหรับร้านอาหาร คาเฟ่ สแกนดูเมนูและสั่งอาหารได้ทันที ไม่ต้องโหลดแอป",
      full_description: "เปลี่ยนเมนูกระดาษเดิมๆ ให้เป็น Digital Menu ที่อัปเดตราคาและรูปภาพได้ทันที ลูกค้าสแกนสั่งจากโต๊ะ คิดเงินถูกต้อง ครัวได้รับออเดอร์เรียลไทม์",
      cover_image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
      pricing_type: "subscription",
      price: 590,
      original_price: 890,
      billing_period: "month",
      is_on_sale: 1,
      demo_enabled: 1,
      demo_type: "direct",
      demo_url: "https://example.com/demo/easymenu",
      is_featured: 1,
      sort_order: 1
    },
    {
      id: "prod-2",
      name: "QuickQuotation — ออกใบเสนอราคาใน 1 นาที",
      slug: "quickquotation",
      short_description: "เครื่องมือสร้างใบเสนอราคาและใบแจ้งหนี้แบบมืออาชีพ คำนวณ VAT และส่วนลดอัตโนมัติ ส่งเป็น PDF หรือลิงก์ได้ทันที",
      full_description: "เลิกเสียเวลากับการจัดฟอร์แมต Excel ทีละหน้า QuickQuotation ช่วยให้คุณเลือกสินค้าและบริการ ใส่ส่วนลด คำนวณภาษีหัก ณ ที่จ่าย และออก PDF ส่งให้ลูกค้าได้ภายใน 60 วินาที",
      cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      pricing_type: "fixed",
      price: 2900,
      billing_period: "one_time",
      demo_enabled: 1,
      demo_type: "account",
      demo_url: "https://example.com/demo/quickquotation",
      demo_username: "demo@quickquote.com",
      demo_password: "demopassword",
      demo_note: "ทดลองสร้างใบเสนอราคาใหม่ และกดดาวน์โหลดไฟล์ PDF ตัวอย่างได้เลยครับ",
      is_featured: 1,
      sort_order: 2
    },
    {
      id: "prod-3",
      name: "AutoTag AI for Shopify & E-Commerce",
      slug: "autotag-shopify",
      short_description: "ระบบ AI ช่วยติดแท็กและจัดหมวดหมู่สินค้าอัตโนมัติ สำหรับร้านค้าออนไลน์ ช่วยให้ลูกค้าค้นหาสินค้าง่ายขึ้น",
      full_description: "เมื่อร้านมีสินค้าหลักร้อยรายการ การติดแท็กทีละตัวใช้เวลาหลายวัน AutoTag AI ช่วยวิเคราะห์ชื่อและคำอธิบายสินค้า แล้วใส่ Tags + SEO Attributes ให้โดยอัตโนมัติในไม่กี่วินาที",
      cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      pricing_type: "subscription",
      price: 890,
      billing_period: "month",
      demo_enabled: 1,
      demo_type: "direct",
      demo_url: "https://example.com/demo/autotag",
      is_featured: 1,
      sort_order: 3
    },
    {
      id: "prod-4",
      name: "SheetToApp CRM — Mini Sales CRM จาก Google Sheets",
      slug: "sheettoapp-crm",
      short_description: "เปลี่ยน Google Sheets ที่รกๆ ให้กลายเป็น Sales Pipeline CRM หน้าตาสะอาดตา จัดการดีลง่าย ทีมไม่หลุด Follow-up",
      full_description: "ใช้ Google Sheets เป็นฐานข้อมูลหลังบ้านตามเดิม แต่หน้าบ้านใช้งานผ่าน Web App ที่มี Kanban Board ลากสถานะดีล ดูประวัติการคุย และแจ้งเตือนวันนัดหมาย",
      cover_image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=1200&auto=format&fit=crop",
      pricing_type: "starting",
      price: 4900,
      billing_period: "one_time",
      demo_enabled: 1,
      demo_type: "account",
      demo_url: "https://example.com/demo/sheettoapp",
      demo_username: "sales@sheettoapp.com",
      demo_password: "demopassword",
      is_featured: 1,
      sort_order: 4
    },
    {
      id: "prod-5",
      name: "SlipVerify Bot — ตรวจสลิปโอนเงินอัตโนมัติ",
      slug: "slipverify-bot",
      short_description: "ระบบ AI OCR ตรวจสลิปธนาคาร เช็คยอดเงิน บัญชี และเวลาโอน ป้องกันสลิปปลอมหรือสลิปใช้ซ้ำ สำหรับ LINE OA และเว็บ",
      full_description: "ลดเวลาแอดมินนั่งเช็คยอดในแอปธนาคาร ระบบอ่านข้อมูลจาก QR Code ในสลิป ตรวจสอบกับข้อมูลธนาคารจริง พร้อมส่งข้อความยืนยันคำสั่งซื้อให้ลูกค้าอัตโนมัติ",
      cover_image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop",
      pricing_type: "subscription",
      price: 490,
      billing_period: "month",
      demo_enabled: 1,
      demo_type: "direct",
      demo_url: "https://example.com/demo/slipverify",
      is_featured: 1,
      sort_order: 5
    },
    {
      id: "prod-6",
      name: "SupportTicket Lite — ระบบรวมแชทและเปิดเคสช่วยเหลือ",
      slug: "supportticket-lite",
      short_description: "กล่องข้อความกลางสำหรับทีมซัพพอร์ต รวมแชทจาก LINE, Facebook, และแบบฟอร์มหน้าเว็บ ไม่พลาดทุกปัญหาของลูกค้า",
      full_description: "เครื่องมือ Helpdesk ขนาดกะทัดรัดสำหรับทีม 3-10 คน มอบหมายงานให้คนในทีม โน้ตข้อมูลภายใน และติดตามสถานะจนกว่าปัญหาจะแก้ไขเสร็จ",
      cover_image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1200&auto=format&fit=crop",
      pricing_type: "starting",
      price: 1200,
      billing_period: "month",
      demo_enabled: 1,
      demo_type: "direct",
      demo_url: "https://example.com/demo/supportticket",
      is_featured: 1,
      sort_order: 6
    }
  ];

  for (const p of sampleProducts) {
    await executeSQL(`INSERT INTO products (
      id, name, slug, short_description, full_description, cover_image, 
      pricing_type, price, original_price, billing_period, is_on_sale, 
      demo_enabled, demo_type, demo_url, demo_username, demo_password, demo_note, 
      is_featured, sort_order
    ) VALUES (
      '${p.id}', '${p.name}', '${p.slug}', '${p.short_description}', '${p.full_description}', '${p.cover_image}',
      '${p.pricing_type}', ${p.price}, ${p.original_price || 'NULL'}, '${p.billing_period}', ${p.is_on_sale || 0},
      ${p.demo_enabled}, '${p.demo_type}', '${p.demo_url}', ${p.demo_username ? `'${p.demo_username}'` : 'NULL'}, 
      ${p.demo_password ? `'${p.demo_password}'` : 'NULL'}, ${p.demo_note ? `'${p.demo_note}'` : 'NULL'}, 
      ${p.is_featured}, ${p.sort_order}
    );`);
  }

  // Insert Badges & Categories Mapping
  const catMap = [
    { id: "pc-1", product_id: "prod-1", category_id: "cat-1" },
    { id: "pc-2", product_id: "prod-2", category_id: "cat-2" },
    { id: "pc-3", product_id: "prod-3", category_id: "cat-1" },
    { id: "pc-4", product_id: "prod-4", category_id: "cat-2" },
    { id: "pc-5", product_id: "prod-5", category_id: "cat-3" },
    { id: "pc-6", product_id: "prod-6", category_id: "cat-4" },
  ];
  for (const pc of catMap) {
    await executeSQL(`INSERT INTO product_categories (id, product_id, category_id) VALUES ('${pc.id}', '${pc.product_id}', '${pc.category_id}');`);
  }

  const badges = [
    { id: "b-1", product_id: "prod-1", badge: "Ready to Use" },
    { id: "b-2", product_id: "prod-1", badge: "Live Demo" },
    { id: "b-3", product_id: "prod-2", badge: "Ready to Use" },
    { id: "b-4", product_id: "prod-2", badge: "Live Demo" },
    { id: "b-5", product_id: "prod-3", badge: "AI Powered" },
    { id: "b-6", product_id: "prod-4", badge: "Customizable" },
    { id: "b-7", product_id: "prod-5", badge: "Automation" },
    { id: "b-8", product_id: "prod-6", badge: "Customer Care" },
  ];
  for (const b of badges) {
    await executeSQL(`INSERT INTO product_badges (id, product_id, badge) VALUES ('${b.id}', '${b.product_id}', '${b.badge}');`);
  }

  // Problems
  const problems = [
    { id: "prob-1", product_id: "prod-1", text: "ลูกค้าต้องรอพนักงานมารับออเดอร์นานในช่วงเวลาเร่งด่วน", sort_order: 1 },
    { id: "prob-2", product_id: "prod-1", text: "เมนูกระดาษชำรุดง่าย และพิมพ์ใหม่ทุกครั้งที่มีการเปลี่ยนราคาหรือเมนู", sort_order: 2 },
    { id: "prob-3", product_id: "prod-2", text: "การจัดฟอร์แมตใบเสนอราคาใน Excel กินเวลาคนละ 15-30 นาที", sort_order: 1 },
    { id: "prob-4", product_id: "prod-2", text: "รูปแบบเอกสารไม่ตรงกัน และเสี่ยงต่อการใส่สูตรคำนวณภาษีผิด", sort_order: 2 },
  ];
  for (const prob of problems) {
    await executeSQL(`INSERT INTO product_problems (id, product_id, text, sort_order) VALUES ('${prob.id}', '${prob.product_id}', '${prob.text}', ${prob.sort_order});`);
  }

  // Features
  const features = [
    { id: "f-1", product_id: "prod-1", icon: "QrCode", title: "สแกน QR Code เปิดดูได้ทันที", description: "เปิดผ่าน Browser มือถือได้ทันที ไม่ต้องดาวน์โหลดหรือลงแอปใดๆ", sort_order: 1 },
    { id: "f-2", product_id: "prod-1", icon: "ToggleRight", title: "เปิด-ปิด เมนูหมดได้เรียลไทม์", description: "จัดการสต็อกและปรับเปลี่ยนราคาได้จากมือถือทันที", sort_order: 2 },
    { id: "f-3", product_id: "prod-2", icon: "FileText", title: "เลือกรายการสินค้าคลิกเดียว", description: "ดึงรายการสินค้า ราคามาตรฐาน และคำนวณยอดรวมให้อัตโนมัติ", sort_order: 1 },
    { id: "f-4", product_id: "prod-2", icon: "Calculator", title: "คำนวณ VAT & หัก ณ ที่จ่าย", description: "คำนวณภาษีและส่วนลดแบบแม่นยำ หมดกังวลเรื่องสูตรผิด", sort_order: 2 },
  ];
  for (const f of features) {
    await executeSQL(`INSERT INTO product_features (id, product_id, icon, title, description, sort_order) VALUES ('${f.id}', '${f.product_id}', '${f.icon}', '${f.title}', '${f.description}', ${f.sort_order});`);
  }

  console.log("Checking all created tables...");
  const tables = await executeSQL(`SELECT name FROM sqlite_master WHERE type='table';`);
  console.log("✅ Tables in Turso:", tables.rows.map(r => r[0].value));

  console.log("Checking admin query...");
  const adminCheck = await executeSQL(`SELECT * FROM admins WHERE email='admin@example.com';`);
  console.log("✅ Admin found in Turso:", adminCheck.rows.length > 0);

  console.log("🎉 Complete setup and seed to Turso Cloud finished successfully!");
}

run().catch(console.error);
