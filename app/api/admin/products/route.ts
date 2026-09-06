import { NextRequest, NextResponse } from "next/server";
import {
  db,
  products,
  productCategories,
  productBadges,
  productProblems,
  productFeatures,
  productGallery,
} from "@/db";
import { eq } from "drizzle-orm";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { clearDbCache } from "@/lib/db-queries";

export async function POST(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      shortDescription,
      fullDescription,
      coverImage,
      productType,
      status,
      pricingType,
      price,
      originalPrice,
      currency,
      billingPeriod,
      pricingNote,
      isOnSale,
      demoEnabled,
      demoType,
      demoUrl,
      demoUsername,
      demoPassword,
      demoNote,
      primaryCtaLabel,
      primaryCtaUrl,
      secondaryCtaLabel,
      secondaryCtaUrl,
      isFeatured,
      sortOrder,
      metaTitle,
      metaDescription,
      focusKeyword,
      ogImage,
      canonicalUrl,
      isIndexable,
      categoryIds = [],
      badges = [],
      problems = [],
      features = [],
      gallery = [],
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "กรุณาระบุชื่อ Product" }, { status: 400 });
    }
    if (!slug || !slug.trim()) {
      return NextResponse.json({ error: "กรุณาระบุ Slug" }, { status: 400 });
    }
    if (!shortDescription || !shortDescription.trim()) {
      return NextResponse.json({ error: "กรุณาระบุคำอธิบายสั้น" }, { status: 400 });
    }

    const productId = `prod-${Date.now()}`;

    // 1. Insert Product
    await db.insert(products).values({
      id: productId,
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription || null,
      coverImage: coverImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      productType: productType || "product",
      status: status || "published",
      pricingType: pricingType || "fixed",
      price: price ? Number(price) : 0,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      currency: currency || "THB",
      billingPeriod: billingPeriod || "one_time",
      pricingNote: pricingNote || null,
      isOnSale: !!isOnSale,
      demoEnabled: !!demoEnabled,
      demoType: demoType || "direct",
      demoUrl: demoUrl || null,
      demoUsername: demoUsername || null,
      demoPassword: demoPassword || null,
      demoNote: demoNote || null,
      primaryCtaLabel: primaryCtaLabel || null,
      primaryCtaUrl: primaryCtaUrl || null,
      secondaryCtaLabel: secondaryCtaLabel || null,
      secondaryCtaUrl: secondaryCtaUrl || null,
      isFeatured: !!isFeatured,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      focusKeyword: focusKeyword || null,
      ogImage: ogImage || null,
      canonicalUrl: canonicalUrl || null,
      isIndexable: isIndexable !== undefined ? !!isIndexable : true,
    });

    // 2. Insert Categories
    for (const catId of categoryIds) {
      if (catId) {
        await db.insert(productCategories).values({
          id: `pc-${productId}-${catId}`,
          productId,
          categoryId: catId,
        });
      }
    }

    // 3. Insert Badges
    for (const badge of badges) {
      if (badge && badge.trim()) {
        await db.insert(productBadges).values({
          id: `pb-${productId}-${Math.random().toString(36).substring(2, 7)}`,
          productId,
          badge: badge.trim(),
        });
      }
    }

    // 4. Insert Problems
    let pOrder = 1;
    for (const p of problems) {
      if (p && p.trim()) {
        await db.insert(productProblems).values({
          id: `prob-${productId}-${pOrder}`,
          productId,
          text: p.trim(),
          sortOrder: pOrder++,
        });
      }
    }

    // 5. Insert Features
    let fOrder = 1;
    for (const f of features) {
      if (f && f.title && f.title.trim()) {
        await db.insert(productFeatures).values({
          id: `feat-${productId}-${fOrder}`,
          productId,
          icon: f.icon || "CheckCircle2",
          title: f.title.trim(),
          description: f.description || "",
          sortOrder: fOrder++,
        });
      }
    }

    // 6. Insert Gallery
    let gOrder = 1;
    for (const g of gallery) {
      if (g && g.imageUrl) {
        await db.insert(productGallery).values({
          id: `gal-${productId}-${gOrder}`,
          productId,
          imageUrl: g.imageUrl,
          altText: g.altText || null,
          caption: g.caption || null,
          sortOrder: gOrder++,
        });
      }
    }

    clearDbCache();
    return NextResponse.json({ success: true, id: productId, slug });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: error.message || "เกิดข้อผิดพลาดในการสร้าง Product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      name,
      slug,
      shortDescription,
      fullDescription,
      coverImage,
      productType,
      status,
      pricingType,
      price,
      originalPrice,
      currency,
      billingPeriod,
      pricingNote,
      isOnSale,
      demoEnabled,
      demoType,
      demoUrl,
      demoUsername,
      demoPassword,
      demoNote,
      primaryCtaLabel,
      primaryCtaUrl,
      secondaryCtaLabel,
      secondaryCtaUrl,
      isFeatured,
      sortOrder,
      metaTitle,
      metaDescription,
      focusKeyword,
      ogImage,
      canonicalUrl,
      isIndexable,
      categoryIds = [],
      badges = [],
      problems = [],
      features = [],
      gallery = [],
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // 1. Update Product table
    await db
      .update(products)
      .set({
        name: name.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription || null,
        coverImage: coverImage,
        productType: productType || "product",
        status: status || "published",
        pricingType: pricingType || "fixed",
        price: price !== undefined ? Number(price) : 0,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        currency: currency || "THB",
        billingPeriod: billingPeriod || "one_time",
        pricingNote: pricingNote || null,
        isOnSale: !!isOnSale,
        demoEnabled: !!demoEnabled,
        demoType: demoType || "direct",
        demoUrl: demoUrl || null,
        demoUsername: demoUsername || null,
        demoPassword: demoPassword || null,
        demoNote: demoNote || null,
        primaryCtaLabel: primaryCtaLabel || null,
        primaryCtaUrl: primaryCtaUrl || null,
        secondaryCtaLabel: secondaryCtaLabel || null,
        secondaryCtaUrl: secondaryCtaUrl || null,
        isFeatured: !!isFeatured,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        focusKeyword: focusKeyword || null,
        ogImage: ogImage || null,
        canonicalUrl: canonicalUrl || null,
        isIndexable: isIndexable !== undefined ? !!isIndexable : true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(products.id, id));

    // 2. Clear old relational records and re-insert
    await db.delete(productCategories).where(eq(productCategories.productId, id));
    await db.delete(productBadges).where(eq(productBadges.productId, id));
    await db.delete(productProblems).where(eq(productProblems.productId, id));
    await db.delete(productFeatures).where(eq(productFeatures.productId, id));
    await db.delete(productGallery).where(eq(productGallery.productId, id));

    for (const catId of categoryIds) {
      if (catId) {
        await db.insert(productCategories).values({
          id: `pc-${id}-${catId}`,
          productId: id,
          categoryId: catId,
        });
      }
    }

    for (const badge of badges) {
      if (badge && badge.trim()) {
        await db.insert(productBadges).values({
          id: `pb-${id}-${Math.random().toString(36).substring(2, 7)}`,
          productId: id,
          badge: badge.trim(),
        });
      }
    }

    let pOrder = 1;
    for (const p of problems) {
      const text = typeof p === "string" ? p : p?.text;
      if (text && text.trim()) {
        await db.insert(productProblems).values({
          id: `prob-${id}-${pOrder}`,
          productId: id,
          text: text.trim(),
          sortOrder: pOrder++,
        });
      }
    }

    let fOrder = 1;
    for (const f of features) {
      if (f && f.title && f.title.trim()) {
        await db.insert(productFeatures).values({
          id: `feat-${id}-${fOrder}`,
          productId: id,
          icon: f.icon || "CheckCircle2",
          title: f.title.trim(),
          description: f.description || "",
          sortOrder: fOrder++,
        });
      }
    }

    let gOrder = 1;
    for (const g of gallery) {
      if (g && g.imageUrl) {
        await db.insert(productGallery).values({
          id: `gal-${id}-${gOrder}`,
          productId: id,
          imageUrl: g.imageUrl,
          altText: g.altText || null,
          caption: g.caption || null,
          sortOrder: gOrder++,
        });
      }
    }

    clearDbCache();
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: error.message || "เกิดข้อผิดพลาดในการอัปเดต Product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Delete related
    await db.delete(productCategories).where(eq(productCategories.productId, id));
    await db.delete(productBadges).where(eq(productBadges.productId, id));
    await db.delete(productProblems).where(eq(productProblems.productId, id));
    await db.delete(productFeatures).where(eq(productFeatures.productId, id));
    await db.delete(productGallery).where(eq(productGallery.productId, id));
    await db.delete(products).where(eq(products.id, id));

    clearDbCache();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: error.message || "เกิดข้อผิดพลาดในการลบ Product" }, { status: 500 });
  }
}
