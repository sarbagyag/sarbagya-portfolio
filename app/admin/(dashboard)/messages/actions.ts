"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, contactMessages } from "@/db";

export async function markMessageRead(id: string) {
  await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
}
