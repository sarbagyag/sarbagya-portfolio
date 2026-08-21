import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/api/constants";

// Protects /admin/* — redirects to /admin/login when there's no session
// cookie, and bounces an already-logged-in visitor away from /admin/login.
// This is a UX gate only, not the security boundary: the cookie's presence
// is all that's checked here (no JWT signature verification at the edge —
// that would need the JWT secret available to the Vercel deployment too).
// The Go API re-validates the token's signature on every /api/admin/*
// call regardless, so a forged/expired cookie just gets a 401 there,
// which lib/api/server.ts's adminFetch turns into a redirect right back
// to /admin/login. Single seeded admin user, no public signup.
export function middleware(request: NextRequest) {
  const hasToken = Boolean(request.cookies.get(ADMIN_TOKEN_COOKIE)?.value);
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLoginPage && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isLoginPage && hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
