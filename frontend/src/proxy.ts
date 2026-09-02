import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie && process.env.NEXT_PUBLIC_USE_MOCK !== "true") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/private/:path*"],
};
