"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ApiError, publicFetch } from "@/lib/api/server";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Enter a valid email"),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await publicFetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Could not send your message. Try again in a moment.";
    return { success: false, error: message };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}
