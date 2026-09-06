import React from "react";
import Link from "next/link";
import { PackageOpen, Inbox, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type?: "products" | "leads" | "categories" | "search";
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function EmptyState({
  type = "products",
  title,
  description,
  actionLabel,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case "leads":
        return <Inbox className="h-10 w-10 text-muted-foreground" />;
      case "search":
        return <RefreshCw className="h-10 w-10 text-muted-foreground" />;
      default:
        return <PackageOpen className="h-10 w-10 text-muted-foreground" />;
    }
  };

  const defaultTitle =
    type === "products"
      ? "ยังไม่มี Product ในหมวดหมู่นี้"
      : type === "leads"
      ? "ยังไม่มี Lead ใหม่"
      : type === "search"
      ? "ไม่พบระบบที่ตรงกับคำค้นหา"
      : "ไม่พบข้อมูล";

  const defaultDescription =
    type === "products"
      ? "ลองเลือกหมวดหมู่อื่น หรือเล่าปัญหาที่คุณต้องการแก้ให้เราช่วยสร้างระบบใหม่"
      : type === "leads"
      ? "เมื่อมีผู้สนใจติดต่อหรือกรอกแบบฟอร์ม ข้อมูลจะแสดงที่นี่โดยอัตโนมัติ"
      : type === "search"
      ? "ลองค้นหาด้วยคำอื่น เช่น เมนู, สลิป, CRM หรือ Shopify"
      : "";

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-secondary/50 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-subtle border border-border/80 mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-bold text-foreground">{title || defaultTitle}</h3>
      <p className="mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed">
        {description || defaultDescription}
      </p>

      {(actionLabel || actionHref || onActionClick) && (
        <div className="mt-6">
          {actionHref ? (
            <Link href={actionHref}>
              <Button size="sm" className="gap-2">
                {type === "products" && <Plus className="h-4 w-4" />}
                {actionLabel || (type === "products" ? "เพิ่ม Product แรก" : "ดูระบบทั้งหมด")}
              </Button>
            </Link>
          ) : onActionClick ? (
            <Button size="sm" onClick={onActionClick} variant="secondary" className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              {actionLabel || "ล้างตัวกรอง"}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
