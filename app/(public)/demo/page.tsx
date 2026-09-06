import React from "react";
import { Metadata } from "next";
import { DemoClient } from "./DemoClient";
import { getDemoProducts, getCategories } from "@/lib/db-queries";

export const metadata: Metadata = {
  title: "Demo Center — ทดลองระบบจริง",
  description: "ไม่ต้องดูแค่ Screenshot ลองใช้งาน Web App ที่สนใจได้ก่อนตัดสินใจ",
};

export const revalidate = 60;

export default async function DemoPage() {
  const demoProducts = await getDemoProducts();
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <DemoClient demoProducts={demoProducts} categories={categories} />
    </div>
  );
}
