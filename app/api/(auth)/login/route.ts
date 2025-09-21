import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // 🔑 Verify Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(token);

    // 🔎 Fetch user subscription from Firestore
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
    const userData = userDoc.data() || {};
    const subscriptionStatus = userData.subscriptionStatus || "inactive";

    // 🍪 Save session in cookies (for middleware checks)
    const res = NextResponse.json({
      success: true,
      subscriptionStatus,
    });

    res.cookies.set("__session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 100000, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
