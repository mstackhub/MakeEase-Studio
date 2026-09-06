"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageToggle } from "@/components/shared/LanguageToggle";

interface NavbarProps {
  siteName?: string;
}

export function Navbar({ siteName = "MakeEase Studio" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/demo", label: t.nav.demo },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group min-w-[200px] shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white font-bold transition-transform group-hover:scale-105 shadow-sm shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground whitespace-nowrap">{siteName}</span>
            <span className="text-[10px] text-muted-foreground hidden sm:block -mt-1 whitespace-nowrap">{t.footer.tagline}</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-1.5 flex-1 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                isActive(link.href)
                  ? "text-brand bg-brand-light font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Language Toggle */}
        <div className="hidden md:flex items-center justify-end gap-3 min-w-[245px] shrink-0">
          <LanguageToggle />
          <Link href="/products" className="shrink-0">
            <Button size="sm" className="gap-1.5 shadow-sm w-[155px] justify-center whitespace-nowrap">
              <span>{t.nav.viewAllProducts}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger & Lang Switch */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-surface-secondary hover:text-foreground focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-white px-4 pt-2 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                  isActive(link.href)
                    ? "text-brand bg-brand-light font-semibold"
                    : "text-foreground hover:bg-surface-secondary"
                )}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
            <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center gap-2">
                {t.nav.viewAllProducts}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                {t.nav.talkToUs}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
