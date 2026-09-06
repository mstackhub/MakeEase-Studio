import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAllProductsAdmin } from "@/lib/db-queries";
import { ProductsAdminClient } from "./ProductsAdminClient";

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const products = await getAllProductsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          CMS & STORE
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          จัดการ Products ทั้งหมด ({products.length})
        </h1>
        <p className="text-xs text-muted-foreground">
          เพิ่ม ลบ แก้ไขราคา ข้อมูล Demo และภาพหน้าจอของ Web Apps
        </p>
      </div>

      <ProductsAdminClient products={products} />
    </div>
  );
}
