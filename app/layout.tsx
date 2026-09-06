import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/db-queries";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: {
      default: settings.defaultSeoTitle || "MakeEase Studio | We build simple tools for real problems",
      template: `%s | ${settings.siteName || "MakeEase Studio"}`,
    },
    description: settings.defaultSeoDescription || "We build simple tools for real problems. Web App และเครื่องมือที่สร้างขึ้นเพื่อช่วยลดขั้นตอน แก้ปัญหาจุกจิก และทำให้งานในแต่ละวันง่ายขึ้น",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    openGraph: {
      title: settings.defaultSeoTitle || "MakeEase Studio | We build simple tools for real problems",
      description: settings.defaultSeoDescription || "We build simple tools for real problems. Web App และเครื่องมือที่สร้างขึ้นเพื่อช่วยลดขั้นตอน แก้ปัญหาจุกจิก และทำให้งานในแต่ละวันง่ายขึ้น",
      siteName: settings.siteName || "MakeEase Studio",
      images: settings.defaultOgImage ? [{ url: settings.defaultOgImage }] : [],
      locale: "th_TH",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.defaultSeoTitle || "MakeEase Studio | We build simple tools for real problems",
      description: settings.defaultSeoDescription || "We build simple tools for real problems. Web App และเครื่องมือที่สร้างขึ้นเพื่อช่วยลดขั้นตอน แก้ปัญหาจุกจิก",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  const brandStyles = `
    :root {
      --brand-primary: ${settings.brandColor || "#2563EB"};
      --brand-hover: ${settings.brandHoverColor || "#1D4ED8"};
      --brand-light: ${settings.brandLightColor || "#EFF6FF"};
    }
  `;

  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: brandStyles }} />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        <GoogleAnalytics gaId={settings.gaId} />
        {children}
      </body>
    </html>
  );
}
