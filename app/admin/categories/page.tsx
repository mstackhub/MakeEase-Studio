import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAllCategoriesAdmin } from "@/lib/db-queries";
import { CategoriesAdminClient } from "./CategoriesAdminClient";

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await getAllCategoriesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          CATEGORIES & TAXONOMY
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          จัดการหมวดหมู่ (Categories)
        </h1>
      </div>

      <CategoriesAdminClient categories={categories} />
    </div>
  );
}
