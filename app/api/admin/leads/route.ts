import { NextRequest, NextResponse } from "next/server";
import { db, leads } from "@/db";
import { eq } from "drizzle-orm";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { clearDbCache } from "@/lib/db-queries";

export async function PUT(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "ID and Status required" }, { status: 400 });

    await db
      .update(leads)
      .set({
        status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(leads.id, id));

    clearDbCache();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update lead status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete(leads).where(eq(leads.id, id));
    clearDbCache();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete lead" }, { status: 500 });
  }
}
