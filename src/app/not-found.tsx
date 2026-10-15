import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <p className="font-headline text-7xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="max-w-md text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    </div>
  );
}
