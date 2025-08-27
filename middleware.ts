// /middleware.ts
import { NextRequest, NextResponse } from "next/server";

function decodeJwt(token: string) {
  try {
    const base64Payload = token.split(".")[1]; // grab the payload
    const payload = Buffer.from(base64Payload, "base64").toString("utf-8");
    return JSON.parse(payload);
  } catch (err) {
    console.error("Invalid session token", err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("__session")?.value;
  const { pathname } = request.nextUrl;

  if (!session && ["/orders", "/invite"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (session) {
    const payload = decodeJwt(session); // ✅ decode instead of JSON.parse

    if (!payload) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const { email } = payload;
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (pathname === "/invite" && email !== adminEmail) {
      return NextResponse.redirect(new URL("/orders", request.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/orders/:path*", "/invite", "/subscribe"],
};
