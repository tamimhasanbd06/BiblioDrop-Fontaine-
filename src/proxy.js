import { NextResponse } from "next/server";

export async function proxy(request) {
  const cookieName = process.env.JWT_COOKIE_NAME || "bd_token";
  const token = request.cookies.get(cookieName)?.value;


  if (!token) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
