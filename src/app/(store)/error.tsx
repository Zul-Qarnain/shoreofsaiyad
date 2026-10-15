"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function StoreError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex max-w-lg flex-col items-center py-24 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">An unexpected error occurred. Please try again.</p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
