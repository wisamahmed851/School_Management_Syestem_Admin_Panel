import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all (dashboard) group routes
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admins") ||
    pathname.startsWith("/roles") ||
    pathname.startsWith("/permissions") ||
    pathname.startsWith("/teachers") ||
    pathname.startsWith("/guardians") ||
    pathname.startsWith("/classes") ||
    pathname.startsWith("/students") ||
    pathname.startsWith("/subjects") ||
    pathname.startsWith("/class-subjects") ||
    pathname.startsWith("/attendance") ||
    pathname.startsWith("/assignments") ||
    pathname.startsWith("/exams");

  if (isDashboardRoute) {
    const token = request.cookies.get("access_token");
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)",
  ],
};
