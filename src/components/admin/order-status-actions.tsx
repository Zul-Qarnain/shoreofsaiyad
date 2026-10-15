"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setMessageReadAction, updateOrderStatusAction } from "@/app/admin/actions";
import { allowedTransitions } from "@/lib/inventory";
import type { OrderStatus } from "@/types";

const LABELS: Record<OrderStatus, string> = {
  "Pending Verification": "Pending",
  Confirmed: "Confirm",
  Shipped: "Mark shipped",
  Delivered: "Mark delivered",
  Cancelled: "Cancel",
};

export function OrderStatusActions({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const next = allowedTransitions(status);
  if (next.length === 0) return null;

  const change = (to: OrderStatus) => {
    if (to === "Cancelled" && !window.confirm(`Cancel order ${orderId}? Its items will be returned to stock.`)) return;
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, to);
      if (!result.ok) toast({ variant: "destructive", title: "Update failed", description: result.error });
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {next.map((to) => (
        <Button
          key={to}
          size="sm"
          variant={to === "Cancelled" ? "outline" : "default"}
          disabled={pending}
          onClick={() => change(to)}
        >
          {LABELS[to]}
        </Button>
      ))}
    </div>
  );
}

export function MessageReadToggle({ id, read }: { id: string; read: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await setMessageReadAction(id, !read);
          if (!result.ok) toast({ variant: "destructive", title: "Update failed", description: result.error });
          router.refresh();
        })
      }
    >
      {read ? "Mark unread" : "Mark read"}
    </Button>
  );
}
