import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/lib/site";

const shopLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/checkout", label: "Checkout" },
];

const infoLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/returns", label: "Return Policy" },
];

export function Footer() {
  const socials = [
    { href: siteConfig.social.facebook, label: "Facebook", Icon: Facebook },
    { href: siteConfig.social.instagram, label: "Instagram", Icon: Instagram },
  ].filter((s) => s.href);

  return (
    <footer className="mt-16 border-t bg-secondary/40 no-print">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground">{siteConfig.tagline}.</p>
          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Shop</h3>
          <ul className="space-y-2 text-sm">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted-foreground hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Information</h3>
          <ul className="space-y-2 text-sm">
            {infoLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted-foreground hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Get in touch</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href={`tel:${siteConfig.supportPhone.replace(/\s|-/g, "")}`} className="hover:text-primary">
                {siteConfig.supportPhone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${siteConfig.supportEmail}`} className="hover:text-primary">
                {siteConfig.supportEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
