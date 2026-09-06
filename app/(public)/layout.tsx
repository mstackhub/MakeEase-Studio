import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { getSettings } from "@/lib/db-queries";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar siteName={settings.siteName} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </div>
    </LanguageProvider>
  );
}
