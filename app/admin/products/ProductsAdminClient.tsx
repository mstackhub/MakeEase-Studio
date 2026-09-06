"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Copy,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { FullProduct } from "@/lib/db-queries";
import { formatPrice, formatDate } from "@/lib/utils";

interface ProductsAdminClientProps {
  products: FullProduct[];
}

export function ProductsAdminClient({ products }: ProductsAdminClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingProduct, setDeletingProduct] = useState<FullProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${deletingProduct.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบ Product ไม่สำเร็จ");
      setDeletingProduct(null);
      setActionSuccess("ลบ Product เรียบร้อยแล้ว");
      setTimeout(() => setActionSuccess(""), 3000);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการลบ");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (product: FullProduct) => {
    try {
      const newSlug = `${product.slug}-copy-${Date.now().toString().slice(-4)}`;
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          id: undefined,
          name: `${product.name} (Copy)`,
          slug: newSlug,
          categoryIds: product.categories.map((c) => c.id),
          badges: product.badges,
          problems: product.problems.map((p) => p.text),
          features: product.features,
          gallery: product.gallery,
        }),
      });

      if (!res.ok) throw new Error("Duplicate ไม่สำเร็จ");
      setActionSuccess("คัดลอก Product สำเร็จ");
      setTimeout(() => setActionSuccess(""), 3000);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการ Duplicate");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast banner */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold animate-in fade-in">
          {actionSuccess}
        </div>
      )}

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาชื่อ หรือ slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        <Link href="/admin/products/new">
          <Button size="sm" className="w-full sm:w-auto gap-2 shadow-sm font-semibold">
            <Plus className="h-4 w-4" />
            <span>เพิ่ม Product ใหม่</span>
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            <thead className="bg-surface-secondary border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Cover</th>
                <th className="py-3.5 px-4">ชื่อ Product</th>
                <th className="py-3.5 px-4">หมวดหมู่</th>
                <th className="py-3.5 px-4">ราคา</th>
                <th className="py-3.5 px-4">Demo</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4">อัปเดต</th>
                <th className="py-3.5 px-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface-secondary/50 transition-colors">
                  {/* Cover */}
                  <td className="py-3 px-4">
                    <div className="relative h-10 w-16 overflow-hidden rounded-md bg-muted border border-border">
                      <Image src={p.coverImage} alt={p.name} fill className="object-cover" />
                    </div>
                  </td>

                  {/* Name & Slug */}
                  <td className="py-3 px-4 font-medium">
                    <p className="font-bold text-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">/{p.slug}</p>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-muted-foreground">
                    {p.categories[0]?.name || "-"}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-semibold">
                    {formatPrice(p.price, p.currency || "THB", p.pricingType || "fixed", p.billingPeriod)}
                  </td>

                  {/* Demo */}
                  <td className="py-3 px-4">
                    {p.demoEnabled ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-brand font-semibold bg-brand-light px-2 py-0.5 rounded">
                        <Play className="h-2.5 w-2.5 fill-current" />
                        {p.demoType}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">-</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : p.status === "draft"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="py-3 px-4">
                    {p.isFeatured ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-light text-brand">
                        Home
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </td>

                  {/* Updated */}
                  <td className="py-3 px-4 text-muted-foreground text-[10px]">
                    {formatDate(p.updatedAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-secondary"
                        title="ดูหน้าจริง"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>

                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-1.5 text-muted-foreground hover:text-brand rounded-lg hover:bg-brand-light"
                        title="แก้ไข"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-1.5 text-muted-foreground hover:text-purple-600 rounded-lg hover:bg-purple-50"
                        title="คัดลอก (Duplicate)"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingProduct(p)}
                        className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="ลบ Product"
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
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        title={`ต้องการลบ "${deletingProduct?.name}" หรือไม่?`}
        description="เมื่อลบแล้ว ข้อมูลปัญหากลุ่มเป้าหมาย ฟีเจอร์ แกลเลอรี และ Demo จะถูกลบถาวร"
        isLoading={isDeleting}
      />
    </div>
  );
}
