"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/lib/site";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Message should be at least 10 characters.").max(2000),
});

type ContactValues = z.infer<typeof contactSchema>;

/**
 * There is no mail backend yet, so the message is handed to the visitor's email
 * client via a pre-filled mailto: link. Swap `onSubmit` for a server action once
 * an email provider is configured.
 */
export function ContactForm() {
  const { toast } = useToast();
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = (values: ContactValues) => {
    const body = [values.message, "", `— ${values.name}`, values.email, values.phone].filter(Boolean).join("\n");
    const href = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(
      `Message from ${values.name}`
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    toast({ title: "Opening your email app…", description: `Your message is addressed to ${siteConfig.supportEmail}.` });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>
                Phone <span className="font-normal text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input type="tel" autoComplete="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="sm:col-span-2">
          <Send className="mr-2 h-4 w-4" /> Send Message
        </Button>
      </form>
    </Form>
  );
}
