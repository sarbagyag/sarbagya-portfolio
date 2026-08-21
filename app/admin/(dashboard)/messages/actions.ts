"use server";

import { revalidatePath } from "next/cache";
import { adminFetch } from "@/lib/api/server";

export async function markMessageRead(id: string) {
  await adminFetch(`/api/admin/messages/${id}/read`, { method: "PATCH" });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await adminFetch(`/api/admin/messages/${id}`, { method: "DELETE" });
  revalidatePath("/admin/messages");
}
