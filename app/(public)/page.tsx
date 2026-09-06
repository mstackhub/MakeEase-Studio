import React from "react";
import { getFeaturedProducts, getCategories, getDemoProducts } from "@/lib/db-queries";
import { HomeClient } from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();
  const demoProducts = await getDemoProducts();

  return (
    <HomeClient
      featuredProducts={featuredProducts}
      categories={categories}
      demoProducts={demoProducts}
    />
  );
}
