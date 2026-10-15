import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email address.").max(120),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(10, "Message should be at least 10 characters.").max(2000),
});

export type ContactValues = z.infer<typeof contactSchema>;
