import { NextRequest, NextResponse } from "next/server";
import { db, categories } from "@/db";
import { eq } from "drizzle-orm";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { clearDbCache } from "@/lib/db-queries";

export async function POST(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, slug, description, icon, sortOrder, status } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const id = `cat-${Date.now()}`;
    await db.insert(categories).values({
      id,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description || null,
      icon: icon || "Folder",
      sortOrder: sortOrder ? Number(sortOrder) : 0,
      status: status || "active",
    });

    clearDbCache();
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, name, slug, description, icon, sortOrder, status } = await req.json();
    if (!id) return NextResponse.json({ error: "Category ID required" }, { status: 400 });

    await db
      .update(categories)
      .set({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description || null,
        icon: icon || "Folder",
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        status: status || "active",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(categories.id, id));

    clearDbCache();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete(categories).where(eq(categories.id, id));
    clearDbCache();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
  }
}
