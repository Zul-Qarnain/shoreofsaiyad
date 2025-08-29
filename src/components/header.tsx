"use client";

import Link from "next/link";
import { Mountain, Search, ShoppingBag, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { Cart } from "@/components/cart";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center gap-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block text-lg">
              Memento
            </span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium md:flex flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
             <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/100" alt="User" />
                <AvatarFallback>
                    <User className="h-5 w-5" />
                </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <Cart />
    </>
  );
}
