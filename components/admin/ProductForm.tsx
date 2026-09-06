"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Play,
  HelpCircle,
  Tag,
  DollarSign,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/db/schema";
import { FullProduct } from "@/lib/db-queries";

interface ProductFormProps {
  initialProduct?: FullProduct | null;
  categories: Category[];
}

const AVAILABLE_BADGES = [
  "Live Demo",
  "Ready to Use",
  "Customizable",
  "New",
  "Popular",
  "Beta",
  "Case Study",
];

const AVAILABLE_ICONS = [
  "CheckCircle2",
  "QrCode",
  "Layers",
  "Image",
  "ToggleRight",
  "Smartphone",
  "FileText",
  "Calculator",
  "Users",
  "CheckCircle",
  "Zap",
  "Workflow",
  "RefreshCw",
  "LayoutGrid",
  "Search",
  "Shield",
  "Database",
  "ShieldCheck",
  "AlertTriangle",
  "Bell",
  "Inbox",
  "UserCheck",
  "Clock",
];

export function ProductForm({ initialProduct, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialProduct;

  const [activeTab, setActiveTab] = useState<"basic" | "problems" | "features" | "gallery" | "pricing" | "demo" | "seo">("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    id: initialProduct?.id || "",
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    shortDescription: initialProduct?.shortDescription || "",
    fullDescription: initialProduct?.fullDescription || "",
    coverImage: initialProduct?.coverImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    productType: initialProduct?.productType || "product",
    status: initialProduct?.status || "published",
    isFeatured: initialProduct?.isFeatured ?? false,
    sortOrder: initialProduct?.sortOrder ?? 0,

    // Categories & Badges
    categoryIds: initialProduct?.categories.map((c) => c.id) || [categories[0]?.id || ""],
    badges: initialProduct?.badges || ["Ready to Use"],

    // Pricing
    pricingType: initialProduct?.pricingType || "fixed",
    price: initialProduct?.price ?? 990,
    originalPrice: initialProduct?.originalPrice ?? null,
    currency: initialProduct?.currency || "THB",
    billingPeriod: initialProduct?.billingPeriod || "one_time",
    pricingNote: initialProduct?.pricingNote || "",
    isOnSale: initialProduct?.isOnSale ?? false,

    // Demo
    demoEnabled: initialProduct?.demoEnabled ?? true,
    demoType: initialProduct?.demoType || "direct",
    demoUrl: initialProduct?.demoUrl || "",
    demoUsername: initialProduct?.demoUsername || "",
    demoPassword: initialProduct?.demoPassword || "",
    demoNote: initialProduct?.demoNote || "",

    // CTAs
    primaryCtaLabel: initialProduct?.primaryCtaLabel || "",
    primaryCtaUrl: initialProduct?.primaryCtaUrl || "",
    secondaryCtaLabel: initialProduct?.secondaryCtaLabel || "",
    secondaryCtaUrl: initialProduct?.secondaryCtaUrl || "",

    // SEO
    metaTitle: initialProduct?.metaTitle || "",
    metaDescription: initialProduct?.metaDescription || "",
    focusKeyword: initialProduct?.focusKeyword || "",
    ogImage: initialProduct?.ogImage || "",
    canonicalUrl: initialProduct?.canonicalUrl || "",
    isIndexable: initialProduct?.isIndexable ?? true,

    // Problems
    problems: initialProduct?.problems.map((p) => p.text) || [
      "ใช้เวลาทำงานซ้ำๆ หลายขั้นตอน",
      "ระบบเดิมซับซ้อนเกินความจำเป็น",
    ],

    // Features
    features: initialProduct?.features.map((f) => ({
      icon: f.icon || "CheckCircle2",
      title: f.title,
      description: f.description,
    })) || [
      { icon: "CheckCircle2", title: "ใช้งานง่าย", description: "ออกแบบมาเพื่อความคล่องตัว" },
    ],

    // Gallery
    gallery: initialProduct?.gallery.map((g) => ({
      imageUrl: g.imageUrl,
      altText: g.altText || "",
      caption: g.caption || "",
    })) || [],
  });

  // Auto slug generation from name
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !isEditing ? name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : prev.slug,
    }));
  };

  // Badges Toggle
  const toggleBadge = (badge: string) => {
    setFormData((prev) => {
      const exists = prev.badges.includes(badge);
      return {
        ...prev,
        badges: exists ? prev.badges.filter((b) => b !== badge) : [...prev.badges, badge],
      };
    });
  };

  // Category Toggle
  const toggleCategory = (catId: string) => {
    setFormData((prev) => {
      const exists = prev.categoryIds.includes(catId);
      return {
        ...prev,
        categoryIds: exists ? prev.categoryIds.filter((id) => id !== catId) : [...prev.categoryIds, catId],
      };
    });
  };

  // Problem items handlers
  const addProblem = () => {
    setFormData((prev) => ({ ...prev, problems: [...prev.problems, ""] }));
  };
  const updateProblem = (idx: number, text: string) => {
    const updated = [...formData.problems];
    updated[idx] = text;
    setFormData((prev) => ({ ...prev, problems: updated }));
  };
  const removeProblem = (idx: number) => {
    setFormData((prev) => ({ ...prev, problems: prev.problems.filter((_, i) => i !== idx) }));
  };

  // Feature items handlers
  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { icon: "CheckCircle2", title: "", description: "" }],
    }));
  };
  const updateFeature = (idx: number, field: "icon" | "title" | "description", val: string) => {
    const updated = [...formData.features];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev) => ({ ...prev, features: updated }));
  };
  const removeFeature = (idx: number) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  // Gallery handlers
  const addGalleryItem = () => {
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, { imageUrl: "", altText: "", caption: "" }],
    }));
  };
  const updateGalleryItem = (idx: number, field: "imageUrl" | "altText" | "caption", val: string) => {
    const updated = [...formData.gallery];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev) => ({ ...prev, gallery: updated }));
  };
  const removeGalleryItem = (idx: number) => {
    setFormData((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("กรุณาระบุชื่อ Product");
      setActiveTab("basic");
      return;
    }
    if (!formData.slug.trim()) {
      setErrorMessage("กรุณาระบุ Slug");
      setActiveTab("basic");
      return;
    }
    if (!formData.shortDescription.trim()) {
      setErrorMessage("กรุณาระบุคำอธิบายสั้น");
      setActiveTab("basic");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการบันทึก");
      }

      setSuccessMessage(isEditing ? "อัปเดตข้อมูล Product สำเร็จ" : "สร้าง Product ใหม่สำเร็จ");
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border shadow-subtle">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 rounded-lg hover:bg-surface-secondary text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              {isEditing ? "EDIT PRODUCT" : "NEW PRODUCT"}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {isEditing ? `แก้ไข: ${formData.name}` : "เพิ่ม Product / Web App ใหม่"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" type="button">
              ยกเลิก
            </Button>
          </Link>
          <Button size="sm" type="submit" disabled={isSubmitting} className="gap-2 shadow-sm font-semibold">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>บันทึก Product</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Alert Notices */}
      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-border">
        {[
          { id: "basic", label: "ข้อมูลพื้นฐาน", icon: Tag },
          { id: "problems", label: "ปัญหาที่ช่วยแก้ (Problems)", icon: HelpCircle },
          { id: "features", label: "ฟีเจอร์ (Features)", icon: CheckCircle2 },
          { id: "gallery", label: "ภาพหน้าจอ (Gallery)", icon: ImageIcon },
          { id: "pricing", label: "ระบบราคา (Pricing)", icon: DollarSign },
          { id: "demo", label: "ระบบ Demo", icon: Play },
          { id: "seo", label: "SEO & Social", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-brand text-white shadow-xs"
                  : "bg-white text-muted-foreground hover:text-foreground hover:bg-surface-secondary border border-border"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BASIC INFO */}
      {activeTab === "basic" && (
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                ชื่อ Product *
              </label>
              <Input
                placeholder="เช่น EasyMenu"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                URL Slug * (เช่น /products/easymenu)
              </label>
              <Input
                placeholder="easymenu"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              คำอธิบายสั้น (Short Description) *
            </label>
            <Input
              placeholder="เมนูออนไลน์สำหรับร้านอาหาร สร้าง จัดการหมวดหมู่ และแชร์ผ่าน QR ได้ทันที"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              คำอธิบายเต็ม / รายละเอียด Solution (Full Description)
            </label>
            <Textarea
              placeholder="อธิบายว่าระบบนี้สร้างขึ้นมาแก้ปัญหาอะไร และช่วยให้ทำงานง่ายขึ้นอย่างไร..."
              rows={5}
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Cover Image URL *
            </label>
            <Input
              placeholder="https://..."
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                สถานะ (Status)
              </label>
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-foreground focus-visible:ring-brand"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="published">Published (เผยแพร่แล้ว)</option>
                <option value="draft">Draft (ฉบับร่าง)</option>
                <option value="archived">Archived (เก็บเข้ากรุ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                ประเภท (Product Type)
              </label>
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-foreground focus-visible:ring-brand"
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value as any })}
              >
                <option value="product">Digital Product</option>
                <option value="portfolio">Portfolio Project</option>
                <option value="case_study">Case Study</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-brand focus:ring-brand"
                />
                <span className="text-xs font-semibold text-foreground">แสดงใน Featured หน้าแรก</span>
              </label>
            </div>
          </div>

          {/* Categories Multi-Select */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              หมวดหมู่ (Categories)
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const checked = formData.categoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      checked
                        ? "bg-brand text-white border-brand"
                        : "bg-surface-secondary text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badges Multi-Select */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Badges ป้ายกำกับ
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_BADGES.map((b) => {
                const checked = formData.badges.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBadge(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      checked
                        ? "bg-foreground text-white border-foreground"
                        : "bg-surface-secondary text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROBLEMS */}
      {activeTab === "problems" && (
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">เคยเจอปัญหาแบบนี้ไหม? (Pain Points)</h3>
              <p className="text-xs text-muted-foreground">รายการปัญหาที่ระบบนี้สร้างขึ้นมาเพื่อแก้</p>
            </div>
            <Button type="button" size="sm" onClick={addProblem} variant="outline" className="gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" />
              เพิ่มข้อปัญหา
            </Button>
          </div>

          <div className="space-y-3">
            {formData.problems.map((prob, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-6 text-center">{idx + 1}.</span>
                <Input
                  placeholder="เช่น ต้องเสียเวลากรอกข้อมูลซ้ำๆ..."
                  value={prob}
                  onChange={(e) => updateProblem(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeProblem(idx)}
                  className="p-2 text-muted-foreground hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEATURES */}
      {activeTab === "features" && (
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">ทำอะไรได้บ้าง (Features)</h3>
              <p className="text-xs text-muted-foreground">ฟังก์ชันการทำงานหลัก พร้อมไอคอนประกอบ</p>
            </div>
            <Button type="button" size="sm" onClick={addFeature} variant="outline" className="gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" />
              เพิ่มฟีเจอร์
            </Button>
          </div>

          <div className="space-y-4">
            {formData.features.map((feat, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand">Feature #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>ลบ</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Icon</label>
                    <select
                      className="flex h-9 w-full rounded-lg border border-border bg-white px-2.5 py-1 text-xs text-foreground"
                      value={feat.icon}
                      onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                    >
                      {AVAILABLE_ICONS.map((ic) => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-foreground mb-1">ชื่อฟีเจอร์ (Title)</label>
                    <Input
                      placeholder="เช่น สร้าง QR Code ประจำโต๊ะ"
                      value={feat.title}
                      onChange={(e) => updateFeature(idx, "title", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">คำอธิบายฟีเจอร์ (Description)</label>
                  <Input
                    placeholder="ดาวน์โหลด QR Code ไปตั้งโต๊ะได้ทันที..."
                    value={feat.description}
                    onChange={(e) => updateFeature(idx, "description", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GALLERY */}
      {activeTab === "gallery" && (
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">ภาพหน้าจอ (Screenshot Gallery)</h3>
              <p className="text-xs text-muted-foreground">ภาพหน้าจอการทำงานเพื่อแสดงใน Gallery ให้ User กดซูมดู</p>
            </div>
            <Button type="button" size="sm" onClick={addGalleryItem} variant="outline" className="gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" />
              เพิ่มรูปภาพ
            </Button>
          </div>

          <div className="space-y-4">
            {formData.gallery.map((g, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand">Screenshot #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(idx)}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>ลบ</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Image URL *</label>
                    <Input
                      placeholder="https://..."
                      value={g.imageUrl}
                      onChange={(e) => updateGalleryItem(idx, "imageUrl", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">คำบรรยายรูป (Caption)</label>
                    <Input
                      placeholder="หน้าตาเมนูดิจิทัลฝั่งลูกค้า"
                      value={g.caption}
                      onChange={(e) => updateGalleryItem(idx, "caption", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PRICING */}
      {activeTab === "pricing" && (
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                รูปแบบราคา (Pricing Type) *
              </label>
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-foreground focus-visible:ring-brand"
                value={formData.pricingType}
                onChange={(e) => setFormData({ ...formData, pricingType: e.target.value as any })}
              >
                <option value="fixed">Fixed (ราคาคงที่ เช่น ฿990 ชำระครั้งเดียว)</option>
                <option value="starting">Starting Price (ราคาเริ่มต้น เช่น เริ่มต้น ฿1,990)</option>
                <option value="subscription">Subscription (รายเดือน/รายปี เช่น ฿199 / เดือน)</option>
                <option value="free">Free (ฟรี)</option>
                <option value="custom">Custom (ประเมินราคาตามความต้องการ)</option>
                <option value="contact">Contact (สอบถามราคา)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                ราคา (Price ในสกุลบาท)
              </label>
              <Input
                type="number"
                placeholder="990"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                ราคาเดิม (Original Price สำหรับโชว์ส่วนลด)
              </label>
              <Input
                type="number"
                placeholder="1990"
                value={formData.originalPrice ?? ""}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : null })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                รอบการชำระ (Billing Period)
              </label>
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-foreground focus-visible:ring-brand"
                value={formData.billingPeriod}
                onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value as any })}
              >
                <option value="one_time">ชำระครั้งเดียว (One-time)</option>
                <option value="month">ต่อเดือน (Per Month)</option>
                <option value="year">ต่อปี (Per Year)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOnSale}
                  onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                  className="rounded text-brand focus:ring-brand"
                />
                <span className="text-xs font-semibold text-foreground">เปิดป้ายโปรโมชั่น (On Sale)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              ข้อความกำกับราคา (Pricing Note)
            </label>
            <Input
              placeholder="เช่น จ่ายครั้งเดียวใช้งานได้ตลอดชีพ ไม่มีรายเดือน หรือ ยกเลิกได้ทุกเมื่อ"
              value={formData.pricingNote}
              onChange={(e) => setFormData({ ...formData, pricingNote: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* TAB 6: DEMO SETTINGS */}
      {activeTab === "demo" && (
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="p-4 rounded-xl bg-surface-secondary border border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">เปิดใช้งานระบบ Demo</p>
              <p className="text-xs text-muted-foreground">แสดงปุ่มทดลอง Demo และแสดงใน Demo Center</p>
            </div>
            <input
              type="checkbox"
              checked={formData.demoEnabled}
              onChange={(e) => setFormData({ ...formData, demoEnabled: e.target.checked })}
              className="h-5 w-5 rounded text-brand focus:ring-brand"
            />
          </div>

          {formData.demoEnabled && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    ประเภท Demo (Demo Type)
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-foreground focus-visible:ring-brand"
                    value={formData.demoType}
                    onChange={(e) => setFormData({ ...formData, demoType: e.target.value as any })}
                  >
                    <option value="direct">Direct Demo (กดแล้วเข้าใช้งานได้ทันที)</option>
                    <option value="account">Demo Account (มี Username / Password ให้ Copy)</option>
                    <option value="request">Request Demo (ติดต่อเพื่อขอสิทธิ์)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Demo URL *
                  </label>
                  <Input
                    placeholder="https://demo.example.com"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  />
                </div>
              </div>

              {formData.demoType === "account" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Demo Username / Email
                    </label>
                    <Input
                      placeholder="demo@restaurant.com"
                      value={formData.demoUsername}
                      onChange={(e) => setFormData({ ...formData, demoUsername: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Demo Password
                    </label>
                    <Input
                      placeholder="demopassword123"
                      value={formData.demoPassword}
                      onChange={(e) => setFormData({ ...formData, demoPassword: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  คำแนะนำสำหรับการทดลอง Demo (Demo Note)
                </label>
                <Input
                  placeholder="เช่น เข้าสู่ระบบเพื่อทดลองเพิ่มเมนูและพรีวิวหน้าสแกน QR"
                  value={formData.demoNote}
                  onChange={(e) => setFormData({ ...formData, demoNote: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: SEO */}
      {activeTab === "seo" && (
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-subtle space-y-6">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Meta Title (ปล่อยว่างจะใช้: ชื่อสินค้า + Brand Name)
            </label>
            <Input
              placeholder="EasyMenu เมนูออนไลน์สำหรับร้านอาหาร สแกนดูง่าย"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Meta Description
            </label>
            <Textarea
              placeholder="ระบบเมนูออนไลน์สำหรับร้านอาหารและคาเฟ่..."
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Focus Keyword
              </label>
              <Input
                placeholder="เมนูออนไลน์, ร้านอาหาร, QR Code"
                value={formData.focusKeyword}
                onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Custom OG Image URL
              </label>
              <Input
                placeholder="https://..."
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Save Action */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link href="/admin/products">
          <Button variant="outline" type="button">
            ยกเลิก
          </Button>
        </Link>
        <Button size="lg" type="submit" disabled={isSubmitting} className="gap-2 shadow-sm font-semibold">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>กำลังบันทึก...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>บันทึก Product</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
