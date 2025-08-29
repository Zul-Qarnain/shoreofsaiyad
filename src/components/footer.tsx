import Link from "next/link";
import { Twitter, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background text-foreground/80 font-body">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:justify-between md:space-y-0">
            <div className="flex space-x-6">
                <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                    Privacy Policy
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                    Terms of Service
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                    Shipping & Returns
                </Link>
            </div>
             <div className="flex space-x-4">
                <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
                prefetch={false}
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
                prefetch={false}
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
                prefetch={false}
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gift Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
