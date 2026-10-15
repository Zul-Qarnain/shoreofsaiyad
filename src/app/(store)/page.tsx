import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HandCoins, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { getCategories } from "@/lib/products";
import { getLiveProducts } from "@/lib/server/store";
import { siteConfig } from "@/lib/site";

const perks = [
  { Icon: Truck, title: "Safe Home Delivery", text: "Hand-delivered nationwide — never via rough courier handling." },
  { Icon: HandCoins, title: "Cash on Delivery", text: "Pay only the delivery charge upfront, the rest at your door." },
  { Icon: BadgeCheck, title: "Premium Quality", text: "Carefully sourced, mostly imported pieces." },
  { Icon: ShieldCheck, title: "Easy Returns", text: "Inspect in front of the rider, return on the spot." },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = (await getLiveProducts()).filter((p) => p.featured);
  const categories = getCategories();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2">
          <div className="animate-fade-up text-center lg:text-left">
            <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              New collection
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Gifts that make <span className="text-primary">special moments</span> unforgettable
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground lg:mx-0">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/shop">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl lg:aspect-square">
            <div className="absolute -inset-4 rounded-[2rem] bg-brand-gradient opacity-20 blur-2xl" aria-hidden />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border-4 border-card shadow-2xl">
              <Image
                src="https://picsum.photos/seed/sos-hero/1000/1000"
                alt="A curated selection of ornaments and gifts"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                data-ai-hint="jewelry gifts"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="container grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="py-16 sm:py-20">
        <div className="container">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">Our customers&apos; favourites, hand-picked for you.</p>
            </div>
            <Button asChild variant="ghost" className="text-primary">
              <Link href="/shop">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Shop by category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className="rounded-full border bg-card px-5 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="text-3xl font-bold sm:text-4xl">Looking for the perfect gift?</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Tell us who it&apos;s for and your budget — we&apos;ll help you pick something they&apos;ll treasure.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 rounded-full px-8">
            <Link href="/contact">Ask us</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
