import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // ✅ Safely cast req for NextAuth
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });

  // Allow public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login
  if (token && pathname === "/login") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/products/:path*", "/login"],
};
