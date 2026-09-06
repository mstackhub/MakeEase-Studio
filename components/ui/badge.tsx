import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-surface-secondary text-foreground border border-border",
        brand: "bg-brand-light text-brand border border-brand/20",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border border-amber-200",
        purple: "bg-purple-50 text-purple-700 border border-purple-200",
        outline: "text-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  badgeName?: string;
}

function getBadgeVariant(name?: string) {
  if (!name) return "default";
  const lower = name.toLowerCase();
  if (lower.includes("demo") || lower.includes("live")) return "brand";
  if (lower.includes("ready")) return "success";
  if (lower.includes("popular")) return "warning";
  if (lower.includes("custom")) return "purple";
  if (lower.includes("new") || lower.includes("beta")) return "brand";
  return "default";
}

function Badge({ className, variant, badgeName, ...props }: BadgeProps) {
  const finalVariant = variant || getBadgeVariant(badgeName || (props.children as string));
  return (
    <div className={cn(badgeVariants({ variant: finalVariant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
