"use client";

import { useState } from "react";
import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

type Vote = "up" | "down" | undefined;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-4 w-4", i < rating ? "fill-gold text-gold" : "text-muted-foreground/40")} />
      ))}
    </div>
  );
}

export function ProductReviews({ reviews }: { reviews: Review[] }) {
  // One vote per review per visitor; toggling the same button removes the vote.
  const [votes, setVotes] = useState<Record<string, Vote>>({});

  const toggle = (id: string, vote: "up" | "down") =>
    setVotes((prev) => ({ ...prev, [id]: prev[id] === vote ? undefined : vote }));

  return (
    <section id="reviews" className="mt-16 scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No reviews yet for this product.</p>
      ) : (
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {reviews.map((review) => {
            const vote = votes[review.id];
            return (
              <li key={review.id} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-secondary font-semibold text-primary">
                      {review.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="text-xs">Helpful?</span>
                  <button
                    type="button"
                    aria-pressed={vote === "up"}
                    onClick={() => toggle(review.id, "up")}
                    className={cn("flex items-center gap-1.5 hover:text-primary", vote === "up" && "text-primary")}
                  >
                    <ThumbsUp className="h-4 w-4" /> {review.likes + (vote === "up" ? 1 : 0)}
                  </button>
                  <button
                    type="button"
                    aria-pressed={vote === "down"}
                    onClick={() => toggle(review.id, "down")}
                    className={cn("flex items-center gap-1.5 hover:text-destructive", vote === "down" && "text-destructive")}
                  >
                    <ThumbsDown className="h-4 w-4" /> {review.dislikes + (vote === "down" ? 1 : 0)}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
