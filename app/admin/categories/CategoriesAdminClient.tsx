"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Folder, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/db/schema";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface CategoriesAdminClientProps {
  categories: Category[];
}

export function CategoriesAdminClient({ categories }: CategoriesAdminClientProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Folder",
    sortOrder: 0,
    status: "active" as "active" | "archived",
  });

  const openAdd = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      icon: "Folder",
      sortOrder: categories.length + 1,
      status: "active",
    });
    setEditingCategory(null);
    setIsAdding(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      icon: cat.icon || "Folder",
      sortOrder: cat.sortOrder || 0,
      status: cat.status || "active",
    });
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = !!editingCategory;
      const res = await fetch("/api/admin/categories", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: editingCategory?.id,
        }),
      });

      if (!res.ok) throw new Error("บันทึกหมวดหมู่ไม่สำเร็จ");

      setIsAdding(false);
      setMessage(isEdit ? "อัปเดตหมวดหมู่สำเร็จ" : "เพิ่มหมวดหมู่สำเร็จ");
      setTimeout(() => setMessage(""), 3000);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${deletingCategory.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");

      setDeletingCategory(null);
      setMessage("ลบหมวดหมู่สำเร็จ");
      setTimeout(() => setMessage(""), 3000);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการลบ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold animate-in fade-in">
          {message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">จัดการและจัดเรียงหมวดหมู่ Use Cases ของ Product</p>
        <Button size="sm" onClick={openAdd} className="gap-2 shadow-sm font-semibold">
          <Plus className="h-4 w-4" />
          <span>เพิ่มหมวดหมู่</span>
        </Button>
      </div>

      {/* Modal / Form drawer */}
      {isAdding && (
        <div className="p-6 rounded-2xl border border-border bg-white shadow-subtle animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground">
              {editingCategory ? `แก้ไข: ${editingCategory.name}` : "เพิ่มหมวดหมู่ใหม่"}
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ชื่อหมวดหมู่ *
                </label>
                <Input
                  placeholder="เช่น E-Commerce หรือ Automation"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm({
                      ...form,
                      name,
                      slug: !editingCategory ? name.toLowerCase().replace(/[^a-z0-9]/g, "-") : form.slug,
                    });
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  URL Slug *
                </label>
                <Input
                  placeholder="ecommerce"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                คำอธิบายหมวดหมู่ (Description)
              </label>
              <Input
                placeholder="คำอธิบายว่ากลุ่มนี้เหมาะสำหรับแก้ปัญหาแบบไหน"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ไอคอน (Lucide Icon)
                </label>
                <Input
                  placeholder="ShoppingBag, Zap, Briefcase, Smile"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ลำดับ (Sort Order)
                </label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  สถานะ
                </label>
                <select
                  className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-foreground"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                ยกเลิก
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5 font-semibold">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>บันทึก</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-subtle">
        <table className="w-full text-left text-xs text-foreground">
          <thead className="bg-surface-secondary border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Icon</th>
              <th className="py-3.5 px-4">ชื่อหมวดหมู่</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">คำอธิบาย</th>
              <th className="py-3.5 px-4">ลำดับ</th>
              <th className="py-3.5 px-4">สถานะ</th>
              <th className="py-3.5 px-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-surface-secondary/50">
                <td className="py-3 px-4 font-mono font-bold text-brand">{cat.icon}</td>
                <td className="py-3 px-4 font-bold text-foreground">{cat.name}</td>
                <td className="py-3 px-4 font-mono text-muted-foreground">/{cat.slug}</td>
                <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">{cat.description || "-"}</td>
                <td className="py-3 px-4">{cat.sortOrder}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    cat.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-600"
                  }`}>
                    {cat.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 text-muted-foreground hover:text-brand rounded-lg hover:bg-brand-light"
                      title="แก้ไข"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="ลบ"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title={`ต้องการลบหมวดหมู่ "${deletingCategory?.name}" หรือไม่?`}
        description="การลบหมวดหมู่นี้จะไม่ลบ Product ที่อยู่ในหมวดหมู่นี้ แต่ความสัมพันธ์กับหมวดหมู่นี้จะถูกนำออก"
        isLoading={isSubmitting}
      />
    </div>
  );
}
