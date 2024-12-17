import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/auth/login", "/auth/register"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (token && publicRoutes.includes(pathname)) {
    const dashboardUrl = new URL("/dashboard/products", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (!token && !publicRoutes.includes(pathname)) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
