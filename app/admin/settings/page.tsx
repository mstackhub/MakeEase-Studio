import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSettings } from "@/lib/db-queries";
import { SettingsAdminClient } from "./SettingsAdminClient";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          GLOBAL CONFIGURATION
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          ตั้งค่าเว็บไซต์ & ระบบสีแบรนด์
        </h1>
      </div>

      <SettingsAdminClient initialSettings={settings} />
    </div>
  );
}
