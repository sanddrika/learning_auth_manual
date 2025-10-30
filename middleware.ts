import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/src/lib/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const session = token ? verifyToken(token) : null;
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
