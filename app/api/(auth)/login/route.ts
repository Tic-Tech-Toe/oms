import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
   

    const response = NextResponse.json({ status: "success" });

    response.cookies.set("__session", "mockSessionCookie", {
      maxAge: 60 * 60 * 24 * 5,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Session creation failed:", error);
    return NextResponse.json(
      { status: "error", message: "Login failed" },
      { status: 401 }
    );
  }
}
