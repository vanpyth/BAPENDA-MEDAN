import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Protected routes that require authentication
const PROTECTED_PATHS = ["/dashboard", "/profil"];

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. Allow public access to GET news (IMPORTANT FIX)
  if (pathname.startsWith("/api/cms/news") && req.method === "GET") {
     return NextResponse.next();
  }

  // 2. Check general protected paths (non-API)
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Admin/Officer/Mahasiswa guards (dashboard)
  const role = token?.role as string;
  if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN" && role !== "DEVELOPER" && role !== "OFFICER") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/dashboard/petugas") && role !== "OFFICER" && role !== "ADMIN" && role !== "DEVELOPER") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/dashboard/mahasiswa") && role !== "MAHASISWA" && role !== "ADMIN" && role !== "DEVELOPER") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/cms/:path*", "/profil/:path*"],
};
