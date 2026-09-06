import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getCategories } from "@/lib/db-queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await getCategories();

  return (
    <div className="max-w-5xl mx-auto">
      <ProductForm categories={categories} />
    </div>
  );
}
