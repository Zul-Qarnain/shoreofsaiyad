const takaFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats an amount in Bangladeshi Taka, e.g. `৳1,250.00`. */
export function formatPrice(amount: number): string {
  return `৳${takaFormatter.format(amount)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
