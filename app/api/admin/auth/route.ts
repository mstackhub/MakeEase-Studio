import { NextRequest, NextResponse } from "next/server";
import { db, admins } from "@/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { action, email, password } = await req.json();

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" }, { status: 400 });
    }

    const adminList = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

    if (adminList.length === 0) {
      return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const admin = adminList[0];
    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const token = await createSessionToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    const response = NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่" }, { status: 500 });
  }
}
