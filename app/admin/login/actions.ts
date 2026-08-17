"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_TOKEN_COOKIE, ApiError, publicFetch } from "@/lib/api/server";

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // matches the Go API's 7-day JWT expiry

export async function signIn(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let token: string;
  try {
    const res = await publicFetch<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    token = res.token;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 400)) {
      return { error: "Invalid email or password." };
    }
    return { error: "Could not reach the server. Try again in a moment." };
  }

  const store = await cookies();
  store.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  });

  redirect("/admin");
}
