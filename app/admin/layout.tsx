import React from "react";
import { AdminShell } from "./AdminShell";

export const metadata = {
  title: "Admin Dashboard — Product & CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
