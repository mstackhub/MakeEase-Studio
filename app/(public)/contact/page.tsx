import type { Metadata } from "next";
import { getSettings } from "@/lib/db-queries";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "ติดต่อเรา / เล่าปัญหาให้เราฟัง (Contact Us)",
  description: "เล่าให้เราฟังได้เลย ไม่จำเป็นต้องมี Technical Requirement พร้อมให้คำปรึกษาและออกแบบระบบที่เหมาะสม",
};

export const revalidate = 60;

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: { product?: string; source?: string };
}) {
  const settings = await getSettings();
  const defaultProduct = searchParams?.product || "";
  const defaultSource = searchParams?.source || "";

  return (
    <ContactClient
      settings={settings}
      defaultProduct={defaultProduct}
      defaultSource={defaultSource}
    />
  );
}

