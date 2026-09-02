// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

import { NextRequest, NextResponse } from "next/server";

// export default function proxy(request: NextRequest) {
//   const sessionCookie = request.cookies.get("better-auth.session_token");

//   console.log("PROXY:", request.nextUrl.pathname);
//   console.log("SESSION COOKIE:", sessionCookie);

//   if (!sessionCookie) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/private/:path*"],
// };

export default function proxy(request: NextRequest) {
     return NextResponse.next()
}