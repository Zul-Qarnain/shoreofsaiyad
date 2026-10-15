import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return (
    <div className="container max-w-5xl py-14 sm:py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Get in Touch</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Have a question about a product or your order? We&apos;d love to hear from you.
        </p>
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <ul className="space-y-6">
          <li className="flex gap-4">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">Phone</p>
              <a href={`tel:${siteConfig.supportPhone.replace(/\s|-/g, "")}`} className="text-muted-foreground hover:text-primary">
                {siteConfig.supportPhone}
              </a>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">Email</p>
              <a href={`mailto:${siteConfig.supportEmail}`} className="text-muted-foreground hover:text-primary">
                {siteConfig.supportEmail}
              </a>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">Delivery area</p>
              <p className="text-muted-foreground">Home delivery across Bangladesh</p>
            </div>
          </li>
        </ul>
        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
