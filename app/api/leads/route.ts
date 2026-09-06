import { NextRequest, NextResponse } from "next/server";
import { db, leads } from "@/db";
import { clearDbCache } from "@/lib/db-queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, phone, lineId, productName, productId, budget, message, sourceUrl, honeypot } = body;

    // Anti-spam check
    if (honeypot) {
      return NextResponse.json({ success: true, message: "OK" });
    }

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "กรุณาระบุชื่อของคุณ" }, { status: 400 });
    }
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "กรุณาระบุอีเมลที่ถูกต้อง" }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "กรุณาระบุข้อความหรือปัญหาของคุณ" }, { status: 400 });
    }

    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(leads).values({
      id: leadId,
      name: name.trim(),
      company: company?.trim() || null,
      email: email.trim(),
      phone: phone?.trim() || null,
      lineId: lineId?.trim() || null,
      productId: productId || null,
      productName: productName?.trim() || null,
      budget: budget || "ยังไม่แน่ใจ",
      message: message.trim(),
      sourceUrl: sourceUrl || null,
      status: "New",
    });

    clearDbCache();
    return NextResponse.json({ success: true, id: leadId });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" }, { status: 500 });
  }
}
