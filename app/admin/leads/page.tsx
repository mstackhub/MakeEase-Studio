import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getLeadsAdmin } from "@/lib/db-queries";
import { LeadsAdminClient } from "./LeadsAdminClient";

export default async function AdminLeadsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const leads = await getLeadsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          LEAD MANAGEMENT & CRM
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          รายการ Leads ทั้งหมด ({leads.length})
        </h1>
        <p className="text-xs text-muted-foreground">
          ติดตามสถานะลูกค้าที่ติดต่อสอบถาม เล่าปัญหา หรือสนใจสั่งซื้อระบบ
        </p>
      </div>

      <LeadsAdminClient leads={leads} />
    </div>
  );
}
