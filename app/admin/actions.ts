"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_TOKEN_COOKIE } from "@/lib/api/server";

export async function signOut() {
  const store = await cookies();
  store.delete(ADMIN_TOKEN_COOKIE);
  redirect("/admin/login");
}
