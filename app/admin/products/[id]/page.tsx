import React from "react";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getProductById, getCategories } from "@/lib/db-queries";
import { ProductForm } from "@/components/admin/ProductForm";

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const product = await getProductById(params.id);
  const categories = await getCategories();

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProductForm initialProduct={product} categories={categories} />
    </div>
  );
}
