"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/providers/cart-provider";
import { Cart } from "@/components/cart";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const { cartCount, setIsCartOpen, isHydrated } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Close the mobile menu whenever navigation happens.
  useEffect(() => setMobileOpen(false), [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <>
      <div className="bg-brand-gradient py-1.5 text-center text-xs font-medium text-primary-foreground no-print">
        Safe home delivery across Bangladesh · Cash on Delivery available
      </div>
      <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 no-print">
        <div className="container flex h-16 items-center gap-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-base transition-colors hover:bg-accent",
                      isActive(pathname, link.href) ? "bg-accent font-semibold text-primary" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Logo />

          <nav className="hidden flex-1 justify-center gap-8 text-sm font-medium md:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 transition-colors hover:text-primary",
                  isActive(pathname, link.href)
                    ? "text-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Button variant="ghost" size="icon" aria-label="Search products" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open cart (${cartCount} items)`}
            >
              <ShoppingBag className="h-5 w-5" />
              {isHydrated && cartCount > 0 && (
                <span
                  data-testid="cart-count"
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Search products</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitSearch} className="flex gap-2" role="search">
            <Input
              autoFocus
              type="search"
              placeholder="Necklace, gift set, mug…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search query"
            />
            <Button type="submit">Search</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Cart />
    </>
  );
}
