import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  CheckCircle,
  Play,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/db-queries";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border shadow-subtle">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            OVERVIEW
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-0.5">
            ยินดีต้อนรับ, {session.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            ภาพรวมระบบ สินค้า และลูกค้าที่ส่งแบบฟอร์มเข้ามาทั้งหมด
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products/new">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <Plus className="h-4 w-4" />
              เพิ่ม Product ใหม่
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Products</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-brand flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-foreground">{stats.totalProducts}</span>
            <span className="text-xs text-muted-foreground ml-1.5">รายการ</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Published</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-600">{stats.publishedProducts}</span>
            <span className="text-xs text-muted-foreground ml-1.5">พร้อมขาย/แสดง</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Demo Products</span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Play className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-purple-600">{stats.totalDemoProducts}</span>
            <span className="text-xs text-muted-foreground ml-1.5">ระบบมี Demo</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">New Leads</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-amber-600">{stats.newLeads}</span>
            <span className="text-xs text-muted-foreground ml-1.5">รอติดต่อ ({stats.totalLeads} ทั้งหมด)</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Leads + Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-white p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Recent Leads (ผู้ติดต่อล่าสุด)</h2>
              <p className="text-xs text-muted-foreground">ลูกค้าที่เล่าปัญหาหรือสนใจระบบ</p>
            </div>
            <Link href="/admin/leads">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-brand">
                ดูทั้งหมด
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {stats.recentLeads.length > 0 ? (
              stats.recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-xl bg-surface-secondary border border-border/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{lead.name}</span>
                      {lead.company && <span className="text-muted-foreground">({lead.company})</span>}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        lead.status === "New" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-1">
                      {lead.productName ? `สนใจ: ${lead.productName} • ` : ""}
                      {lead.message}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-6 text-center">ยังไม่มี Lead ในขณะนี้</p>
            )}
          </div>
        </div>

        {/* Recent Products Quick Links */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-white p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Products ล่าสุด</h2>
              <p className="text-xs text-muted-foreground">สินค้าและเครื่องมือในระบบ</p>
            </div>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-brand">
                จัดการ
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.recentProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary border border-border text-xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-foreground truncate">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    {p.pricingType} • {p.status}
                  </p>
                </div>
                <Link href={`/admin/products/${p.id}`}>
                  <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5">
                    แก้ไข
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
