import { NextRequest, NextResponse } from "next/server";
import { db, settings } from "@/db";
import { eq } from "drizzle-orm";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { clearDbCache } from "@/lib/db-queries";

export async function PUT(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      siteName,
      siteDescription,
      brandColor,
      brandHoverColor,
      brandLightColor,
      email,
      phone,
      lineUrl,
      facebookUrl,
      instagramUrl,
      footerText,
      gaId,
      defaultSeoTitle,
      defaultSeoDescription,
      defaultOgImage,
    } = body;

    await db
      .update(settings)
      .set({
        siteName: siteName || "MakeEase Studio",
        siteDescription: siteDescription || null,
        brandColor: brandColor || "#2563EB",
        brandHoverColor: brandHoverColor || "#1D4ED8",
        brandLightColor: brandLightColor || "#EFF6FF",
        email: email || null,
        phone: phone || null,
        lineUrl: lineUrl || null,
        facebookUrl: facebookUrl || null,
        instagramUrl: instagramUrl || null,
        footerText: footerText || null,
        gaId: gaId || null,
        defaultSeoTitle: defaultSeoTitle || null,
        defaultSeoDescription: defaultSeoDescription || null,
        defaultOgImage: defaultOgImage || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(settings.id, "default"));

    clearDbCache();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
