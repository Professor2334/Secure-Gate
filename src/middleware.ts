import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isVerifyNoticePage = pathname.startsWith("/verify-notice");

  // Create base redirect target
  let response = NextResponse.next();

  // If visiting an auth page
  if (isAuthPage) {
    if (token) {
      if (token.emailVerified) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/verify-notice", req.url));
    }
  }

  // If visiting dashboard routes
  if (isDashboardPage) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Force email verification check
    if (!token.emailVerified) {
      return NextResponse.redirect(new URL("/verify-notice", req.url));
    }
  }

  // If visiting verify notice page
  if (isVerifyNoticePage) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.emailVerified) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Inject HTTP Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password/:path*",
    "/verify-notice",
  ],
};
