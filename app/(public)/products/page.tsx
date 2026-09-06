import React from "react";
import { Metadata } from "next";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProductsClient } from "./ProductsClient";
import { getPublishedProducts, getCategories } from "@/lib/db-queries";

export const metadata: Metadata = {
  title: "ระบบและเครื่องมือทั้งหมด (Products & Tools)",
  description: "Web App และเครื่องมือที่สร้างขึ้นเพื่อแก้ปัญหา ลดขั้นตอน และช่วยให้งานง่ายขึ้น",
};

export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const products = await getPublishedProducts();
  const categories = await getCategories();
  const initialCategory = searchParams?.category || "all";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <ProductsClient
        products={products}
        categories={categories}
        initialCategory={initialCategory}
      />
    </div>
  );
}
