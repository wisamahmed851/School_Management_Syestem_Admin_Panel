import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The matcher below excludes /login and static assets, so every request reaching
// this function is a protected route. Presence of the cookie is UX only; the
// backend validates the token on every API call.
export function proxy(request: NextRequest) {
  if (!request.cookies.get("access_token")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)",
  ],
};
