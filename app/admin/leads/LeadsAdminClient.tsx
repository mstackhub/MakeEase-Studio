"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Mail,
  Phone,
  MessageSquare,
  Trash2,
  Eye,
  X,
  Clock,
  CheckCircle2,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lead } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface LeadsAdminClientProps {
  leads: Lead[];
}

const STATUS_OPTIONS = ["New", "Contacted", "Proposal", "Won", "Lost"];

export function LeadsAdminClient({ leads }: LeadsAdminClientProps) {
  const router = useRouter();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (!res.ok) throw new Error("อัปเดตสถานะไม่สำเร็จ");

      setSuccessMessage("อัปเดตสถานะ Lead สำเร็จ");
      setTimeout(() => setSuccessMessage(""), 3000);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLead) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads?id=${deletingLead.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบ Lead ไม่สำเร็จ");

      setDeletingLead(null);
      if (selectedLead?.id === deletingLead.id) setSelectedLead(null);
      setSuccessMessage("ลบ Lead เรียบร้อยแล้ว");
      setTimeout(() => setSuccessMessage(""), 3000);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case "New":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Contacted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Proposal":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Won":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Lost":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold animate-in fade-in">
          {successMessage}
        </div>
      )}

      {/* Leads Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            <thead className="bg-surface-secondary border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">ชื่อผู้ติดต่อ</th>
                <th className="py-3.5 px-4">ช่องทางติดต่อ</th>
                <th className="py-3.5 px-4">ระบบที่สนใจ</th>
                <th className="py-3.5 px-4">งบประมาณ</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4">วันที่ส่ง</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-surface-secondary/50">
                  {/* Name & Company */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-foreground">{l.name}</p>
                    {l.company && <p className="text-[11px] text-muted-foreground">{l.company}</p>}
                  </td>

                  {/* Contact Channels */}
                  <td className="py-3.5 px-4 space-y-0.5">
                    <p className="text-foreground flex items-center gap-1 font-mono">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {l.email}
                    </p>
                    {(l.phone || l.lineId) && (
                      <p className="text-[11px] text-muted-foreground">
                        {l.phone && `Tel: ${l.phone}`} {l.lineId && `• LINE: ${l.lineId}`}
                      </p>
                    )}
                  </td>

                  {/* Product */}
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    {l.productName || "General / Custom"}
                  </td>

                  {/* Budget */}
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {l.budget || "-"}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={l.status || "New"}
                      onChange={(e) => handleStatusChange(l.id, e.target.value)}
                      className={`text-[11px] font-semibold rounded-lg px-2 py-1 border ${getStatusBadge(
                        l.status
                      )} cursor-pointer focus:outline-none`}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-muted-foreground text-[10px] whitespace-nowrap">
                    {formatDate(l.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedLead(l)}
                        className="p-1.5 text-muted-foreground hover:text-brand rounded-lg hover:bg-brand-light"
                        title="ดูรายละเอียดเต็ม"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingLead(l)}
                        className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="ลบ Lead"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-border space-y-6">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                  LEAD DETAILS
                </span>
                <h3 className="text-xl font-bold text-foreground mt-0.5">{selectedLead.name}</h3>
                {selectedLead.company && (
                  <p className="text-xs text-muted-foreground">{selectedLead.company}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-surface-secondary space-y-1">
                <span className="text-muted-foreground font-semibold">อีเมล (Email)</span>
                <p className="font-mono font-medium text-foreground">{selectedLead.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-secondary space-y-1">
                <span className="text-muted-foreground font-semibold">โทรศัพท์ / LINE</span>
                <p className="font-medium text-foreground">
                  {selectedLead.phone || "-"} {selectedLead.lineId && `(LINE: ${selectedLead.lineId})`}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-secondary space-y-1">
                <span className="text-muted-foreground font-semibold">ระบบที่สนใจ</span>
                <p className="font-medium text-foreground">{selectedLead.productName || "Custom Solution"}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-secondary space-y-1">
                <span className="text-muted-foreground font-semibold">งบประมาณ</span>
                <p className="font-medium text-foreground">{selectedLead.budget || "ยังไม่แน่ใจ"}</p>
              </div>
            </div>

            {selectedLead.sourceUrl && (
              <div className="text-xs text-muted-foreground">
                <strong>Source URL:</strong> <code className="font-mono">{selectedLead.sourceUrl}</code>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-foreground">ปัญหา / Requirement:</span>
              <div className="p-4 rounded-xl bg-surface-secondary border border-border text-xs text-foreground leading-relaxed whitespace-pre-line">
                {selectedLead.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">สถานะ:</span>
                <select
                  value={selectedLead.status || "New"}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedLead({ ...selectedLead, status: val as any });
                    handleStatusChange(selectedLead.id, val);
                  }}
                  className="text-xs font-semibold rounded-lg px-2.5 py-1 border border-border bg-white"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <Button variant="outline" size="sm" onClick={() => setSelectedLead(null)}>
                ปิดหน้าต่าง
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        title={`ต้องการลบข้อมูล Lead ของ "${deletingLead?.name}" หรือไม่?`}
        description="การดำเนินการนี้จะลบประวัติการติดต่อและข้อความของ Lead รายนี้ออกจากระบบอย่างถาวร"
        isLoading={isUpdating}
      />
    </div>
  );
}
