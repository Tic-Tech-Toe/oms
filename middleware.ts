import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("__session")?.value;
  const { pathname } = request.nextUrl;

  // If not logged in
  if (!session && ["/orders", "/invite"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If logged in and accessing /invite, check email
  if (session && pathname === "/invite") {
    try {
      const payload = JSON.parse(
        Buffer.from(session.split(".")[1], "base64").toString()
      );

      const userEmail = payload.email;
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      if (userEmail !== adminEmail) {
        return NextResponse.redirect(new URL("/orders", request.url));
      }
    } catch (err) {
      console.error("Invalid session token", err);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/orders/:path*", "/invite"],
};
