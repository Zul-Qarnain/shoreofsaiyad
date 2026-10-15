import Link from "next/link";
import { Gem } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label={`${siteConfig.name} home`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground shadow-sm">
        <Gem className="h-5 w-5" />
      </span>
      <span className="font-headline text-lg font-semibold tracking-tight">{siteConfig.name}</span>
    </Link>
  );
}
